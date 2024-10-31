use dojo::event::EventStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random}, events::{RawEventEmitterTrait, RawEventEmitterImpl},
        math::{MathImpl, MathTrait}
    },
    store::{Store, StoreImpl, StoreTrait},
    config::{locations::{Locations}, settings::{SeasonSettings}},
    packing::{
        game_store::{GameStore, GameStoreImpl, GameStorePackerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl, WantedPackedTrait},
        markets_packed::MarketsPackedTrait, player::{Player, PlayerImpl},
        drugs_packed::{DrugsPackedTrait}
    },
    events::{GameOver, Traveled}, systems::helpers::{traveling},
    helpers::season_manager::{SeasonManager, SeasonManagerTrait}
};
use starknet::ContractAddress;


// -> (is_dead, has_encounter)
fn on_travel(
    ref game_store: GameStore, ref season_settings: SeasonSettings, ref randomizer: Random
) -> (bool, bool) {
    // update wanted
    game_store.update_wanted();

    // no encounter on first turn
    if game_store.player.turn == 0 {
        return (false, false);
    };

    traveling::on_travel(ref game_store, ref season_settings, ref randomizer)
}


fn on_turn_end(ref game_store: GameStore, ref randomizer: Random, ref store: Store) -> bool {
    // update locations
    game_store.player.prev_location = game_store.player.location;
    game_store.player.location = game_store.player.next_location;
    game_store.player.next_location = Locations::Home;

    // update turn
    game_store.player.turn += 1;

    // increase reputation by rep_carry_drugs if carrying drugs, 1 otherwise
    let mut game_config = game_store.game_config();

    let drugs = game_store.drugs.get();
    let reputation = if drugs.quantity > 5 {
        game_config.rep_carry_drugs
    } else {
        1
    };
    game_store.player.reputation = game_store.player.reputation.add_capped(reputation, 100);

    // emit raw event Traveled if still alive
    if game_store.player.health > 0 {
        store
            .world
            .emit_event(
                @Traveled {
                    game_id: game_store.game.game_id,
                    player_id: game_store.game.player_id,
                    turn: game_store.player.turn - 1,
                    from_location_id: game_store.player.prev_location.into(),
                    to_location_id: game_store.player.prev_location.into(),
                }
            );
    }

    // level up drug_level if possible
    game_store.player.level_up_drug(ref game_store, ref randomizer, ref game_config);

    // markets variations
    game_store.markets.market_variations(ref store, ref randomizer, ref game_store.game);

    // save
    game_store.save();

    true
}


fn on_game_over(ref game_store: GameStore, ref store: Store) {
    assert(game_store.game.game_over == false, 'already game_over');

    // save
    game_store.save();

    // set game_over on game
    game_store.game.game_over = true;

    // save game
    store.set_game(@game_store.game);

    // emit GameOver
    store
        .world
        .emit_event(
            @GameOver {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                season_version: game_store.game.season_version,
                player_name: game_store.game.player_name.into(),
                hustler_id: game_store.game.hustler_id,
                turn: game_store.player.turn,
                cash: game_store.player.cash,
                health: game_store.player.health,
                reputation: game_store.player.reputation,
            }
        );
}

