use starknet::ContractAddress;
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};
use dojo::world::{IWorld, IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::location::LocationEnum;
use rollyourown::models::item::{Item, ItemEnum};


#[derive(Model, Copy, Drop, Serde)]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    name: felt252,
    status: PlayerStatus,
    location_id: LocationEnum,
    turn: usize,
    max_turns: usize,
    max_items: u8,
    cash: u128,
    health: u8,
    drug_count: usize,
    attack: usize,
    defense: usize,
    transport: usize,
    speed: usize,
    wanted: u8,
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn can_continue(self: Player) -> bool {
        if self.health == 0 {
            return false;
        }
        if self.max_turns != 0 && self.turn == self.max_turns {
            return false;
        }
        if self.status != PlayerStatus::Normal {
            return false;
        }

        true
    }

    fn get_item_count(self: Player, world: IWorldDispatcher) -> u8 {
        let attack_item = get!(world, (self.game_id, self.player_id, ItemEnum::Attack), (Item));
        let defense_item = get!(world, (self.game_id, self.player_id, ItemEnum::Defense), (Item));
        let transport_item = get!(
            world, (self.game_id, self.player_id, ItemEnum::Transport), (Item)
        );
        let speed_item = get!(world, (self.game_id, self.player_id, ItemEnum::Speed), (Item));

        let mut total: u8 = if attack_item.level > 0 {
            1
        } else {
            0
        };
        total += if defense_item.level > 0 {
            1
        } else {
            0
        };
        total += if transport_item.level > 0 {
            1
        } else {
            0
        };
        total += if speed_item.level > 0 {
            1
        } else {
            0
        };
        total
    }

    fn get_attack(self: Player, world: IWorldDispatcher) -> usize {
        let item = get!(world, (self.game_id, self.player_id, ItemEnum::Attack), (Item));
        self.attack + item.value
    }

    fn get_defense(self: Player, world: IWorldDispatcher) -> usize {
        let item = get!(world, (self.game_id, self.player_id, ItemEnum::Defense), (Item));
        self.defense + item.value
    }

    fn get_transport(self: Player, world: IWorldDispatcher) -> usize {
        let item = get!(world, (self.game_id, self.player_id, ItemEnum::Transport), (Item));
        self.transport + item.value
    }

    fn get_speed(self: Player, world: IWorldDispatcher) -> usize {
        let item = get!(world, (self.game_id, self.player_id, ItemEnum::Speed), (Item));
        self.speed + item.value
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

