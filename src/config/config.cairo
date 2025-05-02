use rollyourown::config::{
    hustlers::{HustlerConfig, HustlerImpl}, game::{GameConfig}, drugs::{DrugConfig},
    encounters::{EncounterConfig}, ryo::{RyoConfig}, settings::{SeasonSettingsModes},
};

#[starknet::interface]
trait IConfig<T> {
    fn get_config(self: @T) -> Config;
    fn emit_items_config(self: @T);
}

#[derive(Drop, Serde)]
struct Config {
    layouts: LayoutsConfig,
    hustlers: Array<HustlerConfig>,
    ryo_config: RyoConfig,
    season_settings_modes: SeasonSettingsModes,
}

#[derive(Drop, Serde)]
struct LayoutsConfig {
    game_store: Array<LayoutItem>,
    player: Array<LayoutItem>,
}

#[derive(Copy, Drop, Serde)]
struct LayoutItem {
    name: bytes31,
    idx: u8,
    bits: u8,
}

#[dojo::contract]
mod config {
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};
    use dojo::event::EventStorage;

    use rollyourown::{
        config::{
            game::{GameConfig},
            drugs::{
                initialize_drug_config_normal, initialize_drug_config_cheap,
                initialize_drug_config_expensive, DrugConfig, Drugs,
            },
            locations::initialize_location_config,
            hustlers::{
                HustlerConfig, HustlerImpl, initialize_weapons_config, initialize_clothes_config,
                initialize_feet_config, initialize_transport_config,
                initialize_weapons_tiers_config, initialize_clothes_tiers_config,
                initialize_feet_tiers_config, initialize_transport_tiers_config,
            },
            encounters::{
                EncounterConfig, Encounters, EncounterTrait, initialize_encounter_stats_config,
            },
            ryo::{RyoConfig}, settings::{SeasonSettingsModes, SeasonSettingsModesImpl},
        },
        store::{Store, StoreImpl, StoreTrait},
        packing::{
            game_store_layout::{
                GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl,
                GameStoreLayoutIntoBytes31Impl,
            },
            player_layout::{
                PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl,
                PlayerLayoutIntoBytes31Impl,
            },
        },
        libraries::dopewars_items::{
            IDopewarsItemsLibraryDispatcher, IDopewarsItemsDispatcherTrait, DopewarsItemTier,
            DopewarsItemTierConfig,
        },
    };

    use starknet::{get_caller_address, get_contract_address};

    use super::{Config, LayoutsConfig, LayoutItem};


    fn dojo_init(ref self: ContractState) {
        let mut store = StoreImpl::new(self.world(@"dopewars"));

        initialize_drug_config_normal(ref store);
        initialize_drug_config_cheap(ref store);
        initialize_drug_config_expensive(ref store);

        initialize_location_config(ref store);

        // hustlers items
        initialize_weapons_config(ref store);
        initialize_clothes_config(ref store);
        initialize_feet_config(ref store);
        initialize_transport_config(ref store);

        // // hutlsers items tiers
        initialize_weapons_tiers_config(ref store);
        initialize_clothes_tiers_config(ref store);
        initialize_feet_tiers_config(ref store);
        initialize_transport_tiers_config(ref store);

        // encounters
        initialize_encounter_stats_config(ref store);
    }


    #[abi(embed_v0)]
    impl ConfigImpl of super::IConfig<ContractState> {
        fn get_config(self: @ContractState) -> Config {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let mut game_store: Array<LayoutItem> = array![];
            let mut game_store_layout_items = GameStoreLayoutEnumerableImpl::all();

            loop {
                match game_store_layout_items.pop_front() {
                    Option::Some(i) => {
                        game_store
                            .append(LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx() });
                    },
                    Option::None => { break; },
                };
            };

            //

            let mut player: Array<LayoutItem> = array![];
            let mut player_layout_items = PlayerLayoutEnumerableImpl::all();

            loop {
                match player_layout_items.pop_front() {
                    Option::Some(i) => {
                        player
                            .append(LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx() });
                    },
                    Option::None => { break; },
                };
            };

            //

            let mut hustlers: Array<HustlerConfig> = array![];
            let mut hustler_ids = array![0_u16, 1_u16, 2_u16].span();

            loop {
                match hustler_ids.pop_front() {
                    Option::Some(id) => {
                        let hustler = HustlerImpl::get(@store, *id);
                        hustlers.append(hustler.get_hustler_config());
                    },
                    Option::None => { break; },
                };
            };

            let ryo_config = store.ryo_config();
            let season_settings_modes = SeasonSettingsModesImpl::all();

            //
            Config {
                ryo_config,
                season_settings_modes,
                hustlers,
                layouts: LayoutsConfig { game_store, player },
            }
        }

        fn emit_items_config(self: @ContractState) {
            let mut world = self.world(@"dopewars");

            let disp = IDopewarsItemsLibraryDispatcher {
                class_hash: world.dns_class_hash(@"DopewarsItems_v0").unwrap(),
            };

            // emit all DopewarsItemTier
            // (0, "WEAPON", 18)
            let slot_id = 0;
            let mut item_id: u8 = 0;
            while item_id < 18 {
                let tier = disp.get_item_tier(slot_id, item_id);
                world.emit_event(@DopewarsItemTier { slot_id, item_id, tier });
                item_id += 1;
            };

            // (1, "CLOTHES", 20)
            let slot_id = 1;
            let mut item_id: u8 = 0;
            while item_id < 20 {
                let tier = disp.get_item_tier(slot_id, item_id);
                world.emit_event(@DopewarsItemTier { slot_id, item_id, tier });
                item_id += 1;
            };

            // (2, "VEHICLE", 17)
            let slot_id = 2;
            let mut item_id: u8 = 0;
            while item_id < 17 {
                let tier = disp.get_item_tier(slot_id, item_id);
                world.emit_event(@DopewarsItemTier { slot_id, item_id, tier });
                item_id += 1;
            };

            // (5, "FOOT", 17)
            let slot_id = 5;
            let mut item_id: u8 = 0;
            while item_id < 17 {
                let tier = disp.get_item_tier(slot_id, item_id);
                world.emit_event(@DopewarsItemTier { slot_id, item_id, tier });
                item_id += 1;
            };

            // emit all DopewarsItemTierConfig
            let mut all_slot_ids: Array<u8> = array![0, 1, 2, 5];
            for slot_id in all_slot_ids {
                let mut tiers: Array<u8> = array![1, 2, 3];
                for tier in tiers {
                    let levels = disp.get_tier_config(slot_id, tier);
                    world.emit_event(@DopewarsItemTierConfig { slot_id, tier, levels });
                }
            };
        }
    }
}

