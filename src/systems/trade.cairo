#[system]
mod BuySystem {
    use array::ArrayTrait;
    use traits::Into;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Location;
    use rollyourown::components::player::Cash;

    fn execute(game_id: felt252, drug_id: usize, quantity: usize) {
        let player_id: felt252 = starknet::get_caller_address().into();

        // 1. Verify the caller owns the player.
        // 2. Get current price for location for quantity.
        // 3. Ensure user can afford it.
        // 4. Perform the trade.
        // 5. Update the location's inventory.
        // 6. Update the player's inventory.

        let game = commands::<Game>::get(game_id.into());
        let player = commands::<Location, Cash>::get((game_id, (player_id)).into());

        return ();
    }
}
