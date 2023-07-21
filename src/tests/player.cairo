use core::{traits::Into, result::ResultTrait};
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::components::player::{player, Player};
use rollyourown::components::game::{game, Game};
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


#[test]
#[available_gas(100000000)]
fn test_join_game() {
    let (world_address, game_id, _) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let alice = starknet::contract_address_const::<0x1337>();
    starknet::testing::set_contract_address(alice);

    let mut join_calldata = array::ArrayTrait::<felt252>::new();
    join_calldata.append(game_id.into());
    let mut res = world.execute('join_game'.into(), join_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let player_id = serde::Serde::<felt252>::deserialize(ref res)
        .expect('spawn deserialization failed');

    let mut res = world.entity(
        'Game'.into(), game_id.into(), 0, dojo::SerdeLen::<Game>::len()
    );
    assert(res.len() > 0, 'no game');

    let game = serde::Serde::<Game>::deserialize(ref res)
        .expect('game deserialization failed');

    debug::print_felt252(game.num_players.into());
    debug::print_felt252(player_id);
 
    let mut res = world.entity('Player'.into(), (game_id, player_id).into(), 0, dojo::SerdeLen::<Player>::len());
    assert(res.len() > 0, 'player not found');

    let player = serde::Serde::<Player>::deserialize(ref res)
        .expect('player deserialization failed');

}
