use rollyourown::traits::{Enumerable};
use core::bytes_31::{bytes31, Felt252TryIntoBytes31};

#[derive(Copy, Drop, Serde)]
struct ItemConfig {
    name: bytes31,
    slot: ItemSlot,
    level: ItemLevel,
    stat: u8,
    cost: u32,
}

//
//
//

#[derive(Copy, Drop, Serde, PartialEq)]
enum ItemSlot {
    Attack,
    Defense,
    Speed,
    Transport,
}


impl ItemSlotEnumerableImpl of Enumerable<ItemSlot> {
    fn all() -> Span<ItemSlot> {
        let mut items = array![
            ItemSlot::Attack, ItemSlot::Defense, ItemSlot::Speed, ItemSlot::Transport,
        ];
        items.span()
    }
}

//
//
//

#[derive(Copy, Drop, Serde, PartialEq)]
enum ItemLevel {
    Level0,
    Level1,
    Level2,
    Level3,
}

impl ItemLevelEnumerableImpl of Enumerable<ItemLevel> {
    fn all() -> Span<ItemLevel> {
        let mut items = array![
            ItemLevel::Level0, ItemLevel::Level1, ItemLevel::Level2, ItemLevel::Level3,
        ];
        items.span()
    }
}

//
//
//

#[generate_trait]
impl ItemConfigImpl of ItemConfigTrait {
    fn get(slot: ItemSlot, level: ItemLevel) -> ItemConfig {
        let item_config = match slot {
            ItemSlot::Attack => {
                match level {
                    ItemLevel::Level0 => ItemConfig {
                        name: ''.try_into().unwrap(),
                        slot: ItemSlot::Attack,
                        level: ItemLevel::Level0,
                        cost: 0,
                        stat: 0
                    },
                    ItemLevel::Level1 => ItemConfig {
                        name: 'Knife'.try_into().unwrap(),
                        slot: ItemSlot::Attack,
                        level: ItemLevel::Level1,
                        cost: 450,
                        stat: 9
                    },
                    ItemLevel::Level2 => ItemConfig {
                        name: 'Glock'.try_into().unwrap(),
                        slot: ItemSlot::Attack,
                        level: ItemLevel::Level2,
                        cost: 12000,
                        stat: 24
                    },
                    ItemLevel::Level3 => ItemConfig {
                        name: 'Uzi'.try_into().unwrap(),
                        slot: ItemSlot::Attack,
                        level: ItemLevel::Level3,
                        cost: 99000,
                        stat: 49
                    },
                }
            },
            ItemSlot::Defense => {
                match level {
                    ItemLevel::Level0 => ItemConfig {
                        name: ''.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level0,
                        cost: 0,
                        stat: 0
                    },
                    ItemLevel::Level1 => ItemConfig {
                        name: 'Knee pads'.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level1,
                        cost: 350,
                        stat: 24
                    },
                    ItemLevel::Level2 => ItemConfig {
                        name: 'Leather Jacket'.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level2,
                        cost: 8900,
                        stat: 39
                    },
                    ItemLevel::Level3 => ItemConfig {
                        name: 'Kevlar'.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level3,
                        cost: 69000,
                        stat: 59
                    },
                }
            },
            ItemSlot::Speed => {
                match level {
                    ItemLevel::Level0 => ItemConfig {
                        name: ''.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level0,
                        cost: 0,
                        stat: 0
                    },
                    ItemLevel::Level1 => ItemConfig {
                        name: 'Shoes'.try_into().unwrap(),
                        slot: ItemSlot::Speed,
                        level: ItemLevel::Level1,
                        cost: 250,
                        stat: 9
                    },
                    ItemLevel::Level2 => ItemConfig {
                        name: 'Skateboard'.try_into().unwrap(),
                        slot: ItemSlot::Speed,
                        level: ItemLevel::Level2,
                        cost: 9900,
                        stat: 24
                    },
                    ItemLevel::Level3 => ItemConfig {
                        name: 'Bicycle'.try_into().unwrap(),
                        slot: ItemSlot::Speed,
                        level: ItemLevel::Level3,
                        cost: 79000,
                        stat: 39
                    }
                }
            },
            ItemSlot::Transport => {
                match level {
                    ItemLevel::Level0 => ItemConfig {
                        name: ''.try_into().unwrap(),
                        slot: ItemSlot::Defense,
                        level: ItemLevel::Level0,
                        cost: 0,
                        stat: 0
                    },
                    ItemLevel::Level1 => ItemConfig {
                        name: 'Fanny pack'.try_into().unwrap(),
                        slot: ItemSlot::Transport,
                        level: ItemLevel::Level1,
                        cost: 500,
                        stat: 30
                    },
                    ItemLevel::Level2 => ItemConfig {
                        name: 'Backpack'.try_into().unwrap(),
                        slot: ItemSlot::Transport,
                        level: ItemLevel::Level2,
                        cost: 15000,
                        stat: 60
                    },
                    ItemLevel::Level3 => ItemConfig {
                        name: 'Duffle Bag'.try_into().unwrap(),
                        slot: ItemSlot::Transport,
                        level: ItemLevel::Level3,
                        cost: 99000,
                        stat: 100
                    },
                }
            },
        };
        item_config
    }
}


//
//
//

impl ItemSlotIntoFelt252 of Into<ItemSlot, felt252> {
    fn into(self: ItemSlot) -> felt252 {
        match self {
            ItemSlot::Attack => 'Attack',
            ItemSlot::Defense => 'Defense',
            ItemSlot::Speed => 'Speed',
            ItemSlot::Transport => 'Transport',
        }
    }
}

impl ItemSlotIntoU8 of Into<ItemSlot, u8> {
    fn into(self: ItemSlot) -> u8 {
        match self {
            ItemSlot::Attack => 0,
            ItemSlot::Defense => 1,
            ItemSlot::Speed => 3,
            ItemSlot::Transport => 2,
        }
    }
}
