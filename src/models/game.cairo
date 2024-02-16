use starknet::ContractAddress;


#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    avatar_id: u8,
    leaderboard_version: u16,
    game_mode: GameMode,
    //
    max_turns: u8,
    max_wanted_shopping: u8,
    // 
    game_over: bool,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GameMode {
    Test,
    Unlimited
}

