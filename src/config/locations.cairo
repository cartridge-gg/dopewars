use rollyourown::traits::{Enumerable};

#[derive(Copy, Drop, Serde, PartialEq)]
enum Locations {
    Queens, 
    Bronx,
    Brooklyn,
    Jersey,
    Central,
    Coney, 
}

//
//
//

impl LocationsEnumerableImpl of Enumerable<Locations> {
    fn all() -> Span<Locations> {
        let mut items = array![
            Locations::Queens,
            Locations::Bronx,
            Locations::Brooklyn,
            Locations::Jersey,
            Locations::Central,
            Locations::Coney
        ];
        items.span()
    }
}

//
//
//

impl LocationsIntoFelt252 of Into<Locations, felt252> {
    fn into(self: Locations) -> felt252 {
        match self {
            Locations::Queens => 'Queens',
            Locations::Bronx => 'Bronx',
            Locations::Brooklyn => 'Brooklyn',
            Locations::Jersey => 'Jersey',
            Locations::Central => 'Central',
            Locations::Coney => 'Coney',
        }
    }
}

impl LocationsIntoU8 of Into<Locations, u8> {
    fn into(self: Locations) -> u8 {
        match self {
            Locations::Queens => 0,
            Locations::Bronx => 1,
            Locations::Brooklyn => 2,
            Locations::Jersey => 3,
            Locations::Central => 4,
            Locations::Coney => 5,
        }
    }
}