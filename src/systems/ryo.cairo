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
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        config::{ryo::{RyoConfig}, ryo_address::{RyoAddress},}, models::{season::Season,},
        utils::random::{RandomImpl}, helpers::season_manager::{SeasonManager, SeasonManagerTrait},
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
    };

    const THREE_MIN: u16 = 120;
    const TEN_MIN: u16 = 600;
    const TWENTY_MIN: u16 = 1200; 
    //
    const THIRTY_MIN: u32 = 1800; 
    const ONE_HOUR: u32 = 3600; 
    const TWO_HOUR: u32 = 7200; 
    const ONE_DAY: u32 = 86_400; 
    const ONE_WEEK: u32 = 604_800; 

    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn initialize(
            self: @ContractState,
            paper_address: ContractAddress,
            treasury_address: ContractAddress,
            laundromat_address: ContractAddress
        ) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            assert(ryo_config.initialized == false, 'Already initialized');

            // consume first world uuid = 0
            let _ = self.world().uuid();

            // RyoConfig
            ryo_config.initialized = true;
            ryo_config.paused = false;

            ryo_config.season_version = 1;
            ryo_config.season_duration = ONE_HOUR; // ONE_WEEK
            ryo_config.season_time_limit = TEN_MIN; // ONE_HOUR

            ryo_config.paper_fee = 1000; // in ether
            ryo_config.treasury_fee_pct = 5;
            ryo_config.paper_reward_launderer = 100; // in ether

            // save 
            self.s().save_ryo_config(ryo_config);

            // RyoAddresses
            let mut ryo_addresses = self.s().ryo_addresses();

            ryo_addresses.paper = paper_address;
            ryo_addresses.treasury = treasury_address;
            ryo_addresses.laundromat = laundromat_address;

            // save 
            self.s().save_ryo_addresses(ryo_addresses);

            // Season
            let mut randomizer = RandomImpl::new('ryo');
            let season_manager = SeasonManagerTrait::new(self.s());
            season_manager.new_season(ref randomizer, ryo_config.season_version);
        }

        //
        // TODO: test it
        //

        fn set_paused(self: @ContractState, paused: bool) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            ryo_config.paused = paused;
            self.s().save_ryo_config(ryo_config);
        }

        fn set_paper_fee(self: @ContractState, fee: u16) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            ryo_config.paper_fee = fee;
            self.s().save_ryo_config(ryo_config);
        }


        fn set_treasury_fee_pct(self: @ContractState, fee_pct: u8) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            ryo_config.treasury_fee_pct = fee_pct;
            self.s().save_ryo_config(ryo_config);
        }

        fn set_season_duration(self: @ContractState, duration_sec: u32) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            ryo_config.season_duration = duration_sec;
            self.s().save_ryo_config(ryo_config);
        }


        //
        // getters
        //

        fn paper(self: @ContractState) -> ContractAddress {
            self.s().ryo_addresses().paper
        }

        fn treasury(self: @ContractState) -> ContractAddress {
            self.s().ryo_addresses().treasury
        }

        fn laundromat(self: @ContractState) -> ContractAddress {
            self.s().ryo_addresses().laundromat
        }


        fn paused(self: @ContractState) -> bool {
            let ryo_config = self.s().ryo_config();
            ryo_config.paused
        }

        fn paper_fee(self: @ContractState) -> u16 {
            let ryo_config = self.s().ryo_config();
            ryo_config.paper_fee
        }

        fn season_duration(self: @ContractState) -> u32 {
            let ryo_config = self.s().ryo_config();
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

        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = self.world().contract('store');
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}
