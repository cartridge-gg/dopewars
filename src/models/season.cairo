#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct Season {
    #[key]
    pub version: u16,
    // season config copied from RyoConfig
    pub season_duration: u32,
    pub season_time_limit: u16,
    pub paper_fee: u16,
    pub treasury_fee_pct: u8,
    // season datas
    pub next_version_timestamp: u64, // updated on new highscore
    pub paper_balance: u32,
    pub high_score: u32,
    //
}


#[generate_trait]
pub impl SeasonImpl of SeasonTrait {
    fn exists(self: Season) -> bool {
        self.next_version_timestamp > 0
    }

    fn is_open(self: Season) -> bool {
        let current_timestamp = starknet::get_block_timestamp();
        current_timestamp < self.next_version_timestamp
    }

    fn can_create_game(self: Season) -> bool {
        let current_timestamp = starknet::get_block_timestamp();
        current_timestamp < self.next_version_timestamp - self.season_time_limit.into()
    }
}

