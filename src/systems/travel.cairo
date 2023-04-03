#[system]
mod Travel {
    use traits::Into;
    use array::ArrayTrait;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameLibraryDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;

    use rollyourown::components::player::Name;
    use rollyourown::components::player::INameLibraryDispatcher;
    use rollyourown::components::player::INameDispatcherTrait;

    use rollyourown::components::location::Location;
    use rollyourown::components::location::ILocationLibraryDispatcher;
    use rollyourown::components::location::ILocationDispatcherTrait;

    use rollyourown::components::player::Stats;
    use rollyourown::components::player::IStatsLibraryDispatcher;
    use rollyourown::components::player::IStatsDispatcherTrait;

    use rollyourown::components::player::Cash;
    use rollyourown::components::player::ICashLibraryDispatcher;
    use rollyourown::components::player::ICashDispatcherTrait;

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(game_id: felt252, next_location_id: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Stats, Cash>::get((game_id, (player_id)).into());
        let (name, location, stats, cash) = player;
        assert(name.is_some(), 'player not found');
        assert(location.unwrap().id != next_location_id, 'already at location');

        let next_location = commands::<Location>::get((game_id, (next_location_id)).into());
        assert(next_location.is_some(), 'invalid location');

        // TODO: random event

        // update player
        let _ = commands::set((game_id, (player_id)).into(), (
            Location { id: next_location_id },
            Stats { health: stats.unwrap().health },
            Cash { amount: cash.unwrap().amount },
        ));

        return ();
    }
}
