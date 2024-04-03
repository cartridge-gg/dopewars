use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const GAME_CONFIG_KEY: u8 = 0;

#[derive(Model, Copy, Drop, Serde)]
struct GameConfig {
    #[key]
    key: u8,
    cash: u32, // initial cash
    health: u8, // initial health 0-100
    max_turns: u8, // max game turn u6 : max 63
    max_wanted_shopping: u8, // limit to enter pawnshop
    max_rounds: u8, // max loop when running
    rep_drug_step: u8, // reputation requiered to level up drug
    rep_buy_item: u8, // reputation earn when buying item
    rep_carry_drugs: u8, // reputation earn when traveling with >5 drug.quantity
    rep_pay_cops: u8, // reputation modifier for paying NEGATIVE
    rep_pay_gang: u8, // reputation modifier for paying NEGATIVE
    rep_run_cops: u8, // reputation modifier for running
    rep_run_gang: u8, // reputation modifier for running
    rep_fight_cops: u8, // reputation modifier for fighting
    rep_fight_gang: u8, // reputation modifier for fighting

}

#[generate_trait]
impl GameConfigImpl of GameConfigTrait {
    #[inline(always)]
    fn get(world: IWorldDispatcher) -> GameConfig {
        get!(world, (GAME_CONFIG_KEY), GameConfig)
    }
}

fn initialize_game_config(world: IWorldDispatcher) {
    set!(
        world,
        GameConfig {
            key: GAME_CONFIG_KEY,
            cash: 1000,
            health: 100,
            max_turns: 30,
            max_wanted_shopping: 5,
            max_rounds: 3,
            rep_drug_step: 20,
            rep_buy_item: 1,
            rep_carry_drugs: 2,
            rep_pay_cops: 6, // NEGATIVE 
            rep_pay_gang: 3, // NEGATIVE
            rep_run_cops: 3, 
            rep_run_gang: 1, 
            rep_fight_cops: 4, 
            rep_fight_gang: 3,

        }
    );
}

