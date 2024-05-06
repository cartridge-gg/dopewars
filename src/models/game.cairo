use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::utils::bytes16::Bytes16;
use rollyourown::utils::introspect::Bytes16IntrospectionImpl;

#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,   // check if can remove key
    //
    player_name: Bytes16,
    hustler_id: u16,
    //
    season_version: u16,
    game_mode: GameMode,
    // // TODO: check if move to SeasonGameConfig
    max_turns: u8,  
    max_wanted_shopping: u8,
    max_rounds: u8,
    // 
    game_over: bool,
    final_score: u32,
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
