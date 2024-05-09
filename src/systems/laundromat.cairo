use starknet::ContractAddress;

#[starknet::interface]
trait ILaundromat<T> {
    fn register_score(self: @T, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress);
    fn launder(self: @T, season_version: u16);

    fn claim(self: @T, season_version: u16, player_id: ContractAddress, game_ids: Span<u32>);
    fn claim_treasury(self: @T);
    fn supercharge_jackpot(self: @T, season_version: u16, amount_eth: u32);
}

#[dojo::contract]
mod laundromat {
    use rollyourown::models::game::GameTrait;
use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait},
            ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait},
        },
        models::{season::{Season, SeasonImpl, SeasonTrait}, game::{Game, GameImpl}},
        helpers::season_manager::{SeasonManagerImpl, SeasonManagerTrait},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        utils::{
            sorted_list::{SortedListItem, SortedListImpl, SortedListTrait},
            payout_structure::{get_payout, get_payed_count}
        },
        packing::game_store::{GameStore, GameStoreImpl}
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn register_score(
            self: @ContractState, game_id: u32, prev_game_id: u32, prev_player_id: ContractAddress
        ) {
            let world = self.world();
            let player_id = get_caller_address();

            let mut game = GameImpl::get(world, game_id, player_id);
            let season = get!(world, (game.season_version), (Season));

            // check if valid game
            assert(game.exists(), 'invalid game');
            // check dat game exists & is game_over
            assert(game.game_over, 'game is not over');
            // check not already registered
            assert(!game.registered, 'already registered');
            // check if season is still opened
            assert(season.is_open(), 'season has closed');

            // register final_score
            let mut game_store = GameStoreImpl::get(world, game);
            game.final_score = game_store.player.cash;
            game.registered = true;
            set!(world, (game));

            // retrieve Season SortedList 
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(world, list_id);

            // add Game to sorted_list
            sorted_list.add(world, game, (prev_game_id, prev_player_id));
        // TODO : emit event 
        }

        fn launder(self: @ContractState, season_version: u16) {
            let world = self.world();

            let season = get!(world, (season_version), (Season));

            let ryo_config_manager = RyoConfigManagerTrait::new(world);
            let mut ryo_config = ryo_config_manager.get();

            // retrieve paper address 
            let paper_address = RyoAddressManagerTrait::new(world).paper();
            let paper_reward_launderer: u256 = ryo_config.paper_reward_launderer.into() * ETHER;

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
                sorted_list.process::<Game>(world, 2); // TODO: change batch_size
            }
  
            // if process, create new season
            if sorted_list.processed {
                // retrieve next season
                let next_season = get!(world, (season_version + 1), (Season));

                // check if not already created
                if !next_season.exists() {
                    // update current version 
                    ryo_config.season_version += 1;
                    ryo_config_manager.set(ryo_config);

                    // create new season
                    let mut season_manager = SeasonManagerTrait::new(world);
                    season_manager.new_season(ryo_config.season_version);
                } else {
                    assert(false, 'launder already ended');
                }
            };

            // reward launderer with some clean paper
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_reward_launderer);
        }

        fn claim(
            self: @ContractState,
            season_version: u16,
            player_id: ContractAddress,
            game_ids: Span<u32>,
        ) {
            let world = self.world();
            let mut game_ids = game_ids;

            // retrieve season
            let season = get!(world, (season_version), (Season));

            // retrieve Season SortedList   
            let list_id = season_version.into();
            let mut sorted_list = SortedListImpl::get(world, list_id);
            let entrants = sorted_list.size;

            // check max batch size
            assert(game_ids.len() <= 10, 'too much game_ids');
            // check season status
            assert(sorted_list.locked, 'season has not ended');
            assert(sorted_list.processed, 'need more launder');

            // any other check missing ?

            let mut total_claimable = 0;

            while let Option::Some(game_id) = game_ids
                .pop_front() {
                    let mut game = get!(world, (*game_id, player_id), (Game));

                    assert(game.registered, 'unregistered game');
                    assert(game.position > 0, 'invalid position');
                    assert(!game.claimed, 'already claimed');

                    total_claimable += game.claimable;

                    // update claimed & save
                    game.claimed = true;
                    set!(world, (game));
                };

            // retrieve paper address 
            let paper_address = RyoAddressManagerTrait::new(world).paper();
            let total_claimable: u256 = total_claimable.into() * ETHER;

            // transfer reward to player_id
            IPaperDispatcher { contract_address: paper_address }
                .transfer(player_id, total_claimable);
        // TODO: event ?
        }

        fn claim_treasury(self: @ContractState) {
            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable: u256 = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            ryo_config_manager.set(ryo_config);

            let ryo_addresses_manager = RyoAddressManagerTrait::new(self.world());

            // transfer claimable to treasury
            IPaperDispatcher { contract_address: ryo_addresses_manager.paper() }
                .transfer(ryo_addresses_manager.treasury(), claimable);
        }

        fn supercharge_jackpot(self: @ContractState, season_version: u16, amount_eth: u32) {
            let world = self.world();
            // retrieve season
            let mut season = get!(world, (season_version), (Season));

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if still open
            assert(season.is_open(), 'season has ended');

            // update season paper_balance & save
            season.paper_balance += amount_eth;
            set!(world, (season));

            // retrieve paper address 
            let paper_address = RyoAddressManagerTrait::new(world).paper();
            let amount = amount_eth.into() * ETHER;

            // transfer paper_fee_ether from donnator to laundromat ( donnator approved laundromat contract to spend paper before)
            IPaperDispatcher { contract_address: paper_address }
                .transfer_from(get_caller_address(), get_contract_address(), amount);
        }
    }
// #[generate_trait]
// impl InternalImpl of InternalTrait {
//     #[inline(always)]
//     fn assert_caller_is_owner(self: @ContractState) {
//         assert(
//             self.world().is_owner(get_caller_address(), get_contract_address().into()),
//             'not owner'
//         );
//     }
// }
}
