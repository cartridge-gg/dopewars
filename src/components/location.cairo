use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::{Into, TryInto};

#[derive(Component, Copy, Drop, Serde)]
struct Location {
    name: felt252
}

trait LocationTrait {
    fn all() -> Span<felt252>;
    fn random(seed: felt252) -> felt252;
}

impl LocationImpl of LocationTrait {
    fn all() -> Span<felt252> {
        let mut locations = array::ArrayTrait::new();
        locations.append('Queens'.into());
        locations.append('TheBronx'.into());
        locations.append('Brooklyn'.into());
        locations.append('JerseyCity'.into());
        locations.append('CentralPark'.into());
        locations.append('ConeyIsland'.into());

        locations.span()
    }

    fn random(seed: felt252) -> felt252 {
        let locations = LocationImpl::all();
        let seed: u256 = seed.into();
        let len: u128 = locations.len().into();
        let index: usize = (seed.low % len).try_into().unwrap();

        *locations.at(index)
    }
}
