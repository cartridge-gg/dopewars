use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::utils::bytes16::Bytes16;
use rollyourown::utils::introspect::Bytes16IntrospectionImpl;

#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    //
    player_name: Bytes16,
    hustler_id: u16,
    //
    leaderboard_version: u16,
    game_mode: GameMode,
    //
    max_turns: u8,
    max_wanted_shopping: u8,
    max_rounds: u8,
    // 
    game_over: bool,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GameMode {
    Dealer,
    Warrior,
}

#[generate_trait]
impl GameImpl of GameTrait {
    fn get(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress) -> Game {
        get!(world, (game_id, player_id), Game)
    }
}
