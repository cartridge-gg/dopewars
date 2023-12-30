use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::player::Player;
use rollyourown::models::encounter::EncounterType;

#[starknet::interface]
trait IMiniGame<TContractState> {
    fn create(
        self: @TContractState, game_id: u32, player: Player, encounter_id: EncounterType
    ) -> ();
// fn move(self: @TContractState, game_id: u32, player: Player, index: u32) -> ();
}

#[dojo::contract]
mod minigame {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use rollyourown::models::player::Player;
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::encounter::EncounterType;
    use rollyourown::constants::{COP_TYPE, GANGSTER_TYPE, STREET_TYPE, WALL_TYPE, PLAYER_TYPE};
    use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};
    use rollyourown::models::tile::{Tile, TileTrait};
    use rollyourown::models::player_minigame::PlayerMiniGame;
    use rollyourown::models::gangster::{Gangster, GangsterTrait};
    use rollyourown::models::cop::{Cop, CopTrait};

    use super::IMiniGame;
    use rollyourown::models::map::{Map, MapTrait, Type};
    #[external(v0)]
    impl MiniGameImpl of IMiniGame<ContractState> {
        fn create(
            self: @ContractState, game_id: u32, player: Player, encounter_id: EncounterType
        ) -> () {
            let world = self.world();
            // let game_id = self.world().uuid();
            let game = get!(world, game_id, Game);
            assert(game.tick(), 'game cannot progress');
            let mut randomizer = RandomImpl::new(world);

            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id).into(), Player);

            let mut map: Map = Map { map_id: game_id, level: 1 };

            set!(world, (map));
            let random_spawn = randomizer.between::<u32>(0, 400);
            let raw_map = MapTrait::new(5, encounter_id, random_spawn);
            let mut index = 0;
            let length = raw_map.len();
            loop {
                if index == length {
                    break;
                }

                let raw_type = *raw_map[index];
                let tile_type: Type = MapTrait::get_type(raw_type, raw_type.get_tile());
                let x: u32 = index % 20;
                let y: u32 = index / 20;
                let tile = Tile { game_id, index, _type: raw_type.get_tile(), x, y };
                match tile_type {
                    Type::Street => { set!(world, (tile)); },
                    Type::Wall => { set!(world, (tile)); },
                    Type::Player => {
                        set!(world, (tile));
                        let mut player_mini: PlayerMiniGame = PlayerMiniGame {
                            game_id: game_id, player_id: player_id, _player: player, position: 5,
                        };
                        set!(world, (player_mini));
                    },
                    Type::Cop => {
                        set!(world, (tile));
                        let mut cop: Cop = CopTrait::new(game_id, 1, x, y);

                        set!(world, (cop));
                    },
                    Type::Gangster => {
                        set!(world, (tile));
                        let mut gangster: Gangster = GangsterTrait::new(game_id, 1, x, y);

                        set!(world, (gangster));
                    },
                }
                index += 1;
            }
        }
    }
}
