use core::{traits::Into, result::ResultTrait};
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::components::name::{name, Name};
use rollyourown::tests::create::spawn_game;

#[test]
#[available_gas(100000000)]
fn test_set_name() {
    let (world_address, game_id, player_id) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let mut set_name_calldata = ArrayTrait::<felt252>::new();
    set_name_calldata.append(game_id.into());
    set_name_calldata.append('Rambo'.into());

    world.execute('set_name'.into(), set_name_calldata.span());

    let mut res = world
        .entity('Name'.into(), (game_id, player_id).into(), 0, dojo::SerdeLen::<Name>::len());
    assert(res.len() > 0, 'no player');

    let name = serde::Serde::<Name>::deserialize(ref res).expect('deserialization failed');
    assert(name.short_string == 'Rambo'.into(), 'incorrect name');
}
