use rollyourown::traits::{Enumerable};

#[derive(Copy, Drop, Serde, PartialEq)]
enum Drugs {
    Ludes,
    Speed,
    Weed,
    Acid,
    Heroin,
    Cocaine,
}

//
//
//

impl DrugsEnumerableImpl of Enumerable<Drugs> {
    fn all() -> Span<Drugs> {
        let mut items = array![
            Drugs::Ludes,
            Drugs::Speed,
            Drugs::Weed,
            Drugs::Acid,
            Drugs::Heroin,
            Drugs::Cocaine
        ];
        items.span()
    }
}

//
//
//

impl DrugsIntoFelt252 of Into<Drugs, felt252> {
    fn into(self: Drugs) -> felt252 {
        match self {
            Drugs::Ludes => 'Ludes',
            Drugs::Speed => 'Speed',
            Drugs::Weed => 'Weed',
            Drugs::Acid => 'Acid',
            Drugs::Heroin => 'Heroin',
            Drugs::Cocaine => 'Cocaine',
        }
    }
}

impl DrugsIntoU8 of Into<Drugs, u8> {
    fn into(self: Drugs) -> u8 {
        match self {
            Drugs::Ludes => 0,
            Drugs::Speed => 1,
            Drugs::Weed => 2,
            Drugs::Acid => 3,
            Drugs::Heroin => 4,
            Drugs::Cocaine => 5,
        }
    }
}



