fn seed() -> felt252 {
    starknet::get_tx_info().unbox().transaction_hash
}

// TODO: implement proper pseudo random number generator
fn random(seed: felt252, min: u128, max: u128) -> u128 {
    if min == max {
        return 0;
    };
    let seed = pedersen::pedersen(seed, seed);
    let seed: u256 = seed.into();
    let range = max - min;

    (seed.low % range) + min
}
