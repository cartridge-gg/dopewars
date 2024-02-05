use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use core::bytes_31::{bytes31, Felt252TryIntoBytes31};

use rollyourown::traits::{Enumerable};
use rollyourown::config::introspect::{Bytes31IntrospectionImpl};


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum ItemSlot {
    Attack,
    Defense,
    Speed,
    Transport,
}


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum ItemLevel {
    Level0,
    Level1,
    Level2,
    Level3,
}

//
//
//

#[derive(Model, Copy, Drop, Serde)]
struct ItemConfig {
    #[key]
    slot: ItemSlot,
    #[key]
    level: ItemLevel,
    slot_id: u8,
    level_id: u8,
    cost: u32,
    stat: u32,
}

#[derive(Model, Copy, Drop, Serde)]
struct ItemConfigMeta {
    #[key]
    slot: ItemSlot,
    #[key]
    level: ItemLevel,
    slot_id: u8,
    level_id: u8,
    name: bytes31,
}


//
//
//

#[generate_trait]
impl ItemConfigImpl of ItemConfigTrait {
    fn get(world: IWorldDispatcher, item: ItemSlot, level: ItemLevel) -> ItemConfig {
        get!(world, (item, level), ItemConfig)
    }
}

//
//
//

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
            ItemSlot::Speed => 2,
            ItemSlot::Transport => 3,
        }
    }
}


//
//
//

impl ItemLevelIntoFelt252 of Into<ItemLevel, felt252> {
    fn into(self: ItemLevel) -> felt252 {
        match self {
            ItemLevel::Level0 => 'Level0',
            ItemLevel::Level1 => 'Level1',
            ItemLevel::Level2 => 'Level2',
            ItemLevel::Level3 => 'Level3',
        }
    }
}

impl ItemLevelIntoU8 of Into<ItemLevel, u8> {
    fn into(self: ItemLevel) -> u8 {
        match self {
            ItemLevel::Level0 => 0,
            ItemLevel::Level1 => 1,
            ItemLevel::Level2 => 2,
            ItemLevel::Level3 => 3,
        }
    }
}

impl U8IntoItemLevel of Into<u8, ItemLevel> {
    fn into(self: u8) -> ItemLevel {
        let self252: felt252 = self.into();
        match self252 {
            0 => ItemLevel::Level0,
            1 => ItemLevel::Level1,
            2 => ItemLevel::Level2,
            3 => ItemLevel::Level3,
            _ => ItemLevel::Level0,
        }
    }
}


fn initialize_item_config(world: IWorldDispatcher) {
    // Attack - Level0
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level0.into(),
            name: 'Naked'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level0.into(),
            cost: 0,
            stat: 1
        }
    );

    // Attack - Level1
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level1.into(),
            name: 'Knife'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level1.into(),
            cost: 450,
            stat: 10
        }
    );

    // Attack - Level2
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level2.into(),
            name: 'Glock'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level2.into(),
            cost: 12000,
            stat: 25
        }
    );

    // Attack - Level3
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level3.into(),
            name: 'Uzi'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Attack,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Attack.into(),
            level_id: ItemLevel::Level3.into(),
            cost: 99000,
            stat: 50
        }
    );

    //
    //
    //

    // Defense - Level0
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level0.into(),
            name: 'Naked'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level0.into(),
            cost: 0,
            stat: 1
        }
    );

    // Defense - Level1
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level1.into(),
            name: 'Knee Pads'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level1.into(),
            cost: 350,
            stat: 25
        }
    );

    // Defense - Level2
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level2.into(),
            name: 'Leather Jacket'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level2.into(),
            cost: 8900,
            stat: 40
        }
    );

    // Defense - Level3
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level3.into(),
            name: 'Kevlar'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Defense,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Defense.into(),
            level_id: ItemLevel::Level3.into(),
            cost: 69000,
            stat: 60
        }
    );

    //
    //
    //

    // Speed - Level0
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level0.into(),
            name: 'Naked'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level0.into(),
            cost: 0,
            stat: 1
        }
    );

    // Speed - Level1
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level1.into(),
            name: 'Shoes'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level1.into(),
            cost: 250,
            stat: 10
        }
    );

    // Speed - Level2
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level2.into(),
            name: 'Skateboard'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level2.into(),
            cost: 9900,
            stat: 25
        }
    );

    // Speed - Level3
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level3.into(),
            name: 'Bicycle'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Speed,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Speed.into(),
            level_id: ItemLevel::Level3.into(),
            cost: 79000,
            stat: 40
        }
    );

    //
    //
    //

    // Transport - Level0
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level0.into(),
            name: 'Naked'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level0,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level0.into(),
            cost: 0,
            stat: 10 * 100
        }
    );

    // Transport - Level1
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level1.into(),
            name: 'Fanny Pack'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level1,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level1.into(),
            cost: 500,
            stat: 25 * 100
        }
    );

    // Transport - Level2
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level2.into(),
            name: 'Backpack'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level2,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level2.into(),
            cost: 15000,
            stat: 50 * 100
        }
    );

    // Transport - Level3
    set!(
        world,
        ItemConfigMeta {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level3.into(),
            name: 'Duffle Bag'.try_into().unwrap()
        }
    );

    set!(
        world,
        ItemConfig {
            slot: ItemSlot::Transport,
            level: ItemLevel::Level3,
            slot_id: ItemSlot::Transport.into(),
            level_id: ItemLevel::Level3.into(),
            cost: 99000,
            stat: 100 * 100
        }
    );
}
