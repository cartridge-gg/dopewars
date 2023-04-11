#[system]
mod Travel {
    use traits::Into;
    use array::ArrayTrait;

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

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');

        let player = commands::<Name, Location, Stats, Cash>::entity((game_id, (player_id)).into());
        let (name, location, stats, cash) = player;

        assert(location.id != next_location_id, 'already at location');

        let next_location = commands::<Location>::entity((game_id, (next_location_id)).into());
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
