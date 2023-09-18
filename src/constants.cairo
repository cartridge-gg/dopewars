const SCALING_FACTOR: u128 = 10_000;

// risks
const TRAVEL_RISK: u8 = 30; // 30% chance of mugged
const RUN_CHANCE: u8 = 50; // 50% chance of successfully getting away
const TRAVEL_RISK_POLICE: u8 = 40; // 40% police / 60% gang

// consequences
const BASE_PAYMENT: u128 = 400_0000; // base payment is $400
const CAUGHT_BY_MUGGERS_HP_LOSS: u8 = 20; //20hp
const FIGHT_MUGGERS_HP_LOSS: u8 = 10; // 10hp

// // risks
// const TRAVEL_RISK: u8 = 90; // 30% chance of mugged
// const RUN_CHANCE: u8 = 10; // 50% chance of successfully getting away
// const TRAVEL_RISK_POLICE: u8 = 40; // 40% police / 60% gang

// // consequences
// const BASE_PAYMENT: u128 = 400_0000; // base payment is $400
// const CAUGHT_BY_MUGGERS_HP_LOSS: u8 = 90; //20hp
// const FIGHT_MUGGERS_HP_LOSS: u8 = 90; // 10hp

// starting stats
const STARTING_CASH: u128 = 4000_0000; // $4000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;

// market eventsks
const PRICE_VAR: u8 = 3; // 3% chance 
const MIN_PRICE_VAR: u8 = 20; // 20%  
const MAX_PRICE_VAR: u8 = 50; // 50%  
const MAX_EXTRA_PRICE_VAR: u8 = 42; // 42%  
