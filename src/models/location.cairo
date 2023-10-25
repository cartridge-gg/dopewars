use starknet::ContractAddress;
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

use rollyourown::utils::random;

struct Location {}


#[derive(Copy, Drop, Serde, PartialEq)]
enum LocationEnum {
    Home, // 0
    Queens, // 1
    Bronx, // 2
    Brooklyn, // 3
    Jersey, // 4
    Central, // 5
    Coney, // 6
// Hospital
}

impl LocationEnumIntoFelt252 of Into<LocationEnum, felt252> {
    fn into(self: LocationEnum) -> felt252 {
        match self {
            LocationEnum::Home => 'Home',
            LocationEnum::Queens => 'Queens',
            LocationEnum::Bronx => 'Bronx',
            LocationEnum::Brooklyn => 'Brooklyn',
            LocationEnum::Jersey => 'Jersey',
            LocationEnum::Central => 'Central',
            LocationEnum::Coney => 'Coney',
        }
    }
}

impl LocationEnumIntoU8 of Into<LocationEnum, u8> {
    fn into(self: LocationEnum) -> u8 {
        match self {
            LocationEnum::Home => 0,
            LocationEnum::Queens => 1,
            LocationEnum::Bronx => 2,
            LocationEnum::Brooklyn => 3,
            LocationEnum::Jersey => 4,
            LocationEnum::Central => 5,
            LocationEnum::Coney => 6,
        }
    }
}


impl LocationEnumIntrospectionImpl of SchemaIntrospection<LocationEnum> {
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
                name: 'LocationEnum',
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


#[generate_trait]
impl LocationImpl of LocationTrait {
    fn all() -> Span<LocationEnum> {
        let mut locations = array![
            LocationEnum::Queens,
            LocationEnum::Bronx,
            LocationEnum::Brooklyn,
            LocationEnum::Jersey,
            LocationEnum::Central,
            LocationEnum::Coney
        ];
        locations.span()
    }

    fn random() -> LocationEnum {
        let seed = random::seed();

        let locations = LocationImpl::all();
        let index = random::random(seed, 0, locations.len().into());

        *locations.at(index.try_into().unwrap())
    }
}

