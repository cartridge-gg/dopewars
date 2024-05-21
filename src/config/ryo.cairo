use starknet::ContractAddress;
use starknet::info::get_block_timestamp;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{models::{season::{Season, SeasonImpl, SeasonTrait}}};

#[derive(Model, Copy, Drop, Serde)]
struct RyoConfig {
    #[key]
    key: u8,
    initialized: bool,
    paused: bool,
    //
    season_version: u16,
    season_duration: u32,
    season_time_limit: u16,
    //
    paper_fee: u16,
    paper_reward_launderer: u16,
    treasury_fee_pct: u8,
    treasury_balance: u32,
}


#[generate_trait]
impl RyoConfigImpl of RyoConfigTrait {
    fn build_season(self: RyoConfig, season_version: u16) -> Season {
        Season {
            version: season_version,
            //
            // season config copied from RyoConfig
            season_duration: self.season_duration,
            season_time_limit: self.season_time_limit,
            paper_fee: self.paper_fee,
            treasury_fee_pct: self.treasury_fee_pct,
            // season datas
            next_version_timestamp: get_block_timestamp() + self.season_duration.into(),
            paper_balance: 0,
            high_score: 0,
        }
    }
}
