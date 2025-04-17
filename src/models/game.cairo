use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}}};
use starknet::ContractAddress;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
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
    claimable: u32,
    position: u16,
}


#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct GameWithLoot {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    loot_id: felt252
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum GameMode {
    Ranked,
    Noob,
    Warrior,
}

#[generate_trait]
impl GameImpl of GameTrait {
    fn new(
        game_id: u32,
        player_id: ContractAddress,
        season_version: u16,
        game_mode: GameMode,
        player_name: felt252,
        hustler_id: u16,
        loot_id: u16,
    ) -> Game {
        Game {
            game_id,
            player_id,
            //
            season_version,
            game_mode,
            //
            player_name: Bytes16Impl::from(player_name),
            hustler_id,
            //
            game_over: false,
            final_score: 0,
            registered: false,
            claimed: false,
            claimable: 0,
            position: 0,
        }
    }

    fn exists(self: Game) -> bool {
        self.season_version > 0
    }

    fn is_ranked(self: Game) -> bool {
        self.game_mode == GameMode::Ranked
    }
}
