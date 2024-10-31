use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::game::{Game};
use starknet::ContractAddress;

// Game Config for a Season
#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct GameConfig {
    #[key]
    season_version: u16,
    cash: u32, // initial cash
    health: u8, // initial health 0-100
    //
    max_turns: u8, // max game turn u6 : max 63
    max_wanted_shopping: u8, // limit to enter pawnshop
    max_rounds: u8, // max loop when running
    //
    rep_drug_step: u8, // reputation requiered to level up drug
    rep_buy_item: u8, // reputation earn when buying item
    rep_carry_drugs: u8, // reputation earn when traveling with >5 drug.quantity
    rep_hospitalized: u8, // reputation earn when Hospitalized
    rep_jailed: u8, // reputation earn when Jailed
}
