use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Leaderboard {
    #[key]
    version: u16,
    game_id: u32,
    high_score: u32,
    //
    next_version_timestamp: u64,
    //
    paper_balance: u256,   // TODO: use u32 ?
    claimed: bool,
}
