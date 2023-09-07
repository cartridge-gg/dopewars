const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 30; // 30% chance of mugged
const RUN_CHANCE: u8 = 30; // 30% chance of successfully getting away

const RUN_PENALTY: u8 = 30; // 30% of cash lost
const PAY_PENALTY: u8 = 10; // 10% of cash lost

// max drug price is $300
// min drug price is $2
const MAX_QUANTITY: usize = 50_000;
const MIN_QUANITTY: usize = 20_000;
const MAX_CASH: u128 = 60_000_000_000; // $6Mil
const MIN_CASH: u128 = 1_000_000_000; // $100k

// cash players start with
const STARTING_CASH: u128 = 20_000_000; // $2000
