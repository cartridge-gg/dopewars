use rollyourown::constants::SCALING_FACTOR;
use rollyourown::models::game::GameMode;
use rollyourown::models::drug::DrugEnum;
use rollyourown::models::item::ItemEnum;
use rollyourown::models::player::Player;


#[derive(Copy, Drop, Serde)]
struct GameSettings {
    max_players: usize,
    max_turns: usize,
}

#[derive(Copy, Drop, Serde)]
struct PlayerSettings {
    health: u8,
    cash: u128,
    wanted: u8,
    attack: usize,
    defense: usize,
    transport: usize,
    speed: usize,
}

// TODO: update % to %0
#[derive(Copy, Drop, Serde)]
struct RiskSettings {
    travel: u8,
    capture: u8,
    encounter_bias_gangs: u128,
    cops_drug_threshold: usize,
    gangs_cash_threshold: u128,
    health_increase_by_turn: u8,
    wanted_decrease_by_turn: u8,
    wanted_decrease_zero_drug: u8,
    wanted_increase_by_drug: u8,
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
    liq_scaling_flat: usize,
    price_scaling_flat: usize,
}

#[derive(Copy, Drop, Serde)]
struct DecideSettings {
    wanted_impact_run: u8,
    wanted_impact_fight: u8,
}

#[derive(Copy, Drop, Serde)]
struct PriceSettings {
    min_price: u128,
    max_price: u128,
    min_qty: u128,
    max_qty: u128,
}

#[derive(Copy, Drop, Serde)]
struct ItemSettings {
    name: felt252,
    cost: u128,
    value: usize
}

#[derive(Copy, Drop, Serde)]
struct ShopSettings {
    max_item_allowed: u8,
    max_item_level: u8,
    opening_freq: u32
}


#[derive(Copy, Drop, Serde)]
struct EncounterSettings {
    level: u8,
    health: u8,
    dmg: u8,
    payout: u128,
}

//
//
//

trait SettingsTrait<T> {
    fn get(game_mode: GameMode) -> T;
}

trait DrugSettingsTrait<T> {
    fn get(game_mode: GameMode, drug_id: DrugEnum) -> T;
}

trait PlayerSettingsTrait<T> {
    fn get(game_mode: GameMode, player: @Player) -> T;
}

trait ItemSettingsTrait<T> {
    fn get(game_mode: GameMode, item_id: ItemEnum, level: u8) -> T;
}

trait EncounterSettingsTrait<T> {
    fn get(game_mode: GameMode, player: @Player, level: u8) -> T;
}

//
//
//

impl GameSettingsImpl of SettingsTrait<GameSettings> {
    fn get(game_mode: GameMode) -> GameSettings {
        let game_settings = GameSettings { max_players: 1, max_turns: 0 };
        game_settings
    }
}

impl PlayerSettingsImpl of SettingsTrait<PlayerSettings> {
    fn get(game_mode: GameMode) -> PlayerSettings {
        let mut player_settings = PlayerSettings {
            health: 100,
            cash: 1420_u128 * SCALING_FACTOR,
            wanted: 39,
            attack: 1,
            defense: 1,
            transport: 70,
            speed: 1
        };

        if game_mode == GameMode::Test {
            player_settings.wanted = 100;
            player_settings.health = 9;
        }

        player_settings
    }
}


impl RiskSettingsImpl of PlayerSettingsTrait<RiskSettings> {
    fn get(game_mode: GameMode, player: @Player) -> RiskSettings {
        let travel = (40
            + (*player).wanted / 2); // 40% chance of travel encounter + 0.5 wanted (max 50)
        let capture = (45 + (*player).wanted / 4); // 45% chance of capture + 0.25 wanted (max 25)

        let mut risk_settings = RiskSettings {
            travel,
            capture,
            encounter_bias_gangs: 50, // 50% chance of gangs encounter vs cops
            cops_drug_threshold: 5, // cops encounter threshold
            gangs_cash_threshold: 500_0000, // gangs encounter threshold
            health_increase_by_turn: 0,
            wanted_decrease_by_turn: 1,
            wanted_decrease_zero_drug: 10,
            wanted_increase_by_drug: ((*player).drug_count / 6).try_into().unwrap()
        };

        if game_mode == GameMode::Test {
            risk_settings.health_increase_by_turn = 0;
            risk_settings.wanted_decrease_by_turn = 0;
        };

        risk_settings
    }
}


impl DecideSettingsImpl of PlayerSettingsTrait<DecideSettings> {
    fn get(game_mode: GameMode, player: @Player) -> DecideSettings {
        let decide_settings = DecideSettings {
            wanted_impact_run: 6,
            wanted_impact_fight: 12,
        };
        decide_settings
    }
}

impl MarketSettingsImpl of SettingsTrait<MarketSettings> {
    fn get(game_mode: GameMode) -> MarketSettings {
        let mut market_settings = MarketSettings {
            price_var_chance: 250, // on 1000 : 50% chance = 25% up / 25% down
            price_var_min: 2, // 2%  
            price_var_max: 6, // 6%  
            market_event_chance: 8, // on 1000 : 1.6% = 0.8% up / 0.8% down  
            market_event_min: 40, //   up 40%  | down 20%
            market_event_max: 80, //   up 80%  | down 40%
            liq_scaling_initial_rate: 150, // 0.015
            liq_scaling_fading_rate: 360,
            liq_scaling_flat: 10200, // 2%
            price_scaling_flat: 10100, // 1%
        };

        if game_mode == GameMode::Test {
            market_settings.market_event_chance = 14; // on 1000 : 2.8% = 1.4% up / 1.4% down   
        }

        market_settings
    }
}

//
//
//

impl ShopSettingsImpl of SettingsTrait<ShopSettings> {
    fn get(game_mode: GameMode) -> ShopSettings {
        let mut shop_settings = ShopSettings {
            max_item_allowed: 3, max_item_level: 3, opening_freq: 4
        };

        if game_mode == GameMode::Test {
            shop_settings.opening_freq = 2;
        }

        shop_settings
    }
}

impl ItemSettingsImpl of ItemSettingsTrait<ItemSettings> {
    fn get(game_mode: GameMode, item_id: ItemEnum, level: u8) -> ItemSettings {
        let item_settings = match item_id {
            ItemEnum::Attack => {
                if level == 1 {
                    ItemSettings { name: 'Knife', cost: 450 * SCALING_FACTOR, value: 9 }
                } else if level == 2 {
                    ItemSettings { name: 'Glock', cost: 9900 * SCALING_FACTOR, value: 24 }
                } else {
                    ItemSettings { name: 'Uzi', cost: 89000 * SCALING_FACTOR, value: 49 }
                }
            },
            ItemEnum::Defense => {
                if level == 1 {
                    ItemSettings { name: 'Knee pads', cost: 350 * SCALING_FACTOR, value: 24 }
                } else if level == 2 {
                    ItemSettings { name: 'Leather Jacket', cost: 6900 * SCALING_FACTOR, value: 39 }
                } else {
                    ItemSettings { name: 'Kevlar', cost: 49000 * SCALING_FACTOR, value: 59 }
                }
            },
            ItemEnum::Transport => {
                if level == 1 {
                    ItemSettings { name: 'Fanny pack', cost: 500 * SCALING_FACTOR, value: 30 }
                } else if level == 2 {
                    ItemSettings { name: 'Backpack', cost: 12000 * SCALING_FACTOR, value: 60 }
                } else {
                    ItemSettings { name: 'Duffle Bag', cost: 85000 * SCALING_FACTOR, value: 99 }
                }
            },
            ItemEnum::Speed => {
                if level == 1 {
                    ItemSettings { name: 'Shoes', cost: 250 * SCALING_FACTOR, value: 9 }
                } else if level == 2 {
                    ItemSettings { name: 'Skateboard', cost: 8000 * SCALING_FACTOR, value: 24 }
                } else {
                    ItemSettings { name: 'Bicycle', cost: 42000 * SCALING_FACTOR, value: 39 }
                }
            },
        };
        item_settings
    }
}

//
//
//

impl EncounterSettingsImpl of EncounterSettingsTrait<EncounterSettings> {
    fn get(game_mode: GameMode, player: @Player, level: u8) -> EncounterSettings {
        // game should not exceed 100 turns
        let turn: u8 = (*player.turn).try_into().unwrap();
        let mut health = level * 8 + turn;
        let mut health = if health > 100 {
            100
        } else {
            health
        };
        let dmg = health / 4;
        let payout: u128 = SCALING_FACTOR * level.into() * (8000 + (1000 * turn.into()));

        EncounterSettings { level, health, dmg, payout }
    }
}


//
//
//

impl PriceSettingsImpl of DrugSettingsTrait<PriceSettings> {
    fn get(game_mode: GameMode, drug_id: DrugEnum) -> PriceSettings {
        match game_mode {
            GameMode::Test => { pricing_notme(drug_id) },
            GameMode::Unlimited => { pricing_notme(drug_id) },
        }
    }
}


fn pricing_notme(drug_id: DrugEnum) -> PriceSettings {
    match drug_id {
        DrugEnum::Ludes => {
            PriceSettings {
                min_price: 30 * SCALING_FACTOR,
                max_price: 140 * SCALING_FACTOR,
                min_qty: 1800,
                max_qty: 3600,
            }
        },
        DrugEnum::Speed => {
            PriceSettings {
                min_price: 120 * SCALING_FACTOR,
                max_price: 480 * SCALING_FACTOR,
                min_qty: 1500,
                max_qty: 3000,
            }
        },
        DrugEnum::Weed => {
            PriceSettings {
                min_price: 420 * SCALING_FACTOR,
                max_price: 1600 * SCALING_FACTOR,
                min_qty: 1300,
                max_qty: 2600,
            }
        },
        DrugEnum::Acid => {
            PriceSettings {
                min_price: 1200 * SCALING_FACTOR,
                max_price: 4000 * SCALING_FACTOR,
                min_qty: 1200,
                max_qty: 2400,
            }
        },
        DrugEnum::Heroin => {
            PriceSettings {
                min_price: 3800 * SCALING_FACTOR,
                max_price: 10500 * SCALING_FACTOR,
                min_qty: 1100,
                max_qty: 2200,
            }
        },
        DrugEnum::Cocaine => {
            PriceSettings {
                min_price: 8800 * SCALING_FACTOR,
                max_price: 20500 * SCALING_FACTOR,
                min_qty: 900,
                max_qty: 1800,
            }
        },
    }
}


fn pricing_clicksave(drug_id: DrugEnum) -> PriceSettings {
    match drug_id {
        DrugEnum::Ludes => {
            PriceSettings {
                min_price: 15 * SCALING_FACTOR,
                max_price: 105 * SCALING_FACTOR,
                min_qty: 1500,
                max_qty: 3000,
            }
        },
        DrugEnum::Speed => {
            PriceSettings {
                min_price: 90 * SCALING_FACTOR,
                max_price: 540 * SCALING_FACTOR,
                min_qty: 1200,
                max_qty: 2400,
            }
        },
        DrugEnum::Weed => {
            PriceSettings {
                min_price: 450 * SCALING_FACTOR,
                max_price: 2250 * SCALING_FACTOR,
                min_qty: 1000,
                max_qty: 2000,
            }
        },
        DrugEnum::Acid => {
            PriceSettings {
                min_price: 1800 * SCALING_FACTOR,
                max_price: 7200 * SCALING_FACTOR,
                min_qty: 800,
                max_qty: 1600,
            }
        },
        DrugEnum::Heroin => {
            PriceSettings {
                min_price: 5400 * SCALING_FACTOR,
                max_price: 16200 * SCALING_FACTOR,
                min_qty: 600,
                max_qty: 1200,
            }
        },
        DrugEnum::Cocaine => {
            PriceSettings {
                min_price: 10800 * SCALING_FACTOR,
                max_price: 21600 * SCALING_FACTOR,
                min_qty: 500,
                max_qty: 1000,
            }
        },
    }
}
