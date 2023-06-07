use core::{traits::Into, result::ResultTrait};
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo_core::storage::query::{IntoPartitioned, IntoPartitionedQuery};
use dojo_core::interfaces::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo_core::string::ShortStringTrait;
use dojo_core::integer::u250Trait;
use dojo_core::executor::Executor;
use dojo_core::world::World;

use rollyourown::tests::spawn::{spawn_game, spawn_location, spawn_player};
use rollyourown::components::location::Location;

#[test]
#[available_gas(30000000)]
fn test_travel() {
    let (world_address, game_id, player_id) = spawn_game(); // creator auto joins
    let location_one = spawn_location(world_address, game_id);
    let location_two = spawn_location(world_address, game_id);
    let world = IWorldDispatcher { contract_address: world_address };

    let mut travel_calldata = array::ArrayTrait::<felt252>::new();
    travel_calldata.append(game_id);
    travel_calldata.append(location_one);

    world.execute('Travel'.into(), travel_calldata.span());

    let mut res = world.entity('Location'.into(), (game_id, (player_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no player location');

    let location = serde::Serde::<Location>::deserialize(ref res).expect('deserialization failed');
    assert(location.id == location_one, 'incorrect travel');

    let mut travel_calldata = array::ArrayTrait::<felt252>::new();
    travel_calldata.append(game_id);
    travel_calldata.append(location_two);

    world.execute('Travel'.into(), travel_calldata.span());

    let mut res = world.entity('Location'.into(), (game_id, (player_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no player location');

    let location = serde::Serde::<Location>::deserialize(ref res).expect('deserialization failed');
    assert(location.id == location_two, 'incorrect travel');
}
