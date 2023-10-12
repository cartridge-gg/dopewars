use starknet::ContractAddress;
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

use rollyourown::models::location::LocationEnum;


#[derive(Model, Copy, Drop, Serde)]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    name: felt252,
    status: PlayerStatus,
    location_id: LocationEnum,
    cash: u128,
    health: u8,
    run_attempts: u8,
    drug_count: usize,
    bag_limit: usize,
    turns_remaining: usize,
    turns_remaining_on_death: usize
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn can_continue(self: Player) -> bool {
        if self.health == 0 {
            return false;
        }
        if self.turns_remaining == 0 {
            return false;
        }
        if self.status != PlayerStatus::Normal {
            return false;
        }

        true
    }
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum PlayerStatus {
    Normal: (),
    BeingMugged: (),
    BeingArrested: (),
}

impl PlayerStatusIntrospectionImpl of SchemaIntrospection<PlayerStatus> {
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
                name: 'PlayerStatus',
                attrs: array![].span(),
                children: array![
                    ('Normal', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('BeingMugged', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('BeingArrested', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}



