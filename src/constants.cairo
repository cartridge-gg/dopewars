const SCALING_FACTOR: u128 = 10_000;

const TRAVEL_RISK: u8 = 30;
const HURT_RISK: u8 = 0;
const MUGGED_RISK: u8 = 0;
const ARRESTED_RISK: u8 = 50;

// max drug price is $300
// min drug price is $2
const MAX_QUANTITY: usize = 50_000;
const MIN_QUANITTY: usize = 20_000;
const MAX_CASH: u128 = 60_000_000_000; // $6Mil
const MIN_CASH: u128 = 1_000_000_000; // $100k

// cash players start with
const STARTING_CASH: u128 = 20_000_000; // $2000
