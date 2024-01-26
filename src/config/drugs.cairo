use rollyourown::traits::{Enumerable};

use core::bytes_31::{bytes31, Felt252TryIntoBytes31};


#[derive(Copy, Drop, Serde, PartialEq)]
enum Drugs {
    Ludes,
    Speed,
    Weed,
    Acid,
    Heroin,
    Cocaine,
}


#[derive(Copy, Drop, Serde)]
struct DrugConfig {
    drug: Drugs,
    name: bytes31,
    base: usize,
    step: usize,
    weight: usize,
    from_turn: u8,
    to_turn: u8,
}

#[generate_trait]
impl DrugConfigImpl of DrugConfigTrait {
    fn get(drug: Drugs) -> DrugConfig {
        match drug {
            Drugs::Ludes => DrugConfig {
                drug: Drugs::Ludes,
                name: 'Ludes'.try_into().unwrap(),
                base: 18,
                step: 1,
                weight: 2,
                from_turn: 0,
                to_turn: 7
            },
            Drugs::Speed => DrugConfig {
                drug: Drugs::Speed,
                name: 'Speed'.try_into().unwrap(),
                base: 85,
                step: 6,
                weight: 5,
                from_turn: 0,
                to_turn: 14
            },
            Drugs::Weed => DrugConfig {
                drug: Drugs::Weed,
                name: 'Weed'.try_into().unwrap(),
                base: 420,
                step: 23,
                weight: 14,
                from_turn: 0,
                to_turn: 255
            },
            Drugs::Acid => DrugConfig {
                drug: Drugs::Acid,
                name: 'Acid'.try_into().unwrap(),
                base: 1590,
                step: 69,
                weight: 30,
                from_turn: 0,
                to_turn: 255
            },
            Drugs::Heroin => DrugConfig {
                drug: Drugs::Heroin,
                name: 'Heroin'.try_into().unwrap(),
                base: 5720,
                step: 169,
                weight: 65,
                from_turn: 8,
                to_turn: 255
            },
            Drugs::Cocaine => DrugConfig {
                drug: Drugs::Cocaine,
                name: 'Cocaine'.try_into().unwrap(),
                base: 12200,
                step: 242,
                weight: 100,
                from_turn: 15,
                to_turn: 255
            },
        }
    }
}

//
//
//

impl DrugsEnumerableImpl of Enumerable<Drugs> {
    fn all() -> Span<Drugs> {
        let mut items = array![
            Drugs::Ludes, Drugs::Speed, Drugs::Weed, Drugs::Acid, Drugs::Heroin, Drugs::Cocaine
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




// TODO: remove when removing Drugs from model

use dojo::database::introspect::{
    Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type
};
impl DrugsIntrospectionImpl of Introspect<Drugs> {
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
                name: 'Drugs',
                attrs: array![].span(),
                children: array![
                    ('Ludes', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Speed', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Weed', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Acid', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Heroin', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Cocaine', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}

