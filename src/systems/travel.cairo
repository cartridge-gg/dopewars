#[system]
mod TravelSystem {
    use utils::compute_game_player_id;
    fn execute(game_id: usize, player_id: usize, next_location_id: usize) {
        let game = Query::<Game>::entity(game_id);
        let player = Query::<Location>::owned_entity(namespace_id_for_game(game_id, player_id));
        let next_location = Query::<Location>::entity(namespace_id_for_game(game_id, next_location_id));
        // 1. Verify the caller owns the player.
        // 2. Determine if a random travel event occurs and apply it if necessary.
        // 3. Update the players location to the next_location_id.
        // 4. Update the new locations supply based on random events.
        return ();
    }
}
