#[system]
mod BuySystem {
    use utils::compute_game_player_id;
    fn execute(game_id: usize, player_id: usize, drug_id: usize, quantity: usize) {
        // 1. Verify the caller owns the player.
        // 2. Get current price for location for quantity.
        // 3. Ensure user can afford it.
        // 4. Perform the trade.
        // 5. Update the location's inventory.
        // 6. Update the player's inventory.

        let game = Query::<Game>::entity(game_id);
        let player = Query::<Location, Cash>::owned_entity(namespace_id_for_game(game_id, player_id));
        let next_location = Query::<Location>::entity(namespace_id_for_game(game_id, next_location_id));

        return ();
    }
}
