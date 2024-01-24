
#[derive(Model, Copy, Drop, Serde)]
struct Leaderboard {
    #[key]
    version: u32,
    high_score: u32,
    next_version_timestamp: u64,
}

