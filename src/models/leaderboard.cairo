use starknet::ContractAddress;

// TODO: should be renamed Season
#[derive(Model, Copy, Drop, Serde)]
struct Leaderboard {
    #[key]
    version: u16,
    game_id: u32,
    player_id: ContractAddress,
    high_score: u32,
    //
    next_version_timestamp: u64,
    //
    paper_balance: u32, 
    claimed: bool,
}
