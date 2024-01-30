use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    game_mode: GameMode,
    max_turns: u8,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GameMode {
    Test,
    Unlimited
}

