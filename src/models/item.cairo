use starknet::ContractAddress;

use rollyourown::config::items::{ItemSlot, ItemLevel};

#[derive(Model, Copy, Drop, Serde)]
struct Item {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    item: ItemSlot,
    level: u8,
    name: felt252,
    value: u8,
}

