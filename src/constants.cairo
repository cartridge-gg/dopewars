const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 30; // 30% chance of mugged
const RUN_CHANCE: u8 = 50; // 50% chance of successfully getting away

const BASE_PAYMENT: u128 = 400_0000; // base payment is $400

// max drug price is $300 = MAX_CASH / MIN_QUANTITY
// min drug price is $50 = MIN_CASH / MAX_QUANTITY
const MAX_QUANTITY: usize = 500;
const MIN_QUANITTY: usize = 200;
const MAX_CASH: u128 = 100_000_0000; // $100k
const MIN_CASH: u128 = 25_000_0000; // $25k

// starting stats
const STARTING_CASH: u128 = 2000_0000; // $2000
const STARTING_BAG_LIMIT: usize = 100; // inventory size
const STARTING_HEALTH: u8 = 100;
