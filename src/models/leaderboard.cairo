use  starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Leaderboard {
    #[key]
    version: u16,
    player_id: ContractAddress,
    high_score: u32,
    next_version_timestamp: u64,
}
