use starknet::ContractAddress;

struct Location {}



#[derive(Copy, Drop, Serde, PartialEq)]
enum LocationEnum {
    Queens,
    TheBronx,
    Brooklyn,
    JerseyCity,
    CentralPark,
    ConeyIsland,
// Hospital
}


#[generate_trait]
impl LocationImpl of LocationTrait {
    fn all() -> Span<felt252> {
        let mut locations = array![
            'Queens', 'The Bronx', 'Brooklyn', 'Jersey City', 'Central Park', 'Coney Island'
        ];
        locations.span()
    }

    fn all_enum() -> Span<LocationEnum> {
        let mut locations = array![
            LocationEnum::Queens,
            LocationEnum::TheBronx,
            LocationEnum::Brooklyn,
            LocationEnum::JerseyCity,
            LocationEnum::CentralPark,
            LocationEnum::ConeyIsland
        ];
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

