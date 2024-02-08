use starknet::ContractAddress;


#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    game_mode: GameMode,
    max_turns: u8,
    max_wanted_shopping: u8,
    avatar_id: u8,
    game_over: bool,
    // leaderboard_version: u8,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GameMode {
    Test,
    Unlimited
}

