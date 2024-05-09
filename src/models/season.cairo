use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Season {
    #[key]
    version: u16,
    // season config copied from RyoConfig
    season_duration: u32,
    season_time_limit: u16,
    paper_fee: u16,
    treasury_fee_pct: u8,
    // season datas
    next_version_timestamp: u64, // updated on new highscore
    paper_balance: u32,
    high_score: u32,
//
}


#[generate_trait]
impl SeasonImpl of SeasonTrait {
    fn exists(self: Season) -> bool {
        self.next_version_timestamp > 0
    }

    fn is_open(self: Season) -> bool {
        let current_timestamp = starknet::info::get_block_timestamp();
        // println!("{current_timestamp}");
        // println!("{}", self.next_version_timestamp);
       
        current_timestamp < self.next_version_timestamp
    }

    fn can_create_game(self: Season) -> bool {
        let current_timestamp = starknet::info::get_block_timestamp();
        current_timestamp < self.next_version_timestamp - self.season_time_limit.into()
    }
}
// #[derive( Copy, Drop, Serde)]
// enum SeasonStatus {
//     Open,
//     Closed,
//     Processed,
// }

