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
use dojo_core::interfaces::IWorldDispatcher;
use dojo_core::interfaces::IWorldDispatcherTrait;
use dojo_core::string::ShortStringTrait;
use dojo_core::integer::u250Trait;
use dojo_core::executor::Executor;
use dojo_core::world::World;

use rollyourown::tests::spawn::spawn_game;
use rollyourown::tests::spawn::spawn_location;
use rollyourown::tests::spawn::spawn_player;

#[test]
#[available_gas(30000000)]
fn test_travel() {
    let (world_address, game_id) = spawn_game();
    let player_id = spawn_player(world_address, game_id, 1);
    let location_id = spawn_location(world_address, game_id);
}
