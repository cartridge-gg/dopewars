use core::bytes_31::{Felt252TryIntoBytes31, bytes31};


//
// ITEMS
//

use dojo::model::{ModelStorage};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    store::{Store, StoreImpl, StoreTrait}, traits::{Enumerable},
    utils::introspect::{Bytes31IntrospectionImpl},
};


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum ItemSlot {
    Weapon,
    Clothes,
    Feet,
    Transport,
}

#[generate_trait]
pub impl ItemSlotImpl of ItemSlotTrait {
    fn from_dope_slot_id(slot_id: u8) -> ItemSlot {
        match slot_id {
            0 => ItemSlot::Weapon,
            1 => ItemSlot::Clothes,
            2 => ItemSlot::Transport,
            3 => panic!("not supported"),
            4 => panic!("not supported"),
            5 => ItemSlot::Feet,
            _ => panic!("not supported"),
        }
    }
}


pub impl ItemSlotIntoFelt252 of Into<ItemSlot, felt252> {
    fn into(self: ItemSlot) -> felt252 {
        match self {
            ItemSlot::Weapon => 'Weapon',
            ItemSlot::Clothes => 'Clothes',
            ItemSlot::Feet => 'Feet',
            ItemSlot::Transport => 'Transport',
        }
    }
}

pub impl ItemSlotIntoU8 of Into<ItemSlot, u8> {
    fn into(self: ItemSlot) -> u8 {
        match self {
            ItemSlot::Weapon => 0,
            ItemSlot::Clothes => 1,
            ItemSlot::Feet => 2,
            ItemSlot::Transport => 3,
        }
    }
}

