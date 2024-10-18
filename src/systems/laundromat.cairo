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
    use rollyourown::library::store::IStore;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use rollyourown::{
        config::{ryo::{RyoConfig}, ryo_address::{RyoAddress},},
        models::{season::{Season, SeasonImpl, SeasonTrait}, game::{Game, GameImpl, GameTrait}},
        helpers::season_manager::{SeasonManagerImpl, SeasonManagerTrait},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
        utils::{
            sorted_list::{SortedListItem, SortedListImpl, SortedListTrait},
            payout_structure::{get_payout, get_payed_count}, random::{RandomImpl},
            vrf_consumer::{VrfImpl, Source},
        },
        packing::game_store::{GameStore, GameStoreImpl}
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        NewHighScore: NewHighScore,
    }

    #[derive(Drop, starknet::Event)]
    struct NewHighScore {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        #[key]
        season_version: u16,
        player_name: felt252,
        hustler_id: u16,
        cash: u32,
        health: u8,
        reputation: u8,
    }

    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn register_score(
            self: @ContractState, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress
        ) {
            let world = self.world();
            let player_id = get_caller_address();

            let mut game = self.s().game(game_id, player_id);
            let season = self.s().season(game.season_version);

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
            let mut game_store = GameStoreImpl::load(self.s(), game_id, player_id);
            game.final_score = game_store.player.cash;
            game.registered = true;
            self.s().set_game(game);

            // handle new highscore & season version
            let season_manager = SeasonManagerTrait::new(self.s());
            season_manager.on_register_score(ref game_store);

            // retrieve Season SortedList 
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(world, list_id);

            // add Game to sorted_list
            sorted_list.add(world, game, (prev_game_id, prev_player_id));
        }

        fn launder(self: @ContractState, season_version: u16) {
            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = VrfImpl::consume(ryo_addresses.vrf, Source::Nonce(player_id));

            let world = self.world();
            let process_batch_size = 20; // around 276k steps / 10

            let season = self.s().season(season_version);

            let mut ryo_config = self.s().ryo_config();

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if close
            assert(!season.is_open(), 'season is still opened');

            // retrieve Season SortedList   
            let list_id = season_version.into();
            let mut sorted_list = SortedListImpl::get(world, list_id);

            // set process_max_size && lock list 
            if !sorted_list.locked {
                let process_max_size = get_payed_count(sorted_list.size);
                sorted_list.lock(world, process_max_size);
            }

            // if not process, process batch_size items
            if !sorted_list.processed {
                sorted_list.process::<Game>(world, process_batch_size); 
            }

            // if process, create new season
            if sorted_list.processed {
                // retrieve next season
                let next_season = self.s().season(season_version + 1);

                // check if not already created
                if !next_season.exists() {
                    // update current version 
                    ryo_config.season_version += 1;

                    self.s().save_ryo_config(ryo_config);

                    // create new season
                    let mut randomizer = RandomImpl::new(random);
                    let mut season_manager = SeasonManagerTrait::new(self.s());
                    season_manager.new_season(ref randomizer, ryo_config.season_version);
                } else {
                    assert(false, 'launder already ended');
                }
            };

            // retrieve paper address 
            let paper_address = self.s().ryo_addresses().paper;
            let paper_reward_launderer: u256 = ryo_config.paper_reward_launderer.into() * ETHER;

            // reward launderer with some clean paper
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_reward_launderer);
        }

        fn claim(self: @ContractState, player_id: ContractAddress, game_ids: Span<u32>,) {
            let world = self.world();
            let mut game_ids = game_ids;

            // check max batch size
            assert(game_ids.len() <= 10, 'too much game_ids');

            let mut total_claimable = 0;

            while let Option::Some(game_id) = game_ids
                .pop_front() {
                    let mut game = self.s().game(*game_id, player_id);

                    // // retrieve season
                    // let season = self.s().season(game.season_version);

                    // retrieve Season SortedList   
                    let list_id = game.season_version.into();
                    let mut sorted_list = SortedListImpl::get(world, list_id);
                    // let entrants = sorted_list.size;

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
                    self.s().set_game(game);
                };

            // retrieve paper address 
            let paper_address = self.s().ryo_addresses().paper;
            let total_claimable: u256 = total_claimable.into() * ETHER;

            // transfer reward to player_id
            IPaperDispatcher { contract_address: paper_address }
                .transfer(player_id, total_claimable);
        // TODO: event ?
        }

        fn claim_treasury(self: @ContractState) {
            let mut ryo_config = self.s().ryo_config();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable: u256 = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            self.s().save_ryo_config(ryo_config);

            let ryo_addresses = self.s().ryo_addresses();
            // transfer claimable to treasury
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer(ryo_addresses.treasury, claimable);
        }

        fn supercharge_jackpot(self: @ContractState, season_version: u16, amount_eth: u32) {
            // retrieve season
            let mut season = self.s().season(season_version);

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if still open
            assert(season.is_open(), 'season has ended');

            // update season paper_balance & save
            season.paper_balance += amount_eth;
            self.s().save_season(season);

            // retrieve paper address 
            let ryo_addresses = self.s().ryo_addresses();
            let amount = amount_eth.into() * ETHER;

            // transfer paper_fee_ether from donnator to laundromat ( donnator approved laundromat contract to spend paper before)
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer_from(get_caller_address(), get_contract_address(), amount);
        }
    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}
