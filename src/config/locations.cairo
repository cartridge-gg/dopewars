use rollyourown::traits::{Enumerable, Randomizable};
use rollyourown::utils::random::{Random, RandomImpl};

#[derive(Copy, Drop, Serde, PartialEq)]
enum Locations {
    Home,
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

impl LocationsRandomizableImpl of Randomizable<Locations> {
    fn random(ref randomizer: Random) -> Locations {
        let locations = LocationsEnumerableImpl::all();
        let index = randomizer.between::<u32>(0, locations.len().into());
        *locations.at(index.try_into().unwrap())
    }
}

//
//
//

impl LocationsIntoFelt252 of Into<Locations, felt252> {
    fn into(self: Locations) -> felt252 {
        match self {
            Locations::Home => 'Home',
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
            Locations::Home => 0,
            Locations::Queens => 1,
            Locations::Bronx => 2,
            Locations::Brooklyn => 3,
            Locations::Jersey => 4,
            Locations::Central => 5,
            Locations::Coney => 6,
        }
    }
}



// TODO: remove when Locations are removed from Models
use dojo::database::introspect::{
    Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type
};

impl LocationsIntrospectionImpl of Introspect<Locations> {
    #[inline(always)]
    fn size() -> usize {
        1
    }

    #[inline(always)]
    fn layout(ref layout: Array<u8>) {
        layout.append(8);
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Enum(
            Enum {
                name: 'Locations',
                attrs: array![].span(),
                children: array![
                    ('Home', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Queens', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Bronx', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Brooklyn', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Jersey', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Central', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Coney', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}

