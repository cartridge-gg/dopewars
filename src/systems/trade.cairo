#[system]
mod BuySystem {
    use traits::Into;
    use starknet::contract_address::ContractAddressIntoFelt252;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;
    use rollyourown::components::player::Location;
    use rollyourown::components::player::ILocationDispatcher;
    use rollyourown::components::player::ILocationDispatcherTrait;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::ICashDispatcher;
    use rollyourown::components::player::ICashDispatcherTrait;

    fn execute(game_id: felt252, drug_id: usize, quantity: usize) {
        let player_id = starknet::get_caller_address();

        // 1. Verify the caller owns the player.
        // 2. Get current price for location for quantity.
        // 3. Ensure user can afford it.
        // 4. Perform the trade.
        // 5. Update the location's inventory.
        // 6. Update the player's inventory.

        let game = Query::<Game>::entity((game_id));
        let player = Query::<Location, Cash>::entity((game_id, player_id.into()));

        return ();
    }
}
