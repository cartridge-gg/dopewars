use rollyourown::dope_contracts::dope_hustlers::dope_hustlers_models::{
    HustlerBody, HustlerSlotOption,
};
use rollyourown::models::game::{GameMode, TokenId};
use rollyourown::systems::game::EncounterActions;
use rollyourown::systems::helpers::traveling::EncounterOutcomes;
use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::event]
pub struct GameCreated {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub game_mode: GameMode,
    pub player_name: felt252,
    pub multiplier: u8,
    pub token_id: TokenId,
    pub hustler_equipment: Span<HustlerSlotOption>,
    pub hustler_body: Span<HustlerBody>,
}


#[derive(Drop, Serde)]
#[dojo::event]
pub struct Traveled {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub turn: u8,
    pub from_location_id: u8,
    pub to_location_id: u8,
}


#[derive(Drop, Serde)]
#[dojo::event]
pub struct GameOver {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub season_version: u16,
    pub player_name: felt252,
    pub token_id: TokenId,
    pub turn: u8,
    pub cash: u32,
    pub health: u8,
    pub reputation: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct TradeDrug {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub turn: u8,
    pub drug_id: u8,
    pub quantity: u32,
    pub price: u32,
    pub is_buy: bool,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct HighVolatility {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub location_id: u8,
    pub drug_id: u8,
    pub increase: bool,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct UpgradeItem {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub turn: u8,
    pub item_slot: u8,
    pub item_level: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct TravelEncounter {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub turn: u8,
    pub encounter: felt252,
    pub level: u8,
    pub health: u8,
    pub attack: u8,
    pub defense: u8,
    pub speed: u8,
    pub demand_pct: u8,
    pub payout: u32,
}

// #[derive(Drop, Introspect)]
#[derive(Drop, Serde, Introspect)]
#[dojo::event]
pub struct TravelEncounterResult {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub turn: u8,
    pub action: EncounterActions,
    pub outcome: EncounterOutcomes,
    pub rounds: u8,
    pub dmg_dealt: Array<(u8, u8)>,
    pub dmg_taken: Array<(u8, u8)>,
    pub cash_earnt: u32,
    pub cash_loss: u32,
    pub drug_id: u8,
    pub drug_loss: Array<u32>,
    pub turn_loss: u8,
    pub rep_pos: u8,
    pub rep_neg: u8,
}

//
//
//

#[derive(Drop, Serde)]
#[dojo::event]
pub struct NewSeason {
    #[key]
    pub key: u16,
    pub season_version: u16,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct NewHighScore {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub season_version: u16,
    pub player_name: felt252,
    pub token_id: TokenId,
    pub cash: u32,
    pub health: u8,
    pub reputation: u8,
}


#[derive(Drop, Serde)]
#[dojo::event]
pub struct Claimed {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub season_version: u16,
    pub paper: u32,
    pub rank: u16,
}
