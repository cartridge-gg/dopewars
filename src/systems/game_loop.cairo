use rollyourown::packing::markets_packed::MarketsPackedTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    utils::{random::{Random}, events::{RawEventEmitterTrait, RawEventEmitterImpl}},
    config::locations::{Locations}, packing::game_store::{GameStore, GameStorePackerImpl}
};

fn on_turn_end(world: IWorldDispatcher, ref randomizer: Random, ref game_store: GameStore) -> bool {
    // let shop_settings = ShopSettingsImpl::get(*game.game_mode);

    // // check if can access pawnshop
    // if shop_settings.is_open(@player) {
    //     if player.status == PlayerStatus::AtPawnshop {
    //         // exit pawnshop 
    //         player.status = PlayerStatus::Normal;
    //     } else {
    //         // force pawnshop
    //         player.status = PlayerStatus::AtPawnshop;
    //         // emit raw event AtPawnshop
    //         world
    //             .emit_raw(
    //                 array![
    //                     selector!("AtPawnshop"), (*game.game_id).into(), player.player_id.into()
    //                 ],
    //                 array![]
    //             );

    //         // save player
    //         set!(world, (player));
    //         return false;
    //     };
    // }

    // update locations
    game_store.player.prev_location = game_store.player.location;
    game_store.player.location = game_store.player.next_location;
    game_store.player.next_location = Locations::Home;

    // // update wanted
    // let risk_settings = RiskSettingsImpl::get(*game.game_mode, @player);
    // risk_settings.update_wanted(ref player);

    //update HP if not dead
    if game_store.player.health > 0 {
        //player.health = player.health.add_capped(risk_settings.health_increase_by_turn, 100);
        game_store.player.health -= 1;
    }

    // update turn
    game_store.player.turn += 1;

    // emit raw event Traveled if still alive
    if game_store.player.health > 0 {
        world
            .emit_raw(
                array![
                    selector!("Traveled"), game_store.game_id.into(), game_store.player_id.into()
                ],
                array![
                    (game_store.player.turn - 1).into(),
                    game_store.player.prev_location.into(),
                    game_store.player.location.into()
                ]
            );
    }

    // markets variations
    game_store.markets.market_variations(ref randomizer);

    // save 
    let game_store_packed = game_store.pack();
    set!(world, (game_store_packed));

    true
}


fn on_game_end(world: IWorldDispatcher, ref game_store: GameStore) {}

