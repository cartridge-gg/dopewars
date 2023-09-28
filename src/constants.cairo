const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 75; // 75% chance of travel encounter
const CAPTURE_RISK: u8 = 60; // 60% chance of capture

const ENCOUNTER_BIAS_GANGS: u128 = 50; // 50% chance of gangs encounter vs cops
const COPS_DRUG_THRESHOLD: usize = 2; // cops encounter threshold
const GANGS_CASH_THRESHOLD: u128 = 1000_0000; // gangs encounter threshold

const HEALTH_IMPACT: u8 = 10;
const GANGS_PAYMENT: usize = 50; // 20% of cash
const COPS_PAYMENT: usize = 20; // 20% of drugs

// starting stats
const STARTING_CASH: u128 = 2000_0000; // $2000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;

// market price variation
const PRICE_VAR_CHANCE: u32 = 250; // on 1000 : 50% chance = 25% up / 25% down
const PRICE_VAR_MIN: u8 = 1; // 1%  
const PRICE_VAR_MAX: u8 = 5; // 5%  

// market price events
const MARKET_EVENT_CHANCE: u32 = 7; // on 1000 : 1.4% = 0.7% up / 0.7% down
const MARKET_EVENT_MIN: u8 = 50; //   up 50%   | down 25%
const MARKET_EVENT_MAX: u8 = 100; //   up 100%  | down 50%
