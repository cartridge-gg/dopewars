use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{config::ryo::{RyoConfig}};
use starknet::ContractAddress;

#[starknet::interface]
trait IRyo<T> {
    //
    fn set_paused(self: @T, paused: bool);
    fn update_ryo_config(self: @T, ryo_config: RyoConfig);
    fn set_paper(self: @T, paper_address: ContractAddress);
    fn set_treasury(self: @T, treasury_address: ContractAddress);
    fn set_vrf(self: @T, vrf_address: ContractAddress);
    //
    fn update_quests(self: @T);
    //
    fn paper(self: @T) -> ContractAddress;
    fn treasury(self: @T) -> ContractAddress;
    fn vrf(self: @T) -> ContractAddress;
    fn laundromat(self: @T) -> ContractAddress;

    fn paused(self: @T) -> bool;
    fn paper_fee(self: @T) -> u16;
    fn season_duration(self: @T) -> u32;
}

#[dojo::contract]
mod ryo {
    use achievement::components::achievable::AchievableComponent;
    use core::traits::Into;

    use dojo::world::{IWorldDispatcherTrait, WorldStorage, WorldStorageTrait};
    use rollyourown::elements::trophies::types::{Trophy, TrophyTrait, TROPHY_COUNT};

    use rollyourown::{
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
        config::{ryo::{RyoConfig, RyoConfigImpl}, ryo_address::{RyoAddress},},
        models::{season::Season,}, utils::random::{RandomImpl},
        helpers::season_manager::{SeasonManager, SeasonManagerTrait},
        store::{Store, StoreImpl, StoreTrait},
    };
    use starknet::ContractAddress;
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;
    use starknet::{get_caller_address, get_contract_address};

    component!(path: AchievableComponent, storage: achievable, event: AchievableEvent);
    impl AchievableInternalImpl = AchievableComponent::InternalImpl<ContractState>;

    // Storage
    #[storage]
    struct Storage {
        #[substorage(v0)]
        achievable: AchievableComponent::Storage,
    }

    // Events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AchievableEvent: AchievableComponent::Event,
    }

    fn dojo_init(
        self: @ContractState,
        paper_address: ContractAddress,
        vrf_address: ContractAddress,
        treasury_address: ContractAddress,
    ) {
        // consume first ID = 0
        let _ = self.world_dispatcher().uuid();

        let world = self.world(@"dopewars");
        let mut store = StoreImpl::new(world);

        let mut ryo_config = store.ryo_config();

        assert(ryo_config.initialized == false, 'Already initialized');

        // initial config
        ryo_config = RyoConfigImpl::build_initial_ryo_config();
        // save
        store.save_ryo_config(@ryo_config);

        // RyoAddresses
        let mut ryo_addresses = store.ryo_addresses();

        let paper_address = if paper_address.is_zero() {
            let (paper_mock_address, _) = world.dns(@"paper_mock").unwrap();
            paper_mock_address
        } else {
            paper_address
        };

        let vrf_address = if vrf_address.is_zero() {
            let (vrf_mock_address, _) = world.dns(@"vrf_provider_mock").unwrap();
            vrf_mock_address
        } else {
            vrf_address
        };

        let (laundromat_address, _) = world.dns(@"laundromat").unwrap();

        ryo_addresses.paper = paper_address;
        ryo_addresses.treasury = treasury_address;
        ryo_addresses.laundromat = laundromat_address; // could be removed
        ryo_addresses.vrf = vrf_address;

        // save
        store.save_ryo_addresses(@ryo_addresses);

        // Create first season
        let mut randomizer = RandomImpl::new('ryo');
        let mut season_manager = SeasonManagerTrait::new(store);
        season_manager.new_season(ref randomizer, ryo_config.season_version);
        //
        //
        //
        self.update_quests();
    }


    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn update_quests(self: @ContractState) {
            self.assert_caller_is_owner();

            // [Event] Emit all Trophy events
            let world = self.world(@"dopewars");
            let mut trophy_id: u8 = 1;
            while trophy_id <= TROPHY_COUNT {
                let trophy: Trophy = trophy_id.into();
                self
                    .achievable
                    .create(
                        world,
                        id: trophy.identifier(),
                        hidden: trophy.hidden(),
                        index: trophy.index(),
                        points: trophy.points(),
                        start: trophy.start(),
                        end: trophy.end(),
                        group: trophy.group(),
                        icon: trophy.icon(),
                        title: trophy.title(),
                        description: trophy.description(),
                        tasks: trophy.tasks(),
                        data: trophy.data(),
                    );
                trophy_id += 1;
            }
        }

        fn set_paused(self: @ContractState, paused: bool) {
            self.assert_caller_is_owner();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_config = store.ryo_config();

            ryo_config.paused = paused;
            store.save_ryo_config(@ryo_config);
        }

        fn update_ryo_config(self: @ContractState, ryo_config: RyoConfig) {
            self.assert_caller_is_owner();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut new_ryo_config = store.ryo_config();

            new_ryo_config.season_duration = ryo_config.season_duration;
            new_ryo_config.season_time_limit = ryo_config.season_time_limit;
            new_ryo_config.paper_fee = ryo_config.paper_fee;
            new_ryo_config.paper_reward_launderer = ryo_config.paper_reward_launderer;
            new_ryo_config.treasury_fee_pct = ryo_config.treasury_fee_pct;

            store.save_ryo_config(@new_ryo_config);
        }

        fn set_paper(self: @ContractState, paper_address: ContractAddress) {
            self.assert_caller_is_owner();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_addresses = store.ryo_addresses();
            ryo_addresses.paper = paper_address;
            store.save_ryo_addresses(@ryo_addresses);
        }

        fn set_treasury(self: @ContractState, treasury_address: ContractAddress) {
            self.assert_caller_is_owner();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_addresses = store.ryo_addresses();
            ryo_addresses.treasury = treasury_address;
            store.save_ryo_addresses(@ryo_addresses);
        }

        fn set_vrf(self: @ContractState, vrf_address: ContractAddress) {
            self.assert_caller_is_owner();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_addresses = store.ryo_addresses();
            ryo_addresses.vrf = vrf_address;
            store.save_ryo_addresses(@ryo_addresses);
        }

        //
        // getters
        //

        fn paper(self: @ContractState) -> ContractAddress {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_addresses().paper
        }

        fn treasury(self: @ContractState) -> ContractAddress {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_addresses().treasury
        }

        fn vrf(self: @ContractState) -> ContractAddress {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_addresses().vrf
        }

        fn laundromat(self: @ContractState) -> ContractAddress {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_addresses().laundromat
        }


        fn paused(self: @ContractState) -> bool {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_config().paused
        }

        fn paper_fee(self: @ContractState) -> u16 {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_config().paper_fee
        }

        fn season_duration(self: @ContractState) -> u32 {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            store.ryo_config().season_duration
        }
    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {
        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            let account_contract_address = get_tx_info().unbox().account_contract_address;
            assert(
                self
                    .world(@"dopewars")
                    .dispatcher
                    .is_owner(selector_from_tag!("dopewars-ryo"), account_contract_address),
                'not owner'
            );
        }
    }
}
