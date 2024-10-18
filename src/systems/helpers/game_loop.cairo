use rollyourown::library::store::IStoreDispatcherTrait;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random}, events::{RawEventEmitterTrait, RawEventEmitterImpl},
        math::{MathImpl, MathTrait}
    },
    library::{store::{IStoreLibraryDispatcher, IStoreLibraryDispatcherImpl},},
    config::{locations::{Locations}, settings::{SeasonSettings}},
    packing::{
        game_store::{GameStore,GameStoreImpl, GameStorePackerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl, WantedPackedTrait},
        markets_packed::MarketsPackedTrait, player::{Player, PlayerImpl},
        drugs_packed::{DrugsPackedTrait}
    },
    systems::helpers::{traveling}, helpers::season_manager::{SeasonManager, SeasonManagerTrait}
};


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


fn on_turn_end(
    ref game_store: GameStore, ref randomizer: Random, s: IStoreLibraryDispatcher
) -> bool {
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
        game_store
            .s
            .w()
            .emit_raw(
                array![
                    selector!("Traveled"),
                    Into::<u32, felt252>::into(game_store.game.game_id),
                    Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id)
                        .into()
                ],
                array![
                    Into::<u8, felt252>::into(game_store.player.turn - 1),
                    Into::<Locations, u8>::into(game_store.player.prev_location).into(),
                    Into::<Locations, u8>::into(game_store.player.location).into(),
                ]
            );
    }

    // level up drug_level if possible
    game_store.player.level_up_drug(ref game_store, ref randomizer, ref game_config);

    // markets variations
    game_store.markets.market_variations(game_store.s.w(), ref randomizer, ref game_store.game);

    // save 
    game_store.save();

    true
}


fn on_game_over(ref game_store: GameStore, s: IStoreLibraryDispatcher) {
    assert(game_store.game.game_over == false, 'already game_over');

    // save 
    game_store.save();

    // set game_over on game 
    game_store.game.game_over = true;

    // save game
    s.set_game(game_store.game);

    // emit GameOver
    s
        .w()
        .emit_raw(
            array![
                selector!("GameOver"),
                Into::<u32, felt252>::into(game_store.game.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into(),
                Into::<u16, felt252>::into(game_store.game.season_version),
            ],
            array![
                game_store.game.player_name.into(),
                Into::<u16, felt252>::into(game_store.game.hustler_id),
                Into::<u8, felt252>::into(game_store.player.turn),
                Into::<u32, felt252>::into(game_store.player.cash),
                Into::<u8, felt252>::into(game_store.player.health),
                Into::<u8, felt252>::into(game_store.player.reputation),
            ]
        );
}

