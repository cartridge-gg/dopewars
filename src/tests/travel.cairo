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

use rollyourown::PlayerStatus;
use rollyourown::components::player::Player;
use rollyourown::tests::create::{spawn_game, spawn_player};
use rollyourown::constants::{TRAVEL_RISK, COPS_DRUG_THRESHOLD};

const WEED_ID: felt252 = 0x57656564; // weed
// #[test]
// #[available_gas(110000000)]
// fn test_travel_and_decision() {
//     let (world_address, game_id, player_id) = spawn_game(); // creator auto joins
//     let world = IWorldDispatcher { contract_address: world_address };
//     let player = get!(world, (game_id, player_id).into(), (Player));

//     let mut buy_calldata = array::ArrayTrait::<felt252>::new();
//     buy_calldata.append(game_id.into());
//     buy_calldata.append(player.location_id);
//     buy_calldata.append(WEED_ID);
//     buy_calldata.append(COPS_DRUG_THRESHOLD.into());
//     world.execute('buy'.into(), buy_calldata);

//     let brooklyn_id = 'Brooklyn';
//     let mut travel_calldata = array::ArrayTrait::<felt252>::new();
//     travel_calldata.append(game_id.into());
//     travel_calldata.append(brooklyn_id);

//     starknet::testing::set_transaction_hash(TRAVEL_RISK.into());
//     world.execute('travel', travel_calldata);

//     let player = get!(world, (game_id, player_id).into(), (Player));
//     assert(player.status != PlayerStatus::Normal, 'incorrect status');
//     assert(player.location_id != brooklyn_id, 'should not have traveled');

//     let queens_id = 'Queens';
//     let mut decision_calldata = array::ArrayTrait::<felt252>::new();
//     decision_calldata.append(game_id.into());
//     decision_calldata.append(0.into()); // 0 = pay
//     decision_calldata.append(queens_id);

//     world.execute('decide', decision_calldata);

//     let player = get!(world, (game_id, player_id).into(), (Player));
//     assert(player.location_id == queens_id, 'should have traveled');
// }

