use core::{traits::Into, result::ResultTrait};
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use starknet::contract_address_const;
use dojo::database::query::{IntoPartitioned, IntoPartitionedQuery};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::world::Context;
use dojo::SerdeLen;
use serde::Serde;

use rollyourown::components::{player::Player, bank::Bank};
use rollyourown::tests::create::{spawn_game, spawn_player};
use rollyourown::constants::{SCALING_FACTOR, STARTING_CASH};


#[test]
#[available_gas(100000000)]
#[should_panic(
    expected: ('not enough cash', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED')
)]
fn test_bank_deposit_more_than_owned() {
    let (world_address, game_id, player_id) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let p1_key = (game_id, player_id);

    // get player
    let mut p1_ser = world.entity('Player'.into(), p1_key.into(), 0, SerdeLen::<Player>::len());
    let p1 = Serde::<Player>::deserialize(ref p1_ser).expect('player not found');

    let mut bank_calldata = ArrayTrait::new();
    bank_calldata.append(game_id.into());
    bank_calldata.append((STARTING_CASH + 1 * SCALING_FACTOR).into());

    //call deposit
    let res_deposit = world.execute('bank_deposit'.into(), bank_calldata.span());
}

#[test]
#[available_gas(100000000)]
#[should_panic(
    expected: ('not enough cash', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED', 'ENTRYPOINT_FAILED')
)]
fn test_bank_withdraw_more_than_deposited() {
    let (world_address, game_id, player_id) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let p1_key = (game_id, player_id);

    // get player
    let mut p1_ser = world.entity('Player'.into(), p1_key.into(), 0, SerdeLen::<Player>::len());
    let p1 = Serde::<Player>::deserialize(ref p1_ser).expect('player not found');

    let mut bank_calldata = ArrayTrait::new();
    bank_calldata.append(game_id.into());
    bank_calldata.append((1 * SCALING_FACTOR).into());

    //call deposit
    let res_deposit = world.execute('bank_withdraw'.into(), bank_calldata.span());
}


#[test]
#[available_gas(100000000)]
fn test_multiplayer() {
    let (world_address, game_id, player1_id) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let p1_key = (game_id, player1_id);

    // get player
    let mut p1_ser = world.entity('Player'.into(), p1_key.into(), 0, SerdeLen::<Player>::len());
    let p1 = Serde::<Player>::deserialize(ref p1_ser).expect('player not found');

    // player 1 deposit calldata
    let mut bank_calldata = ArrayTrait::new();
    bank_calldata.append(game_id.into());
    bank_calldata.append((1 * SCALING_FACTOR).into());

    // player 1 deposit 1
    let res_deposit = world.execute('bank_deposit'.into(), bank_calldata.span());

    // connect as player 2
    starknet::testing::set_contract_address(2.try_into().unwrap());
    let player2_id = spawn_player(world_address, game_id.into());

    // player 2 deposit calldata
    let mut bank_calldata = ArrayTrait::new();
    bank_calldata.append(game_id.into());
    bank_calldata.append((420 * SCALING_FACTOR).into());

    // player 2 deposit 22
    let res_deposit = world.execute('bank_deposit'.into(), bank_calldata.span());

    // get player 1 bank data
    let mut bank1_ser = world
        .entity('Bank'.into(), (game_id, player1_id).into(), 0, SerdeLen::<Bank>::len());
    let bank1 = Serde::<Bank>::deserialize(ref bank1_ser).expect('bank deser failed');

    // get player 2 bank data
    let mut bank2_ser = world
        .entity('Bank'.into(), (game_id, player2_id).into(), 0, SerdeLen::<Bank>::len());
    let bank2 = Serde::<Bank>::deserialize(ref bank2_ser).expect('bank deser failed');

    assert(bank1.amount == (1 * SCALING_FACTOR).into(), 'invalid bank 1 amount');
    assert(bank2.amount == (420 * SCALING_FACTOR).into(), 'invalid bank 2 amount');
}

