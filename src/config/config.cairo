use rollyourown::config::{
    drugs::{DrugConfig}, encounters::{EncounterConfig}, game::{GameConfig}, ryo::{RyoConfig},
    settings::{SeasonSettingsModes},
};

#[starknet::interface]
trait IConfig<T> {
    fn get_config(self: @T) -> Config;
    fn emit_items_config(self: @T);
}

#[derive(Drop, Serde)]
struct Config {
    layouts: LayoutsConfig,
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
    use dojo::event::EventStorage;
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};

    use rollyourown::{
        config::{
            drugs::{
                DrugConfig, Drugs, initialize_drug_config_cheap, initialize_drug_config_expensive,
                initialize_drug_config_normal,
            },
            encounters::{
                EncounterConfig, EncounterTrait, Encounters, initialize_encounter_stats_config,
            },
            game::{GameConfig}, locations::initialize_location_config, ryo::{RyoConfig},
            settings::{SeasonSettingsModes, SeasonSettingsModesImpl},
        },
        libraries::dopewars_items::{
            DopewarsItemTier, DopewarsItemTierConfig, IDopewarsItemsDispatcherTrait,
            IDopewarsItemsLibraryDispatcher,
        },
        packing::{
            game_store_layout::{
                GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutIntoBytes31Impl,
                GameStoreLayoutPackableImpl,
            },
            player_layout::{
                PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutIntoBytes31Impl,
                PlayerLayoutPackableImpl,
            },
        },
        store::{Store, StoreImpl, StoreTrait},
    };

    use starknet::{get_caller_address, get_contract_address};

    use super::{Config, LayoutItem, LayoutsConfig};


    fn dojo_init(ref self: ContractState) {
        let mut store = StoreImpl::new(self.world(@"dopewars"));

        initialize_drug_config_normal(ref store);
        initialize_drug_config_cheap(ref store);
        initialize_drug_config_expensive(ref store);

        initialize_location_config(ref store);

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

            let ryo_config = store.ryo_config();
            let season_settings_modes = SeasonSettingsModesImpl::all();

            //
            Config {
                ryo_config,
                season_settings_modes, // hustlers,
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

