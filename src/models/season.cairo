use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Season {
    #[key]
    version: u16,
    // season config copied from RyoConfig
    season_duration: u32,
    paper_fee: u16,
    treasury_fee_pct: u8,
    // season datas
    next_version_timestamp: u64, // updated on new highscore
    paper_balance: u32, 
    //
}
