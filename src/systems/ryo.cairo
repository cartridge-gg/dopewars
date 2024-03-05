use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};


#[starknet::interface]
trait IRyo<TContractState> {
    //
    fn initialize(self: @TContractState, paper_address: ContractAddress);
    fn set_paused(self: @TContractState, paused: bool);
    fn set_paper_fee(self: @TContractState, fee: u16);
    //
    fn paused(self: @TContractState) -> bool;
    fn paper(self: @TContractState) -> ContractAddress;
    fn paper_fee(self: @TContractState) -> u16;
}

#[dojo::contract]
mod ryo {
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::{get_caller_address, get_contract_address};
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;

    use rollyourown::{
        config::{ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait}},
        models::{leaderboard::Leaderboard,},
        utils::random::{RandomImpl},
        systems::leaderboard::{LeaderboardManager, LeaderboardManagerTrait},
    };

    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn initialize(self: @ContractState, paper_address: ContractAddress) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            assert(ryo_config.initialized == false, 'Already initialized');

            // RyoConfig
            ryo_config.initialized = true;
            ryo_config.paused = false;
            ryo_config.leaderboard_version = 1;
            ryo_config.paper_address = paper_address;
            ryo_config.paper_fee = 1_000;
            ryo_config_manager.set(ryo_config);

            // Leaderboard
            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            leaderboard_manager.new_leaderboard(ryo_config.leaderboard_version);
        }

        //
        // TODO: test it
        //

        fn set_paused(self: @ContractState, paused: bool) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            ryo_config.paused = paused;
            ryo_config_manager.set(ryo_config);
        }

        fn set_paper_fee(self: @ContractState, fee: u16) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            ryo_config.paper_fee = fee;
            ryo_config_manager.set(ryo_config);
        }


        //
        // getters
        //

        fn paused(self: @ContractState) -> bool {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.paused
        }

        fn paper(self: @ContractState) -> ContractAddress {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.paper_address
        }

        fn paper_fee(self: @ContractState) -> u16 {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.paper_fee
        }

    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {
        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            assert(self.world().is_owner(get_caller_address(), get_contract_address().into()), 'not owner');
        }
    }
}

