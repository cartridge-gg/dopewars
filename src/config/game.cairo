// Game Config for a Season
#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct GameConfig {
    #[key]
    pub season_version: u16,
    pub cash: u32, // initial cash
    pub health: u8, // initial health 0-100
    //
    pub max_turns: u8, // max game turn u6 : max 63
    pub max_wanted_shopping: u8, // limit to enter pawnshop
    pub max_rounds: u8, // max loop when running
    //
    pub rep_drug_step: u8, // reputation requiered to level up drug
    pub rep_buy_item: u8, // reputation earn when buying item
    pub rep_carry_drugs: u8, // reputation earn when traveling with >5 drug.quantity
    pub rep_hospitalized: u8, // reputation earn when Hospitalized
    // reputation earn when Jailed
    pub rep_jailed: u8,
}
