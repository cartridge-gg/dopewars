use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorld, IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    traits::{Enumerable}, models::item::{Item},
    config::{locations::Locations, items::{ItemSlot, ItemLevel}, game::GameConfigImpl}
};


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
}

//
//
//

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
