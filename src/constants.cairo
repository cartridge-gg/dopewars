const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 60; // 60% chance of travel encounter
const CAPTURE_RISK: u8 = 60; // 60% chance of capture

const ENCOUNTER_BIAS_GANGS: u128 = 75;
const COPS_DRUG_THRESHOLD: usize = 5; // cops encounter threshold

const HEALTH_IMPACT: u8 = 10;
const GANGS_PAYMENT: usize = 20;

// starting stats
const STARTING_CASH: u128 = 2000_0000; // $2000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;

// market events
const PRICE_VAR: u8 = 3; // 3% chance 
const MIN_PRICE_VAR: u8 = 20; // 20%  
const MAX_PRICE_VAR: u8 = 50; // 50%  
const MAX_EXTRA_PRICE_VAR: u8 = 42; // 42%  
