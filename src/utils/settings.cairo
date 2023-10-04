use rollyourown::constants::SCALING_FACTOR;
use rollyourown::models::game::GameMode;

#[derive(Copy, Drop, Serde)]
struct GameSettings {
    max_players: usize,
    max_turns: usize,
}

#[derive(Copy, Drop, Serde)]
struct PlayerSettings {
    health: u8,
    cash: u128,
    bag_limit: usize
}

// TODO: update % to %0
#[derive(Copy, Drop, Serde)]
struct RiskSettings {
    travel: u8,
    capture: u8,
    encounter_bias_gangs: u128,
    cops_drug_threshold: usize,
    gangs_cash_threshold: u128,
}

#[derive(Copy, Drop, Serde)]
struct MarketSettings {
    price_var_chance: usize,
    price_var_min: u8,
    price_var_max: u8,
    market_event_chance: usize,
    market_event_min: usize,
    market_event_max: usize,
    liq_scaling_initial_rate: usize,
    liq_scaling_fading_rate: usize,
}

#[derive(Copy, Drop, Serde)]
struct DecideSettings {
    gangs_payment_cash_pct: usize,
    cops_payment_drug_pct: usize,
    health_impact: u8,
}

#[derive(Copy, Drop, Serde)]
struct PriceSettings {
    min_price: u128,
    max_price: u128,
    min_qty: u128,
    max_qty: u128,
}

//
//
//

trait SettingsTrait<T> {
    fn get(game_mode: GameMode) -> T;
}

trait DrugSettingsTrait<T> {
    fn get(game_mode: GameMode, drug_id: felt252) -> T;
}

trait ScalingSettingsTrait<T> {
    fn get(game_mode: GameMode, turn: usize) -> T;
}

//
//
//

impl GameSettingsImpl of SettingsTrait<GameSettings> {
    fn get(game_mode: GameMode) -> GameSettings {
        match game_mode {
            GameMode::Limited => {
                GameSettings { max_players: 1, max_turns: 10 }
            },
            GameMode::Unlimited => {
                GameSettings { max_players: 1, max_turns: 1000 }
            },
        }
    }
}

impl PlayerSettingsImpl of SettingsTrait<PlayerSettings> {
    fn get(game_mode: GameMode) -> PlayerSettings {
        match game_mode {
            GameMode::Limited => {
                PlayerSettings { health: 100_u8, cash: 2000_u128 * SCALING_FACTOR, bag_limit: 100 }
            },
            GameMode::Unlimited => {
                PlayerSettings { health: 100_u8, cash: 1000_u128 * SCALING_FACTOR, bag_limit: 100 }
            },
        }
    }
}

impl RiskSettingsImpl of SettingsTrait<RiskSettings> {
    fn get(game_mode: GameMode) -> RiskSettings {
        match game_mode {
            GameMode::Limited => {
                RiskSettings {
                    travel: 75, // 75% chance of travel encounter
                    capture: 60, // 60% chance of capture
                    encounter_bias_gangs: 50, // 50% chance of gangs encounter vs cops
                    cops_drug_threshold: 2, // cops encounter threshold
                    gangs_cash_threshold: 1000_0000, // gangs encounter threshold
                }
            },
            GameMode::Unlimited => {
                RiskSettings {
                    travel: 10, // 10% chance of travel encounter
                    capture: 10, // 10% chance of capture
                    encounter_bias_gangs: 50, // 50% chance of gangs encounter vs cops
                    cops_drug_threshold: 50, // cops encounter threshold
                    gangs_cash_threshold: 1000_0000, // gangs encounter threshold
                }
            },
        }
    }
}


impl DecideSettingsImpl of SettingsTrait<DecideSettings> {
    fn get(game_mode: GameMode) -> DecideSettings {
        match game_mode {
            GameMode::Limited => {
                DecideSettings {
                    gangs_payment_cash_pct: 20, //% of cash
                    cops_payment_drug_pct: 20, //% of drug
                    health_impact: 15,
                }
            },
            GameMode::Unlimited => {
                DecideSettings {
                    gangs_payment_cash_pct: 25, //% of cash
                    cops_payment_drug_pct: 25, //% of drug
                    health_impact: 10,
                }
            },
        }
    }
}

impl MarketSettingsImpl of SettingsTrait<MarketSettings> {
    fn get(game_mode: GameMode) -> MarketSettings {
        match game_mode {
            GameMode::Limited => {
                MarketSettings {
                    price_var_chance: 250, // on 1000 : 50% chance = 25% up / 25% down
                    price_var_min: 1, // 1%  
                    price_var_max: 5, // 5%  
                    market_event_chance: 7, // on 1000 : 1.4% = 0.7% up / 0.7% down
                    market_event_min: 50, //   up 50%   | down 25%
                    market_event_max: 100, //   up 100%  | down 50%
                    liq_scaling_initial_rate: 200, // 0.02
                    liq_scaling_fading_rate: 420,
                }
            },
            GameMode::Unlimited => {
                MarketSettings {
                    price_var_chance: 250, // on 1000 : 50% chance = 25% up / 25% down
                    price_var_min: 1, // 1%  
                    price_var_max: 5, // 5%  
                    market_event_chance: 7, // on 1000 : 1.4% = 0.7% up / 0.7% down
                    market_event_min: 50, //   up 50%   | down 25%
                    market_event_max: 100, //   up 100%  | down 50%
                    liq_scaling_initial_rate: 90, // 0.009
                    liq_scaling_fading_rate: 350,
                }
            },
        }
    }
}


//
//
//

impl PriceSettingsImpl of DrugSettingsTrait<PriceSettings> {
    fn get(game_mode: GameMode, drug_id: felt252) -> PriceSettings {
        match game_mode {
            GameMode::Limited => {
                pricing_notme(drug_id)
            },
            GameMode::Unlimited => {
                pricing_clicksave(drug_id)
            },
        }
    }
}

fn pricing_notme(drug_id: felt252) -> PriceSettings {
    if drug_id == 'Ludes' {
        PriceSettings {
            min_price: 15 * SCALING_FACTOR,
            max_price: 95 * SCALING_FACTOR,
            min_qty: 900,
            max_qty: 1800,
        }
    } else if drug_id == 'Speed' {
        PriceSettings {
            min_price: 80 * SCALING_FACTOR,
            max_price: 420 * SCALING_FACTOR,
            min_qty: 700,
            max_qty: 1400,
        }
    } else if drug_id == 'Weed' {
        PriceSettings {
            min_price: 350 * SCALING_FACTOR,
            max_price: 1500 * SCALING_FACTOR,
            min_qty: 500,
            max_qty: 1000,
        }
    } else if drug_id == 'Acid' {
        PriceSettings {
            min_price: 1100 * SCALING_FACTOR,
            max_price: 4200 * SCALING_FACTOR,
            min_qty: 400,
            max_qty: 800,
        }
    } else if drug_id == 'Heroin' {
        PriceSettings {
            min_price: 3600 * SCALING_FACTOR,
            max_price: 10500 * SCALING_FACTOR,
            min_qty: 300,
            max_qty: 600,
        }
    } else if drug_id == 'Cocaine' {
        PriceSettings {
            min_price: 8500 * SCALING_FACTOR,
            max_price: 22500 * SCALING_FACTOR,
            min_qty: 200,
            max_qty: 400,
        }
    } else {
        panic(array!['invalid drug_id']);
        PriceSettings { min_price: 0, max_price: 0, min_qty: 0, max_qty: 0, }
    }
}


fn pricing_clicksave(drug_id: felt252) -> PriceSettings {
    if drug_id == 'Ludes' {
        PriceSettings {
            min_price: 15 * SCALING_FACTOR,
            max_price: 105 * SCALING_FACTOR,
            min_qty: 800,
            max_qty: 2000,
        }
    } else if drug_id == 'Speed' {
        PriceSettings {
            min_price: 90 * SCALING_FACTOR,
            max_price: 540 * SCALING_FACTOR,
            min_qty: 600,
            max_qty: 1500,
        }
    } else if drug_id == 'Weed' {
        PriceSettings {
            min_price: 450 * SCALING_FACTOR,
            max_price: 2250 * SCALING_FACTOR,
            min_qty: 500,
            max_qty: 1000,
        }
    } else if drug_id == 'Acid' {
        PriceSettings {
            min_price: 1800 * SCALING_FACTOR,
            max_price: 7200 * SCALING_FACTOR,
            min_qty: 400,
            max_qty: 900,
        }
    } else if drug_id == 'Heroin' {
        PriceSettings {
            min_price: 5400 * SCALING_FACTOR,
            max_price: 16200 * SCALING_FACTOR,
            min_qty: 300,
            max_qty: 700,
        }
    } else if drug_id == 'Cocaine' {
        PriceSettings {
            min_price: 10800 * SCALING_FACTOR,
            max_price: 21600 * SCALING_FACTOR,
            min_qty: 250,
            max_qty: 600,
        }
    } else {
        panic(array!['invalid drug_id']);
        PriceSettings { min_price: 0, max_price: 0, min_qty: 0, max_qty: 0, }
    }
}


fn pricing_broody(drug_id: felt252) -> PriceSettings {
    if drug_id == 'Ludes' {
        PriceSettings {
            min_price: 10 * SCALING_FACTOR,
            max_price: 60 * SCALING_FACTOR,
            min_qty: 800,
            max_qty: 2000,
        }
    } else if drug_id == 'Speed' {
        PriceSettings {
            min_price: 50 * SCALING_FACTOR,
            max_price: 300 * SCALING_FACTOR,
            min_qty: 600,
            max_qty: 1500,
        }
    } else if drug_id == 'Weed' {
        PriceSettings {
            min_price: 200 * SCALING_FACTOR,
            max_price: 700 * SCALING_FACTOR,
            min_qty: 500,
            max_qty: 1000,
        }
    } else if drug_id == 'Acid' {
        PriceSettings {
            min_price: 500 * SCALING_FACTOR,
            max_price: 1800 * SCALING_FACTOR,
            min_qty: 400,
            max_qty: 900,
        }
    } else if drug_id == 'Heroin' {
        PriceSettings {
            min_price: 1200 * SCALING_FACTOR,
            max_price: 4000 * SCALING_FACTOR,
            min_qty: 300,
            max_qty: 700,
        }
    } else if drug_id == 'Cocaine' {
        PriceSettings {
            min_price: 3000 * SCALING_FACTOR,
            max_price: 8000 * SCALING_FACTOR,
            min_qty: 250,
            max_qty: 600,
        }
    } else {
        panic(array!['invalid drug_id']);
        PriceSettings { min_price: 0, max_price: 0, min_qty: 0, max_qty: 0, }
    }
}
