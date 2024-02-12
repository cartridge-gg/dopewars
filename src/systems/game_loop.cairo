use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game},
    utils::{random::{Random}, events::{RawEventEmitterTrait, RawEventEmitterImpl}},
    config::locations::{Locations},
    packing::{
        game_store::{GameStore, GameStorePackerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl, WantedPackedTrait},
        markets_packed::MarketsPackedTrait
    }, 
    systems::traveling
};


fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> bool {
    // update wanted
    game_store.wanted.on_turn_end(game_store);
    
    // no encounter on first turn
    if game_store.player.turn == 0 {
       return false;
    };

    traveling::on_travel(ref game_store,ref randomizer)
}


fn on_turn_end(ref game_store: GameStore, ref randomizer: Random) -> bool {
    
    // update locations
    game_store.player.prev_location = game_store.player.location;
    game_store.player.location = game_store.player.next_location;
    game_store.player.next_location = Locations::Home;

    // //update HP if not dead
    // if game_store.player.health > 0 {
    //     //player.health = player.health.add_capped(risk_settings.health_increase_by_turn, 100);
    //     game_store.player.health -= 1;
    // }

    // update turn
    game_store.player.turn += 1;

    // emit raw event Traveled if still alive
    if game_store.player.health > 0 {
        game_store
            .world
            .emit_raw(
                array![
                    selector!("Traveled"),
                    Into::<u32, felt252>::into(game_store.game_id),
                    Into::<starknet::ContractAddress, felt252>::into(game_store.player_id).into()
                ],
                array![
                    Into::<u8, felt252>::into(game_store.player.turn - 1),
                    Into::<Locations, u8>::into(game_store.player.prev_location).into(),
                    Into::<Locations, u8>::into(game_store.player.location).into(),
                ]
            );
    }

    // markets variations
    game_store.markets.market_variations(ref randomizer);

    // save 
    let game_store_packed = game_store.pack();
    set!(game_store.world, (game_store_packed));

    true
}


fn on_game_end(ref game_store: GameStore) {
    let mut game = get!(game_store.world, (game_store.game_id, game_store.player_id), (Game));
    assert(game.game_over == false, 'already game_over');

    // set game_over on game 
    game.game_over = true;
    set!(game_store.world, (game));
// TODO
//ryo::game_over(self.world(), ref player);

}

