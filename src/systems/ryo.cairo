use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{config::ryo::{RyoConfig}};

#[starknet::interface]
trait IRyo<T> {
    //
    fn set_paused(self: @T, paused: bool);
    fn update_ryo_config(self: @T, ryo_config: RyoConfig);


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
        config::{ryo::{RyoConfig, RyoConfigImpl}, ryo_address::{RyoAddress},},
        models::{season::Season,}, utils::random::{RandomImpl},
        helpers::season_manager::{SeasonManager, SeasonManagerTrait},
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
    };


    fn dojo_init(
        self: @ContractState,
        paper_address: ContractAddress,
        treasury_address: ContractAddress,
        laundromat_address: ContractAddress
    ) {
        let mut ryo_config = self.s().ryo_config();

        assert(ryo_config.initialized == false, 'Already initialized');

        // initial config
        ryo_config = RyoConfigImpl::build_initial_ryo_config();
        // save
        self.s().save_ryo_config(ryo_config);

        // RyoAddresses
        let mut ryo_addresses = self.s().ryo_addresses();

        ryo_addresses.paper = paper_address;
        ryo_addresses.treasury = treasury_address; // could be removed
        ryo_addresses.laundromat = laundromat_address; // could be removed

        // save
        self.s().save_ryo_addresses(ryo_addresses);

        // Season
        let mut randomizer = RandomImpl::new('ryo');
        let season_manager = SeasonManagerTrait::new(self.s());
        season_manager.new_season(ref randomizer, ryo_config.season_version);
    }


    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn set_paused(self: @ContractState, paused: bool) {
            self.assert_caller_is_owner();

            let mut ryo_config = self.s().ryo_config();

            ryo_config.paused = paused;
            self.s().save_ryo_config(ryo_config);
        }

        fn update_ryo_config(self: @ContractState, ryo_config: RyoConfig) {
            self.assert_caller_is_owner();

            let mut new_ryo_config = self.s().ryo_config();

            new_ryo_config.season_duration = ryo_config.season_duration;
            new_ryo_config.season_time_limit = ryo_config.season_time_limit;
            new_ryo_config.paper_fee = ryo_config.paper_fee;
            new_ryo_config.paper_reward_launderer = ryo_config.paper_reward_launderer;
            new_ryo_config.treasury_fee_pct = ryo_config.treasury_fee_pct;

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
                self.world().is_owner(get_contract_address().into(), get_caller_address()),
                'not owner'
            );
        }

        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}
