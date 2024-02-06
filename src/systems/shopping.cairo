use rollyourown::{
    config::{items::{ItemConfig, ItemSlot, ItemConfigImpl, ItemLevel}, locations::{Locations}},
    packing::{
        game_store::{GameStore}, player::{PlayerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl}
    }
};

#[derive(Copy, Drop, Serde)]
struct Action {
    slot: ItemSlot,
}


fn execute_actions(ref game_store: GameStore, ref actions: Span<Action>) {
    // get wanted 
    let wanted = if game_store.player.location == Locations::Home {
        0
    } else {
        // u8 sub_overflow if location = Home = 0
        game_store.wanted.get(game_store.player.location)
    };

    // closed for wanted max levels = 5/6/7
    assert(wanted < 5, 'too dangerous');

    loop {
        match actions.pop_front() {
            Option::Some(action) => { execute_action(ref game_store, *action); },
            Option::None => { break; }
        };
    };
}


fn execute_action(ref game_store: GameStore, action: Action) {
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
}

