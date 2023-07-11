use traits::{Into, TryInto};

// TODO: implement proper psuedo random number generator
fn random(seed: felt252, min: u128, max: u128) -> u128 {
    let seed: u256 = seed.into();
    let range = max - min;

    (seed.low % range) + min
}
