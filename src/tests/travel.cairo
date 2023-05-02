use core::traits::Into;
use core::result::ResultTrait;
use array::ArrayTrait;
use array::SpanTrait;
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::ContractAddress;
use starknet::syscalls::deploy_syscall;
use starknet::class_hash::ClassHash;
use starknet::class_hash::Felt252TryIntoClassHash;
use dojo_core::storage::query::IntoPartitioned;
use dojo_core::storage::query::IntoPartitionedQuery;
use dojo_core::interfaces::IWorldDispatcher;
use dojo_core::interfaces::IWorldDispatcherTrait;
use dojo_core::string::ShortStringTrait;
use dojo_core::integer::u250Trait;
use dojo_core::executor::Executor;
use dojo_core::world::World;

use rollyourown::tests::spawn::spawn_game;
use rollyourown::tests::spawn::spawn_location;
use rollyourown::tests::spawn::spawn_player;
use rollyourown::components::location::Location;

#[test]
#[available_gas(30000000)]
fn test_travel() {
    let (world_address, game_id) = spawn_game();
    let player_id = spawn_player(world_address, game_id);
    let location_id = spawn_location(world_address, game_id);

    let world = IWorldDispatcher { contract_address: world_address };

    let mut travel_calldata = array::ArrayTrait::<felt252>::new();
    travel_calldata.append(game_id);
    travel_calldata.append(location_id);

    gas::withdraw_gas().expect('not enough gas');
    world.execute('Travel'.into(), travel_calldata.span());

    let mut res = IWorldDispatcher {
        contract_address: world_address
    }.entity('Location'.into(), (game_id, (location_id)).into_partitioned(), 0_u8, 0_usize);
    assert(res.len() > 0_usize, 'no player location');

    let location = serde::Serde::<Location>::deserialize(ref res).expect('deserialization failed');
    assert(location.id == location_id, 'incorrect travel');
}
