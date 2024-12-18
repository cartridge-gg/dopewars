use core::bytes_31::{bytes31, Felt252TryIntoBytes31};


//
// ITEMS
//

use dojo::model::{ModelStorage};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    traits::{Enumerable}, utils::introspect::{Bytes31IntrospectionImpl},
    store::{Store, StoreImpl, StoreTrait}
};


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum ItemSlot {
    Weapon,
    Clothes,
    Feet,
    Transport,
}


impl ItemSlotIntoFelt252 of Into<ItemSlot, felt252> {
    fn into(self: ItemSlot) -> felt252 {
        match self {
            ItemSlot::Weapon => 'Weapon',
            ItemSlot::Clothes => 'Clothes',
            ItemSlot::Feet => 'Feet',
            ItemSlot::Transport => 'Transport',
        }
    }
}

impl ItemSlotIntoU8 of Into<ItemSlot, u8> {
    fn into(self: ItemSlot) -> u8 {
        match self {
            ItemSlot::Weapon => 0,
            ItemSlot::Clothes => 1,
            ItemSlot::Feet => 2,
            ItemSlot::Transport => 3,
        }
    }
}


//
// MODELS
//

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct HustlerItemBaseConfig {
    #[key]
    slot: ItemSlot,
    #[key]
    id: u32,
    slot_id: u8,
    // name: bytes31,
    name: felt252,
    initial_tier: u8,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct HustlerItemTiersConfig {
    #[key]
    slot: ItemSlot,
    #[key]
    tier: u8,
    slot_id: u8,
    cost: u32,
    stat: u32,
}

//
// HUSTLER METAS
//

#[derive(Copy, Drop, Serde)]
struct HustlerMetas {
    hustler_id: u16,
    weapon_id: u16,
    clothes_id: u16,
    feet_id: u16,
    transport_id: u16,
}

//
// HUSTLER ITEM
//

#[derive(Copy, Drop, Serde)]
struct HustlerItemConfig {
    slot: ItemSlot,
    level: u8,
    base: HustlerItemBaseConfig,
    tier: HustlerItemTiersConfig,
}

//
// HUSTLER CONFIG
//

#[derive(Copy, Drop, Serde)]
struct HustlerConfig {
    hustler_id: u16,
    weapon: HustlerItemConfig,
    clothes: HustlerItemConfig,
    feet: HustlerItemConfig,
    transport: HustlerItemConfig,
}

//
//
//

#[generate_trait]
impl HustlerMetasImpl of HustlerMetasTrait {
    fn get_item_id(self: HustlerMetas, slot: ItemSlot) -> u16 {
        match slot {
            ItemSlot::Weapon => { self.weapon_id },
            ItemSlot::Clothes => { self.clothes_id },
            ItemSlot::Feet => { self.feet_id },
            ItemSlot::Transport => { self.transport_id },
        }
    }
}


//
//
//

#[derive(Copy, Drop)]
struct Hustler {
    store: @Store,
    hustler_id: u16,
}

#[generate_trait]
impl HustlerImpl of HustlerTrait {
    fn get(store: @Store, hustler_id: u16) -> Hustler {
        Hustler { store, hustler_id }
    }

    fn get_metas(self: Hustler) -> HustlerMetas {
        match self.hustler_id {
            0 => {
                // 0 => Dragon
                HustlerMetas {
                    hustler_id: self.hustler_id,
                    weapon_id: 0,
                    clothes_id: 0,
                    feet_id: 0,
                    transport_id: 0,
                }
            },
            1 => {
                // 1 => Monkey
                HustlerMetas {
                    hustler_id: self.hustler_id,
                    weapon_id: 1,
                    clothes_id: 1,
                    feet_id: 1,
                    transport_id: 0,
                }
            },
            _ => {
                // 2 => Rabbit
                HustlerMetas {
                    hustler_id: self.hustler_id,
                    weapon_id: 2,
                    clothes_id: 2,
                    feet_id: 2,
                    transport_id: 0,
                }
            },
        }
    }

    // only called by get_config
    fn get_hustler_config(self: Hustler) -> HustlerConfig {
        HustlerConfig {
            hustler_id: self.hustler_id,
            weapon: self.get_item_config(ItemSlot::Weapon, 0),
            clothes: self.get_item_config(ItemSlot::Clothes, 0),
            feet: self.get_item_config(ItemSlot::Feet, 0),
            transport: self.get_item_config(ItemSlot::Transport, 0),
        }
    }

    fn get_item_config(self: Hustler, slot: ItemSlot, level: u8) -> HustlerItemConfig {
        // retrieve item id by slot
        let hustler_metas = self.get_metas();
        let item_id = hustler_metas.get_item_id(slot);

        // retrieve base config
        let base_config = self.store.item_base_config(slot, item_id);

        // calc current tier
        let tier = base_config.initial_tier + level;

        // get tier config
        let tier_config = self.store.item_tiers_config(slot, tier);

        HustlerItemConfig { slot, level, base: base_config, tier: tier_config, }
    }
}
fn initialize_weapons_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                id: 0,
                name: 'AK47'.try_into().unwrap(),
                initial_tier: 3
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                id: 1,
                name: 'Chain'.try_into().unwrap(),
                initial_tier: 1
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                id: 2,
                name: 'Baseball Bat'.try_into().unwrap(),
                initial_tier: 2
            }
        );
}

fn initialize_clothes_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                id: 0,
                name: 'Blood-Stained Shirt'.try_into().unwrap(),
                initial_tier: 1
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                id: 1,
                name: 'Bullet Proof Vest'.try_into().unwrap(),
                initial_tier: 3
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                id: 2,
                name: 'Trench Coat'.try_into().unwrap(),
                initial_tier: 2
            }
        );
}

fn initialize_feet_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                id: 0,
                name: 'All-Black Sneakers'.try_into().unwrap(),
                initial_tier: 2
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                id: 1,
                name: 'Athletic Trainers'.try_into().unwrap(),
                initial_tier: 2
            }
        );
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                id: 2,
                name: 'Work Boots'.try_into().unwrap(),
                initial_tier: 2
            }
        );
}

fn initialize_transport_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemBaseConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                id: 0,
                name: 'Plastic bag'.try_into().unwrap(),
                initial_tier: 1
            }
        );
}

//
// ITEMS
//

fn initialize_weapons_tiers_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 1,
                stat: 12,
                cost: 0,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 2,
                stat: 24,
                cost: 420,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 3,
                stat: 36,
                cost: 2_600,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 4,
                stat: 48,
                cost: 12_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 5,
                stat: 60,
                cost: 75_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Weapon,
                slot_id: ItemSlot::Weapon.into(),
                tier: 6,
                stat: 72,
                cost: 320_000,
            }
        );
}

fn initialize_clothes_tiers_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 1,
                stat: 12,
                cost: 0,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 2,
                stat: 24,
                cost: 390,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 3,
                stat: 36,
                cost: 2_800,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 4,
                stat: 48,
                cost: 11_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 5,
                stat: 60,
                cost: 65_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Clothes,
                slot_id: ItemSlot::Clothes.into(),
                tier: 6,
                stat: 72,
                cost: 288_000,
            }
        );
}

fn initialize_feet_tiers_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet, slot_id: ItemSlot::Feet.into(), tier: 1, stat: 6, cost: 0,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet, slot_id: ItemSlot::Feet.into(), tier: 2, stat: 12, cost: 300,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                tier: 3,
                stat: 25,
                cost: 1_600,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                tier: 4,
                stat: 40,
                cost: 9_600,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                tier: 5,
                stat: 55,
                cost: 58_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Feet,
                slot_id: ItemSlot::Feet.into(),
                tier: 6,
                stat: 69,
                cost: 285_000,
            }
        );
}

fn initialize_transport_tiers_config(ref store: Store) {
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 1,
                stat: 1000,
                cost: 0,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 2,
                stat: 1500,
                cost: 1500,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 3,
                stat: 3000,
                cost: 59_500,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 4,
                stat: 5000,
                cost: 220_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 5,
                stat: 6000,
                cost: 1_690_000,
            }
        );
    store
        .world
        .write_model(
            @HustlerItemTiersConfig {
                slot: ItemSlot::Transport,
                slot_id: ItemSlot::Transport.into(),
                tier: 6,
                stat: 7000,
                cost: 4_200_000,
            }
        );
}

