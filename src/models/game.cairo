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
    season_version: u16,
    game_mode: GameMode,
    //
    player_name: Bytes16,
    hustler_id: u16,
    // 
    game_over: bool,
    final_score: u32,
    registered: bool,
    claimed: bool,
    position: u16,
    // 
    // Copied from GameConfig
    //
    max_turns: u8,  
    max_wanted_shopping: u8,
    max_rounds: u8,
   
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
