use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorld, IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game}, traits::{Enumerable, Packable, Packer, Unpacker},
    config::{locations::Locations, items::{ItemSlot, ItemLevel}, game::GameConfigImpl},
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl},
    packing::{player_layout::{PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl}}
};


// TODO : move 
#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum PlayerStatus {
    Normal,
    BeingMugged,
    BeingArrested,
    AtPawnshop,
}

impl PlayerStatusIntoFelt252 of Into<PlayerStatus, felt252> {
    fn into(self: PlayerStatus) -> felt252 {
        match self {
            PlayerStatus::Normal => 'Normal',
            PlayerStatus::BeingMugged => 'BeingMugged',
            PlayerStatus::BeingArrested => 'BeingArrested',
            PlayerStatus::AtPawnshop => 'AtPawnshop',
        }
    }
}

impl PlayerStatusIntoU8 of Into<PlayerStatus, u8> {
    fn into(self: PlayerStatus) -> u8 {
        match self {
            PlayerStatus::Normal => 0,
            PlayerStatus::BeingMugged => 1,
            PlayerStatus::BeingArrested => 2,
            PlayerStatus::AtPawnshop => 3,
        }
    }
}

impl U8IntoPlayerStatus of Into<u8, PlayerStatus> {
    fn into(self: u8) -> PlayerStatus {
        let self252: felt252 = self.into();
        match self252 {
            0 => PlayerStatus::Normal,
            1 => PlayerStatus::BeingMugged,
            2 => PlayerStatus::BeingArrested,
            3 => PlayerStatus::AtPawnshop,
            _ => PlayerStatus::Normal,
        }
    }
}

//
//
//

#[derive(Copy, Drop, Serde)]
struct Player {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    cash: u32,
    health: u8,
    turn: u8,
    status: PlayerStatus,
    prev_location: Locations,
    location: Locations,
    next_location: Locations,
}


// Default

impl PlayerDefaultImpl of Default<Player> {
    fn default() -> Player {
        Player {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            cash: 0,
            health: 0,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
        }
    }
}


#[generate_trait]
impl PlayerImpl of PlayerTrait {
    fn new(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> Player {
        // create initial player state with game_config
        let game_config = GameConfigImpl::get(world);
        Player {
            world,
            game_id,
            player_id,
            //
            cash: game_config.cash,
            health: game_config.health,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
        }
    }

    fn with(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> Player {
        // create initial player state with world, game_id, player_id
        Player {
            world,
            game_id,
            player_id,
            //
            cash: 0,
            health: 0,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
        }
    }

    fn can_continue(self: Player) -> bool {
        // if self.game_over {
        //     return false;
        // }

        if self.health == 0 {
            return false;
        }
        if self.status != PlayerStatus::Normal {
            return false;
        }

        let game = get!(self.world, (self.game_id), (Game));
        if self.turn == game.max_turns {
            return false;
        }

        true
    }
}

//
//
//

// pack 
impl PlayerPackerImpl of Packer<Player, felt252> {
    fn pack(self: Player) -> felt252 {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = PlayerLayoutEnumerableImpl::all();

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    match *item {
                        PlayerLayout::Cash => {
                            bits.replace::<u32>(item.idx(), item.bits(), self.cash);
                        },
                        PlayerLayout::Health => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.health);
                        },
                        PlayerLayout::Turn => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.turn);
                        },
                        PlayerLayout::Status => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.status.into());
                        },
                        PlayerLayout::PrevLocation => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.prev_location.into());
                        },
                        PlayerLayout::Location => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.location.into());
                        },
                        PlayerLayout::NextLocation => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.next_location.into());
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        bits.into_felt()
    }
}

// unpack 
impl PlayerUnpackerImpl of Unpacker<felt252, Player> {
    fn unpack(
        self: felt252, world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,
    ) -> Player {
        let mut player = PlayerImpl::with(world, game_id, player_id);
        let mut layout = PlayerLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self);

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    match *item {
                        PlayerLayout::Cash => {
                            player.cash = bits.extract_into::<u32>(item.idx(), item.bits());
                        },
                        PlayerLayout::Health => {
                            player.health = bits.extract_into::<u8>(item.idx(), item.bits());
                        },
                        PlayerLayout::Turn => {
                            player.turn = bits.extract_into::<u8>(item.idx(), item.bits());
                        },
                        PlayerLayout::Status => {
                            player.status = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                        },
                        PlayerLayout::PrevLocation => {
                            player
                                .prev_location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                        PlayerLayout::Location => {
                            player
                                .location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                        PlayerLayout::NextLocation => {
                            player
                                .next_location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        player
    }
}

