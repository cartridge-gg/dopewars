use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    config::{hustlers::{HustlerItemConfig, HustlerImpl, ItemSlot}, locations::{Locations},},
    packing::{
        game_store::{GameStore}, player::{PlayerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl}
    },
    library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
    utils::{events::{RawEventEmitterTrait, RawEventEmitterImpl}, math::{MathImpl, MathTrait}}
};

#[derive(Copy, Drop, Serde)]
struct Action {
    slot: ItemSlot,
}

fn execute_action(s: IStoreLibraryDispatcher, ref game_store: GameStore, action: Action) {
    // get game infos
    let game = s.game(game_store.game.game_id, game_store.game.player_id);

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
    assert(current_item.level != 3, 'max level u chad');

    let level: u8 = current_item.level.into();
    let next_level = level + 1;

    // get hustler
    let hustler = HustlerImpl::get(s, game_store.game.hustler_id);

    // get next item
    let next_item = hustler.get_item_config(action.slot, next_level);

    // check can buy
    assert(game_store.player.cash > next_item.tier.cost, 'too poor');

    // pay item
    game_store.player.cash -= next_item.tier.cost;

    // gibe item to customer
    game_store.items.upgrade_item(action.slot);

    // earn reputation
    let game_config = s.game_config();
    game_store
        .player
        .reputation = game_store
        .player
        .reputation
        .add_capped(game_config.rep_buy_item, 100);

    // emit event
    game_store
        .s
        .w()
        .emit_raw(
            array![
                selector!("UpgradeItem"),
                Into::<u32, felt252>::into(game_store.game.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into()
            ],
            array![
                Into::<ItemSlot, u8>::into(action.slot).into(),
                Into::<u8, felt252>::into(next_level),
            ]
        );
}

