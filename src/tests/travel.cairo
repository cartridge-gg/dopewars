use core::{traits::Into, result::ResultTrait};
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use dojo::test_utils::spawn_test_world;

use rollyourown::components::location::{location, Location};
use rollyourown::tests::create::{spawn_game, spawn_player};

#[test]
#[available_gas(110000000)]
fn test_travel() {
    let (world_address, game_id, player_id) = spawn_game(); // creator auto joins
    let world = IWorldDispatcher { contract_address: world_address };

    let brooklyn_id: felt252 = 'Brooklyn'.into();
    let mut travel_calldata = array::ArrayTrait::<felt252>::new();
    travel_calldata.append(game_id.into());
    travel_calldata.append(brooklyn_id.into());

    world.execute('travel'.into(), travel_calldata.span());

    let mut res = world.entity('Location'.into(), (game_id, player_id).into(), 0, 0);
    assert(res.len() > 0, 'no player location');

    let location = serde::Serde::<Location>::deserialize(ref res).expect('deserialization failed');
    assert(location.name == brooklyn_id, 'incorrect travel');

    let queens_id: felt252 = 'Queens'.into();
    let mut travel_calldata = array::ArrayTrait::<felt252>::new();
    travel_calldata.append(game_id.into());
    travel_calldata.append(queens_id.into());

    world.execute('travel'.into(), travel_calldata.span());

    let mut res = world.entity('Location'.into(), (game_id, player_id).into(), 0, 0);
    assert(res.len() > 0, 'no player location');

    let location = serde::Serde::<Location>::deserialize(ref res).expect('deserialization failed');
    assert(location.name == queens_id, 'incorrect travel');
}
