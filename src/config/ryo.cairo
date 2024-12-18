use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{models::{season::{Season, SeasonImpl, SeasonTrait}}};
use starknet::ContractAddress;
use starknet::info::get_block_timestamp;

const TWO_MIN: u16 = 120;
const ONE_HOUR: u16 = 3600;
const HALF_HOUR: u16 = 1800;
//
// const HALF_HOUR: u32 = 1800;
const ONE_DAY: u32 = 86_400;
const ONE_WEEK: u32 = 604_800;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
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
    fn build_initial_ryo_config() -> RyoConfig {
        RyoConfig {
            key: 0,
            initialized: true,
            paused: false,
            season_version: 1,
            season_duration: ONE_DAY, // ONE_HOUR, 
            season_time_limit: HALF_HOUR, // TWENTY_MIN,
            paper_fee: 1000, // in ether
            paper_reward_launderer: 100, // in ether  
            treasury_fee_pct: 5,
            treasury_balance: 0,
        }
    }

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
