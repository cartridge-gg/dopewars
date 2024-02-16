use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    config::{items::{ItemConfig, ItemSlot, ItemConfigImpl, ItemLevel}, locations::{Locations}},
    packing::{
        game_store::{GameStore}, player::{PlayerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl}
    },
    utils::events::{RawEventEmitterTrait, RawEventEmitterImpl}
};

#[derive(Copy, Drop, Serde)]
struct Action {
    slot: ItemSlot,
}

fn execute_action(ref game_store: GameStore, action: Action) {
    // get game infos
    let game = get!(game_store.world, (game_store.game_id, game_store.player_id), Game);

    // get wanted 
    let wanted = if game_store.player.location == Locations::Home {
        0
    } else {
        // u8 sub_overflow if location = Home = 0
        game_store.wanted.get(game_store.player.location)
    };

    // closed for wanted < max_wanted_shopping
    assert(wanted < game.max_wanted_shopping, 'too dangerous');

    // get current item
    let current_item = game_store.items.get_item(action.slot);

    // check item max level
    assert(current_item.level != ItemLevel::Level3, 'max level u chad');

    let level: u8 = current_item.level.into();
    let next_level: ItemLevel = (level + 1).into();

    // get next item
    let next_item = ItemConfigImpl::get(game_store.world, action.slot, next_level);

    // check can buy
    assert(game_store.player.cash > next_item.cost, 'too poor');

    // pay item
    game_store.player.cash -= next_item.cost;

    // gibe item to customer
    game_store.items.upgrade_item(action.slot);

    // emit event
    game_store
        .world
        .emit_raw(
            array![
                selector!("UpgradeItem"),
                Into::<u32, felt252>::into(game_store.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.player_id).into()
            ],
            array![
                Into::<ItemSlot, u8>::into(action.slot).into(),
                Into::<ItemLevel, u8>::into(next_level).into(),
            ]
        );
}
