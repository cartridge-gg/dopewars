use starknet::ContractAddress;

#[starknet::interface]
trait ILaundromat<T> {
    fn register_score(self: @T, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress);
    fn launder(self: @T, season_version: u16);

    fn claim(self: @T, player_id: ContractAddress, game_ids: Span<u32>);
    fn claim_treasury(self: @T);
    fn supercharge_jackpot(self: @T, season_version: u16, amount_eth: u32);
}

#[dojo::contract]
mod laundromat {
    use achievement::store::{Store as BushidoStore, StoreTrait as BushidoStoreTrait};
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::world::IWorldDispatcherTrait;
    use rollyourown::elements::quests::{types::{Quest, QuestTrait}};

    use rollyourown::{
        config::{ryo::{RyoConfig}, ryo_address::{RyoAddress},},
        models::{season::{Season, SeasonImpl, SeasonTrait}, game::{Game, GameImpl, GameTrait}},
        helpers::season_manager::{SeasonManagerImpl, SeasonManagerTrait},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        store::{Store, StoreImpl, StoreTrait},
        utils::{
            sorted_list::{SortedListItem, SortedListImpl, SortedListTrait},
            payout_structure::{get_payout, get_payed_count}, random::{RandomImpl},
        },
        packing::game_store::{GameStore, GameStoreImpl}, events::{NewSeason, Claimed}
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn register_score(
            self: @ContractState, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress
        ) {
            let world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let player_id = get_caller_address();

            let mut game = store.game(game_id, player_id);
            let season = store.season(game.season_version);

            // check if valid game
            assert(game.exists(), 'invalid game');
            // check if ranked game
            assert(game.is_ranked(), 'game is not ranked');
            // check dat game exists & is game_over
            assert(game.game_over, 'game is not over');
            // check not already registered
            assert(!game.registered, 'already registered');
            // check if season is still opened
            assert(season.is_open(), 'season has closed');

            // register final_score
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);
            game.final_score = game_store.player.cash;
            game.registered = true;
            store.set_game(@game);

            // handle new highscore & season version
            let mut season_manager = SeasonManagerTrait::new(store);
            season_manager.on_register_score(ref game_store);

            // retrieve Season SortedList
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);

            // add Game to sorted_list
            sorted_list.add(ref store, game, (prev_game_id, prev_player_id));

            // quests
            let bushido_store = BushidoStoreTrait::new(world);
            let quest_id = Quest::Hustler.identifier(0);
            bushido_store.progress(player_id.into(), quest_id, 1, starknet::get_block_timestamp());

            if game_store.player.reputation == 100 {
                let quest_id = Quest::Famous.identifier(0);
                bushido_store
                    .progress(player_id.into(), quest_id, 1, starknet::get_block_timestamp());
            }
        }

        fn launder(self: @ContractState, season_version: u16) {
            let world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            let process_batch_size = 10; // around 276k steps / 10

            let season = store.season(season_version);

            let mut ryo_config = store.ryo_config();

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if close
            assert(!season.is_open(), 'season is still opened');

            // retrieve Season SortedList
            let list_id = season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);

            // set process_max_size && lock list
            if !sorted_list.locked {
                let process_max_size = get_payed_count(sorted_list.size);
                sorted_list.lock(ref store, process_max_size);
            }

            // if not process, process batch_size items
            if !sorted_list.processed {
                sorted_list.process::<Game>(ref store, process_batch_size);
            }

            // if process, create new season
            if sorted_list.processed {
                // retrieve next season
                let next_season = store.season(season_version + 1);

                // check if not already created
                if !next_season.exists() {
                    // update current version
                    ryo_config.season_version += 1;

                    store.save_ryo_config(@ryo_config);

                    // create new season
                    let mut randomizer = RandomImpl::new(random);
                    let mut season_manager = SeasonManagerTrait::new(store);
                    season_manager.new_season(ref randomizer, ryo_config.season_version);

                    // emit NewSeason
                    store
                        .world
                        .emit_event(
                            @NewSeason {
                                key: ryo_config.season_version,
                                season_version: ryo_config.season_version
                            }
                        );
                } else {
                    assert(false, 'launder already ended');
                }
            };

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let paper_reward_launderer: u256 = ryo_config.paper_reward_launderer.into() * ETHER;

            // reward launderer with some clean paper
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_reward_launderer);

            let quest_id = Quest::Launderer.identifier(0);
            let bushido_store = BushidoStoreTrait::new(world);
            bushido_store.progress(player_id.into(), quest_id, 1, starknet::get_block_timestamp());
        }

        fn claim(self: @ContractState, player_id: ContractAddress, game_ids: Span<u32>,) {
            let world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let mut game_ids = game_ids;

            // check max batch size
            assert(game_ids.len() <= 10, 'too much game_ids');

            let mut total_claimable = 0;

            while let Option::Some(game_id) = game_ids.pop_front() {
                let mut game = store.game(*game_id, player_id);

                // retrieve Season SortedList
                let list_id = game.season_version.into();
                let mut sorted_list = SortedListImpl::get(@store, list_id);

                // check season status
                assert(sorted_list.locked, 'season has not ended');
                assert(sorted_list.processed, 'need more launder');

                // any other check missing ?
                assert(game.registered, 'unregistered game');
                assert(game.position > 0, 'invalid position');
                assert(!game.claimed, 'already claimed');

                total_claimable = total_claimable + game.claimable;

                // update claimed & save
                game.claimed = true;
                store.set_game(@game);

                // emit Claimed event
                // emit NewSeason
                store
                    .world
                    .emit_event(
                        @Claimed {
                            game_id: game.game_id,
                            player_id,
                            season_version: game.season_version,
                            paper: game.claimable,
                            rank: game.position
                        }
                    );

                if game.position == 1 {
                    //
                    let quest_id = Quest::Kingpin.identifier(0);
                    let bushido_store = BushidoStoreTrait::new(world);
                    bushido_store
                        .progress(player_id.into(), quest_id, 1, starknet::get_block_timestamp());
                }
            };

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let total_claimable: u256 = total_claimable.into() * ETHER;

            // transfer reward to player_id
            IPaperDispatcher { contract_address: paper_address }
                .transfer(player_id, total_claimable);
        }

        fn claim_treasury(self: @ContractState) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_config = store.ryo_config();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable: u256 = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            store.save_ryo_config(@ryo_config);

            let ryo_addresses = store.ryo_addresses();
            // transfer claimable to treasury
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer(ryo_addresses.treasury, claimable);
        }

        fn supercharge_jackpot(self: @ContractState, season_version: u16, amount_eth: u32) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            // retrieve season
            let mut season = store.season(season_version);

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if still open
            assert(season.is_open(), 'season has ended');

            // update season paper_balance & save
            season.paper_balance += amount_eth;
            store.save_season(@season);

            // retrieve paper address
            let ryo_addresses = store.ryo_addresses();
            let amount = amount_eth.into() * ETHER;

            // transfer paper_fee_ether from donnator to laundromat ( donnator approved laundromat
            // contract to spend paper before)
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer_from(get_caller_address(), get_contract_address(), amount);
        }
    }
}
