#[system]
mod Travel {
    use traits::Into;
    use array::ArrayTrait;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Name;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::Cash;

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(game_id: felt252, next_location_id: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let maybe_game = commands::<Game>::entity(game_id.into());
        assert(maybe_game.is_some(), 'game not found');

        let game = maybe_game.unwrap();
        assert(!game.is_finished, 'game is finished');

        let player = commands::<Name, Location, Stats, Cash>::entity((game_id, (player_id)).into());
        let (maybe_name, maybe_location, maybe_stats, maybe_cash) = player;
        assert(maybe_name.is_some(), 'player not found');

        let location = maybe_location.unwrap();
        assert(location.id != next_location_id, 'already at location');
        
        let stats = maybe_stats.unwrap();
        let cash = maybe_cash.unwrap();

        let next_location = commands::<Location>::entity((game_id, (next_location_id)).into());
        assert(next_location.is_some(), 'invalid location');

        // TODO: random event

        // update player
        commands::set_entity((game_id, (player_id)).into(), (
            Location { id: next_location_id },
            Stats { health: stats.health },
            Cash { amount: cash.amount },
        ));

        return ();
    }
}
