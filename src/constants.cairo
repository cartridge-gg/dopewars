const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 60; // 60% chance of travel encounter
const CAPTURE_RISK: u8 = 60; // 60% chance of capture

const ENCOUNTER_BIAS_GANGS: u128 = 50; // 50% chance of gangs encounter vs cops
const COPS_DRUG_THRESHOLD: usize = 2; // cops encounter threshold
const GANGS_CASH_THRESHOLD: u128 = 1000_0000; // gangs encounter threshold

const HEALTH_IMPACT: u8 = 10;
const GANGS_PAYMENT: usize = 20; // 20% of cash
const COPS_PAYMENT: usize = 20; // 20% of drugs

// starting stats
const STARTING_CASH: u128 = 2000_0000; // $2000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;

// market events
const PRICE_VAR: u8 = 3; // 3% chance 
const MIN_PRICE_VAR: u8 = 20; // 20%  
const MAX_PRICE_VAR: u8 = 50; // 50%  
const MAX_EXTRA_PRICE_VAR: u8 = 42; // 42%  
