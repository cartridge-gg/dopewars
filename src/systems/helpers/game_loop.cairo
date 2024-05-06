use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game},
    utils::{random::{Random}, events::{RawEventEmitterTrait, RawEventEmitterImpl}, math::{MathImpl, MathTrait}},
    config::{locations::{Locations}, game::{GameConfigImpl}},
    packing::{
        game_store::{GameStore, GameStorePackerImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl, WantedPackedTrait},
        markets_packed::MarketsPackedTrait, player::{Player, PlayerImpl},
        drugs_packed::{DrugsPackedTrait}
    },
    systems::helpers::{traveling},
    helpers::season_manager::{SeasonManager, SeasonManagerTrait}
};


// -> (is_dead, has_encounter)
fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> (bool, bool) {
    // update wanted
    game_store.wanted.on_turn_end(game_store);

    // no encounter on first turn
    if game_store.player.turn == 0 {
        return (false, false);
    };

    traveling::on_travel(ref game_store, ref randomizer)
}


fn on_turn_end(ref game_store: GameStore, ref randomizer: Random) -> bool {
    // update locations
    game_store.player.prev_location = game_store.player.location;
    game_store.player.location = game_store.player.next_location;
    game_store.player.next_location = Locations::Home;

    // update turn
    game_store.player.turn += 1;

    // increase reputation by rep_carry_drugs if carrying drugs, 1 otherwise
    let game_config = GameConfigImpl::get(game_store.world);
    let drugs = game_store.drugs.get();
    let reputation = if drugs.quantity > 5 { game_config.rep_carry_drugs } else { 1 };
    game_store.player.reputation = game_store.player.reputation.add_capped(reputation, 100);

    // emit raw event Traveled if still alive
    if game_store.player.health > 0 {
        game_store
            .world
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
    game_store.player.level_up_drug(ref game_store, ref randomizer);

    // markets variations
    game_store.markets.market_variations(ref randomizer);

    // hustling
    game_store.player.hustle(ref game_store, ref randomizer);

    // save 
    let game_store_packed = game_store.pack();
    set!(game_store.world, (game_store_packed));

    true
}


fn on_game_over(ref game_store: GameStore) {
    assert(game_store.game.game_over == false, 'already game_over');

    // save 
    let game_store_packed = game_store.pack();
    set!(game_store.world, (game_store_packed));

    // set game_over on game 
    game_store.game.game_over = true;

    let season_manager = SeasonManagerTrait::new(game_store.world);
    // in case player starts game in version v & end game in version v+1
    game_store.game.season_version = season_manager.get_current_version();

    // save game
    set!(game_store.world, (game_store.game));

    // handle new highscore & season version
    season_manager.on_game_over(ref game_store);

    // emit GameOver
    game_store
        .world
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

