use starknet::ContractAddress;
use rollyourown::utils::random;

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
        let seed = random::seed();

        let locations = LocationImpl::all();
        let index = random::random(seed, 0, locations.len().into());

        *locations.at(index.try_into().unwrap())
    }
}

