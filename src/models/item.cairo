use starknet::ContractAddress;
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

#[derive(Model, Copy, Drop, Serde)]
struct Item {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    item_id: ItemEnum,
    level: u8
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum ItemEnum {
    Attack,
    Defense,
    Transport,
    Speed,
// Style
}

impl ItemEnumIntoFelt252 of Into<ItemEnum, felt252> {
    fn into(self: ItemEnum) -> felt252 {
        match self {
            ItemEnum::Attack => 'Attack',
            ItemEnum::Defense => 'Defense',
            ItemEnum::Transport => 'Transport',
            ItemEnum::Speed => 'Speed',
        }
    }
}


impl LocationEnumIntrospectionImpl of SchemaIntrospection<ItemEnum> {
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
                name: 'ItemEnum',
                attrs: array![].span(),
                children: array![
                    ('Attack', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Defense', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Transport', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Speed', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}


#[generate_trait]
impl ItemImpl of ItemTrait {
    fn all() -> Span<ItemEnum> {
        let mut items = array![
            ItemEnum::Attack, ItemEnum::Defense, ItemEnum::Transport, ItemEnum::Speed,
        ];
        items.span()
    }
}

