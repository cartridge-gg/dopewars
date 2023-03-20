#[system]
mod TravelSystem {
    use traits::Into;
    use starknet::contract_address::ContractAddressIntoFelt252;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;
    use rollyourown::components::player::Location;
    use rollyourown::components::player::ILocationDispatcher;
    use rollyourown::components::player::ILocationDispatcherTrait;

    fn execute(game_id: felt252, next_location_id: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();
        let game = Query::<Game>::entity(game_id.into());
        let player = Query::<Location>::entity((game_id, (player_id)).into());
        let next_location = Query::<Location>::entity((game_id, (next_location_id)).into());
        // 1. Verify the caller owns the player.
        // 2. Determine if a random travel event occurs and apply it if necessary.
        // 3. Update the players location to the next_location_id.
        // 4. Update the new locations supply based on random events.
        return ();
    }
}
