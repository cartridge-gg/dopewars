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
    capture: u8
}

#[derive(Copy, Drop, Serde)]
struct MarketSettings {//liquidity_scale_factor: usize,
}

#[derive(Copy, Drop, Serde)]
struct DecideSettings {}

#[derive(Copy, Drop, Serde)]
// struct PricingInfos {
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
    fn new(game_mode: GameMode) -> T;
}

trait DrugSettingsTrait<T> {
    fn new(game_mode: GameMode, drug_id: felt252) -> T;
}


//
//
//

impl GameSettingsImpl of SettingsTrait<GameSettings> {
    fn new(game_mode: GameMode) -> GameSettings {
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
    fn new(game_mode: GameMode) -> PlayerSettings {
        PlayerSettings { health: 100_u8, cash: 2000_u128 * SCALING_FACTOR, bag_limit: 100 }
    }
}

impl RiskSettingsImpl of SettingsTrait<RiskSettings> {
    fn new(game_mode: GameMode) -> RiskSettings {
        match game_mode {
            GameMode::Limited => {
                RiskSettings {
                    travel: 75, // 75% chance of travel encounter
                    capture: 60, // 60% chance of capture
                }
            },
            GameMode::Unlimited => {
                RiskSettings {
                    travel: 10, // 10% chance of travel encounter
                    capture: 10, // 10% chance of capture
                }
            },
        }
    }
}


impl PriceSettingsImpl of DrugSettingsTrait<PriceSettings> {
    // fn get_pricing_info(drug_id: felt252) -> PriceSettings {
    fn new(game_mode: GameMode, drug_id: felt252) -> PriceSettings {
        match game_mode {
            GameMode::Limited => {
                pricing_broody(drug_id)
            },
            GameMode::Unlimited => {
                pricing_clicksave(drug_id)
            },
        }
    }
}


// TODO: calc according liquidities
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
