use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::{Into, TryInto};
use starknet::ContractAddress;

struct Location {}

#[generate_trait]
impl LocationImpl of LocationTrait {
    fn all() -> Span<felt252> {
        let mut locations = array::ArrayTrait::new();
        locations.append('Queens'.into());
        locations.append('The Bronx'.into());
        locations.append('Brooklyn'.into());
        locations.append('Jersey City'.into());
        locations.append('Central Park'.into());
        locations.append('Coney Island'.into());

        locations.span()
    }

    fn random() -> felt252 {
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let locations = LocationImpl::all();
        let seed: u256 = seed.into();
        let len: u128 = locations.len().into();
        let index: usize = (seed.low % len).try_into().unwrap();

        *locations.at(index)
    }
}
