use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::player::Player;
use rollyourown::models::encounter::EncounterType;

#[starknet::interface]
trait IMiniGame<TContractState> {
    fn start(
        self: @TContractState, game_id: u32, player: Player, encounter_id: EncounterType
    ) -> ();
}

#[dojo::contract]
mod minigame {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use rollyourown::models::player::Player;
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::encounter::EncounterType;
    use rollyourown::constants::{COP_TYPE, GANGSTER_TYPE};
    use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};
    use rollyourown::models::tile::{Tile, TileTrait};

    use super::IMiniGame;
    use rollyourown::models::map::{Map, MapTrait};
    #[external(v0)]
    impl MiniGameImpl of IMiniGame<ContractState> {
        fn start(
            self: @ContractState, game_id: u32, player: Player, encounter_id: EncounterType
        ) -> () {
            let world = self.world();
            // let game_id = self.world().uuid();
            let game = get!(world, game_id, Game);
            assert(game.tick(), 'game cannot progress');
            let mut randomizer = RandomImpl::new(world);

            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id).into(), Player);

            let random_spawn = randomizer.between::<u32>(0, 400);

            let mut map: Span<Tile> = MapTrait::new(4, encounter_id, random_spawn);
        }
    }
}

