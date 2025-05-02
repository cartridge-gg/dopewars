use dojo::meta::introspect::Introspect;
use rollyourown::packing::game_store::{GameMode};
use rollyourown::systems::game::{EncounterActions,};
use rollyourown::systems::helpers::traveling::{EncounterOutcomes,};
use rollyourown::models::game_with_token_id::{TokenId};
use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::event]
pub struct GameCreated {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    game_mode: GameMode,
    player_name: felt252,
    hustler_id: u16,
    // token_id: TokenId,

}
 
#[derive(Drop, Serde)]
#[dojo::event]
pub struct Traveled {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    turn: u8,
    from_location_id: u8,
    to_location_id: u8,
}


#[derive(Drop, Serde)]
#[dojo::event]
struct GameOver {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    season_version: u16,
    player_name: felt252,
    hustler_id: u16,
    turn: u8,
    cash: u32,
    health: u8,
    reputation: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
struct TradeDrug {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    turn: u8,
    drug_id: u8,
    quantity: u32,
    price: u32,
    is_buy: bool,
}

#[derive(Drop, Serde)]
#[dojo::event]
struct HighVolatility {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    location_id: u8,
    drug_id: u8,
    increase: bool,
}

#[derive(Drop, Serde)]
#[dojo::event]
struct UpgradeItem {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    turn: u8,
    item_slot: u8,
    item_level: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
struct TravelEncounter {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    turn: u8,
    encounter: felt252,
    level: u8,
    health: u8,
    attack: u8,
    defense: u8,
    speed: u8,
    demand_pct: u8,
    payout: u32,
}

// #[derive(Drop, Introspect)]
#[derive(Drop, Serde, Introspect)]
#[dojo::event]
struct TravelEncounterResult {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    turn: u8,
    action: EncounterActions,
    outcome: EncounterOutcomes,
    rounds: u8,
    dmg_dealt: Array<(u8, u8)>,
    dmg_taken: Array<(u8, u8)>,
    cash_earnt: u32,
    cash_loss: u32,
    drug_id: u8,
    drug_loss: Array<u32>,
    turn_loss: u8,
    rep_pos: u8,
    rep_neg: u8,
}

//
//
//

#[derive(Drop, Serde)]
#[dojo::event]
struct NewSeason {
    #[key]
    key: u16,
    season_version: u16,
}

#[derive(Drop, Serde)]
#[dojo::event]
struct NewHighScore {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    season_version: u16,
    player_name: felt252,
    hustler_id: u16,
    cash: u32,
    health: u8,
    reputation: u8,
}


#[derive(Drop, Serde)]
#[dojo::event]
struct Claimed {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    season_version: u16,
    paper: u32,
    rank: u16,
}
