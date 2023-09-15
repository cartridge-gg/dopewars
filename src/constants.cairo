const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 30; // 30% chance of mugged
const RUN_CHANCE: u8 = 50; // 50% chance of successfully getting away

const BASE_PAYMENT: u128 = 400_0000; // base payment is $400

// starting stats
const STARTING_CASH: u128 = 2000_0000; // $2000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;

// market eventsks
const PRICE_VAR: u8 = 3; // 3% chance 
const MIN_PRICE_VAR: u8 = 20; // 20%  
const MAX_PRICE_VAR: u8 = 50; // 50%  
const MAX_EXTRA_PRICE_VAR: u8 = 42; // 42%  
