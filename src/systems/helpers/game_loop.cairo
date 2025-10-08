use dojo::event::EventStorage;
use rollyourown::config::locations::Locations;
use rollyourown::config::settings::SeasonSettings;
use rollyourown::events::{GameOver, Traveled};
use rollyourown::packing::drugs_packed::DrugsPackedTrait;
use rollyourown::packing::game_store::{GameStore, GameStoreImpl, GameStorePackerImpl};
use rollyourown::packing::markets_packed::MarketsPackedTrait;
use rollyourown::packing::player::PlayerImpl;
use rollyourown::packing::wanted_packed::WantedPackedImpl;
use rollyourown::store::{Store, StoreImpl, StoreTrait};
use rollyourown::systems::helpers::traveling;
use rollyourown::utils::math::{MathImpl, MathTrait};
use rollyourown::utils::random::Random;


// -> (is_dead, has_encounter)
pub fn on_travel(
    ref game_store: GameStore, ref season_settings: SeasonSettings, ref randomizer: Random,
) -> (bool, bool) {
    // update wanted
    game_store.update_wanted();

    // no encounter on first turn
    if game_store.player.turn == 0 {
        return (false, false);
    }

    traveling::on_travel(ref game_store, ref season_settings, ref randomizer)
}


pub fn on_turn_end(ref game_store: GameStore, ref randomizer: Random, ref store: Store) -> bool {
    // update locations
    game_store.player.prev_location = game_store.player.location;
    game_store.player.location = game_store.player.next_location;
    game_store.player.next_location = Locations::Home;

    // update turn
    // game_store.player.turn += 1;
    game_store
        .player
        .turn = game_store
        .player
        .turn
        .add_capped(1, game_store.game_config().max_turns);

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
                    turn: game_store.player.turn,
                    from_location_id: game_store.player.prev_location.into(),
                    to_location_id: game_store.player.location.into(),
                },
            );
    }

    // level up drug_level if possible
    game_store.player.level_up_drug(ref game_store, ref randomizer);

    // markets variations
    game_store.markets.market_variations(ref store, ref randomizer, ref game_store.game);

    // save
    game_store.save();

    true
}


pub fn on_game_over(ref game_store: GameStore, ref store: Store) {
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
                token_id: game_store.game.token_id,
                turn: game_store.player.turn,
                cash: game_store.player.cash,
                health: game_store.player.health,
                reputation: game_store.player.reputation,
            },
        );
}

