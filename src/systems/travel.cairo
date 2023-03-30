#[system]
mod Travel {
    use array::ArrayTrait;
    use traits::Into;

    use rollyourown::components::game::Game;
    use rollyourown::components::location::Location;

    fn execute(game_id: felt252, next_location_id: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();
        let game = commands::<Game>::get(game_id.into());
        let player = commands::<Location>::get((game_id, (player_id)).into());
        let next_location = commands::<Location>::get((game_id, (next_location_id)).into());
        // 1. Verify the caller owns the player.
        // 2. Determine if a random travel event occurs and apply it if necessary.
        // 3. Update the players location to the next_location_id.
        // 4. Update the new locations supply based on random events.
        return ();
    }
}
