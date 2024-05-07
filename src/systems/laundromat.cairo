use starknet::ContractAddress;

#[starknet::interface]
trait ILaundromat<T> {
    fn launder(self: @T, season_version: u16);

    fn claim(self: @T, season: u16, game_ids: Span<u32>, player_id: ContractAddress);
    fn claim_treasury(self: @T);
}

#[dojo::contract]
mod laundromat {
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait},
            ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait},
        },
        models::{season::{Season}, game::{Game}} , helpers::season_manager::{SeasonManagerTrait},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        utils::{sorted_list::{SortedListItem, SortedListImpl, SortedListTrait}, payout_structure::{get_payed_count}}
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}


    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn launder(self: @ContractState, season_version: u16) {
            let world = self.world();

            let season = get!(world, (season_version), (Season));

            assert(season.season_duration > 0, 'invalid season_version');
            // TODO: check season_version / status

            // retrieve Season Sorted List   
            let list_id = pedersen::pedersen('SeasonLeaderboard', season_version.into());
            let mut sorted_list = SortedListImpl::get(world, list_id);


            // TODO : MOVE 

            // set process_max_size && lock list 
            if !sorted_list.locked {
                let process_max_size = get_payed_count(sorted_list.size);
                sorted_list.lock(world, process_max_size);
            }

            assert(sorted_list.locked, 'cannot launder yet');
            assert(!sorted_list.processed, 'launder ended');

            sorted_list.process::<Game>(world, 2); // TODO: change batch_size
         
        }


        fn claim(self: @ContractState, season: u16, game_ids: Span<u32>, player_id: ContractAddress) {
            let world = self.world();
          
            let mut season = get!(world, (season), (Season));
        // // check not claimed
        // assert(!leaderboard.claimed, 'already claimed!');

        // // check if caller is winner
        // assert(leaderboard.player_id == get_caller_address(), 'you aint dat OG!');

        // let leaderboard_manager = LeaderboardManagerTrait::new(world);
        // let current_version = leaderboard_manager.get_current_version();

        // // check if season has end
        // assert(season < current_version, 'season has not ended yet!');

        // // any other check missing ?

        // // update claimed & save
        // leaderboard.claimed = true;
        // set!(world, (leaderboard));

        // // retrieve paper address 
        // let paper_address = RyoAddressManagerTrait::new(world).paper();
        // let paper_jackpot_eth: u256 = leaderboard.paper_balance.into() * ETHER;

        // // transfer reward
        // IPaperDispatcher { contract_address: paper_address }
        //     .transfer(get_caller_address(), paper_jackpot_eth);
        }

        fn claim_treasury(self: @ContractState) {// // check if owner ???   TODO: check if ok
        // // self.assert_caller_is_owner();

        // let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
        // let mut ryo_config = ryo_config_manager.get();

        // assert(ryo_config.treasury_balance > 0, 'nothin to claim');

        // // calc claimable amount
        // let claimable_eth: u256  = ryo_config.treasury_balance.into() * ETHER;

        // // reset treasury_balance
        // ryo_config.treasury_balance = 0;
        // ryo_config_manager.set(ryo_config);

        // let ryo_addresses_manager = RyoAddressManagerTrait::new(self.world());

        // // transfer claimable_eth to treasury
        // IPaperDispatcher { contract_address: ryo_addresses_manager.paper() }
        //     .transfer(ryo_addresses_manager.treasury(), claimable_eth);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'not owner'
            );
        }
    }
}
