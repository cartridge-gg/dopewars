use dojo::event::EventStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::packing::game_store::GameStoreTrait;

use rollyourown::{
    models::game::{Game},
    config::{hustlers::{HustlerItemConfig, HustlerImpl, ItemSlot}, locations::{Locations},},
    packing::{
        game_store::{GameStore, GameStoreImpl}, player::{PlayerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl}
    },
    store::{Store, StoreImpl, StoreTrait},
    utils::{events::{RawEventEmitterTrait, RawEventEmitterImpl}, math::{MathImpl, MathTrait}},
    events::{UpgradeItem}
};

#[derive(Copy, Drop, Serde)]
struct Action {
    slot: ItemSlot,
}

fn execute_action(ref game_store: GameStore, action: Action) {
    // get wanted
    let wanted = if game_store.player.location == Locations::Home {
        0
    } else {
        // u8 sub_overflow if location = Home = 0
        game_store.wanted.get(game_store.player.location)
    };

    // closed for wanted < max_wanted_shopping
    assert(wanted < game_store.game_config().max_wanted_shopping, 'too dangerous');

    // get current item
    let current_item = game_store.items.get_item(action.slot);

    // check item max level
    assert(current_item.level != 3, 'max level u chad');

    let level: u8 = current_item.level.into();
    let next_level = level + 1;

    // get hustler
    let hustler = HustlerImpl::get(@game_store.store, game_store.game.hustler_id);

    // get next item
    let next_item = hustler.get_item_config(action.slot, next_level);

    // check can buy
    assert(game_store.player.cash >= next_item.tier.cost, 'too poor');

    // pay item
    game_store.player.cash -= next_item.tier.cost;

    // gibe item to customer
    game_store.items.upgrade_item(action.slot);

    // earn reputation
    let game_config = game_store.game_config();
    game_store
        .player
        .reputation = game_store
        .player
        .reputation
        .add_capped(game_config.rep_buy_item, 100);

    // // emit event
    game_store
        .store
        .world
        .emit_event(
            @UpgradeItem {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                item_slot: action.slot.into(),
                item_level: next_level,
            }
        );
}

