use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::player::Player;

#[starknet::interface]
trait IWorldMap<TContractState> {
    fn start(self: @TContractState, player: Player) -> ();
}

#[dojo::contract]
mod world {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use rollyourown::models::player::Player;
    use rollyourown::models::game::{Game, GameTrait};

    use super::IWorldMap;
    #[external(v0)]
    impl WorldMapImpl of IWorldMap<ContractState> {
        fn start(self: @ContractState, player: Player) -> () {
            let world = self.world();
            let game = get!(world, game_id, Game);
            assert(game.tick(), 'game cannot progress');

            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id).into(), Player);
        }
    }
}
