use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const RYO_CONFIG_KEY: u8 = 42;

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
