use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IRyo<T> {
    //
    fn initialize(
        self: @T,
        paper_address: ContractAddress,
        treasury_address: ContractAddress,
        laundromat_address: ContractAddress
    );
    fn set_paused(self: @T, paused: bool);
    fn set_paper_fee(self: @T, fee: u16);
    fn set_treasury_fee_pct(self: @T, fee_pct: u8);
    fn set_season_duration(self: @T, duration_sec: u32);

    // 
    fn paper(self: @T) -> ContractAddress;
    fn treasury(self: @T) -> ContractAddress;
    fn laundromat(self: @T) -> ContractAddress;

    fn paused(self: @T) -> bool;
    fn paper_fee(self: @T) -> u16;
    fn season_duration(self: @T) -> u32;
}

#[dojo::contract]
mod ryo {
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::{get_caller_address, get_contract_address};
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;

    use rollyourown::{
        config::{
            ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait},
            ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait},
        },
        models::{season::Season,}, utils::random::{RandomImpl},
        helpers::season_manager::{SeasonManager, SeasonManagerTrait},
    };

    const THREE_MIN: u16 = 180;
    const THIRTY_MIN: u32 = 1800; // 20 * 60
    const FEW_MIN: u32 = 1200; // 20 * 60
    const ONE_HOUR: u32 = 3600; // 60 * 60
    const ONE_DAY: u32 = 86_400; // 24 * 60 * 60
    const ONE_WEEK: u32 = 604_800; // 7 * 86_400;

    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn initialize(
            self: @ContractState,
            paper_address: ContractAddress,
            treasury_address: ContractAddress,
            laundromat_address: ContractAddress
        ) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            assert(ryo_config.initialized == false, 'Already initialized');

            // consume first world uuid = 0
            let _ = self.world().uuid();

            // RyoConfig
            ryo_config.initialized = true;
            ryo_config.paused = false;

            ryo_config.season_version = 1;
            ryo_config.season_duration = FEW_MIN; // ONE_WEEK
            ryo_config.season_time_limit = THREE_MIN; // ONE_HOUR

            ryo_config.paper_fee = 1000; // in ether
            ryo_config.treasury_fee_pct = 5;
            ryo_config.paper_reward_launderer = 100; // in ether

            // save 
            ryo_config_manager.set(ryo_config);

            // RyoAddresses
            let ryo_addresses_manager = RyoAddressManagerTrait::new(self.world());
            let mut ryo_addresses = ryo_addresses_manager.get();

            ryo_addresses.paper = paper_address;
            ryo_addresses.treasury = treasury_address;
            ryo_addresses.laundromat = laundromat_address;

            // save 
            ryo_addresses_manager.set(ryo_addresses);

            // Season
            let season_manager = SeasonManagerTrait::new(self.world());
            season_manager.new_season(ryo_config.season_version);
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


        fn set_treasury_fee_pct(self: @ContractState, fee_pct: u8) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            ryo_config.treasury_fee_pct = fee_pct;
            ryo_config_manager.set(ryo_config);
        }

        fn set_season_duration(self: @ContractState, duration_sec: u32) {
            self.assert_caller_is_owner();

            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            ryo_config.season_duration = duration_sec;
            ryo_config_manager.set(ryo_config);
        }


        //
        // getters
        //

        fn paper(self: @ContractState) -> ContractAddress {
            RyoAddressManagerTrait::new(self.world()).paper()
        }

        fn treasury(self: @ContractState) -> ContractAddress {
            RyoAddressManagerTrait::new(self.world()).treasury()
        }

        fn laundromat(self: @ContractState) -> ContractAddress {
            RyoAddressManagerTrait::new(self.world()).laundromat()
        }


        fn paused(self: @ContractState) -> bool {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.paused
        }

        fn paper_fee(self: @ContractState) -> u16 {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.paper_fee
        }

        fn season_duration(self: @ContractState) -> u32 {
            let ryo_config = RyoConfigManagerTrait::new(self.world()).get();
            ryo_config.season_duration
        }
    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {
        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'not owner'
            );
        }
    }
}

