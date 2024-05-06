#[starknet::interface]
trait ILaundromat<T> {
    fn launder(self: @T, season: u16);

    fn claim(self: @T, season: u16);
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
        models::{season::{Season}}, helpers::season_manager::{SeasonManagerTrait},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}


    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn launder(self: @ContractState, season: u16) {}


        fn claim(self: @ContractState, season: u16) {
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
