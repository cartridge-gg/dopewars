use starknet::ContractAddress;
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

#[derive(Model, Copy, Drop, Serde)]
struct Drug {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    drug_id: DrugEnum,
    quantity: usize,
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum DrugEnum {
    Ludes,
    Speed,
    Weed,
    Acid,
    Heroin,
    Cocaine,
}

impl LocationEnumIntoFelt252 of Into<DrugEnum, felt252> {
    fn into(self: DrugEnum) -> felt252 {
        match self {
            DrugEnum::Ludes => 'Ludes',
            DrugEnum::Speed => 'Speed',
            DrugEnum::Weed => 'Weed',
            DrugEnum::Acid => 'Acid',
            DrugEnum::Heroin => 'Heroin',
            DrugEnum::Cocaine => 'Cocaine',
        }
    }
}

#[generate_trait]
impl DrugImpl of DrugTrait {
    // fn all() -> Span<felt252> {
    //     let mut drugs = array!['Ludes', 'Speed', 'Weed', 'Acid', 'Heroin', 'Cocaine'];
    //     drugs.span()
    // }

    fn all() -> Span<DrugEnum> {
        let mut drugs = array![
            DrugEnum::Ludes,
            DrugEnum::Speed,
            DrugEnum::Weed,
            DrugEnum::Acid,
            DrugEnum::Heroin,
            DrugEnum::Cocaine
        ];
        drugs.span()
    }
}


impl DrugEnumIntrospectionImpl of SchemaIntrospection<DrugEnum> {
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
                name: 'DrugEnum',
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
