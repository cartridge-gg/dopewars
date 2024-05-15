use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const GAME_CONFIG_KEY: u8 = 42;

#[derive(Model, Copy, Drop, Serde)]
struct GameConfig {
    #[key]
    key: u8,
    cash: u32, // initial cash
    health: u8, // initial health 0-100
    //
    max_turns: u8, // max game turn u6 : max 63
    max_wanted_shopping: u8, // limit to enter pawnshop
    max_rounds: u8, // max loop when running
    //
    encounter_count: u8, // total nb of encounters
    //
    rep_drug_step: u8, // reputation requiered to level up drug
    rep_buy_item: u8, // reputation earn when buying item
    rep_carry_drugs: u8, // reputation earn when traveling with >5 drug.quantity
    rep_hospitalized: u8, // reputation earn when Hospitalized
    rep_jailed: u8, // reputation earn when Jailed
}



fn initialize_game_config(world: IWorldDispatcher) {
    set!(
        world,
        GameConfig {
            key: GAME_CONFIG_KEY,
            cash: 1000,
            health: 1, // 100,
            //
            max_turns: 4, //30,
            max_wanted_shopping: 5,
            max_rounds: 3,
            //
            encounter_count: 0,
            //
            rep_drug_step: 20,
            rep_buy_item: 1,
            rep_carry_drugs: 2,
            rep_hospitalized: 3,
            rep_jailed: 4,
        }
    );
}

