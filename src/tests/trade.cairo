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
use rollyourown::components::drug::Drug;
use rollyourown::components::player::Player;
use rollyourown::tests::create::{spawn_game, spawn_player};
use rollyourown::constants::SCALING_FACTOR;

const WEED_ID: felt252 = 0x57656564; // weed
const QUANTITY: usize = 3;
// #[test]
// #[available_gas(100000000)]
// fn test_trade() {
//     let (world_address, game_id, player_id) = spawn_game(); // creator auto joins
//     let world = IWorldDispatcher { contract_address: world_address };

//     let player = get!(world, (game_id, player_id).into(), (Player));

//     // market buy 3 weed
//     let mut buy_calldata = array::ArrayTrait::<felt252>::new();
//     buy_calldata.append(game_id.into());
//     buy_calldata.append(player.location_id);
//     buy_calldata.append(WEED_ID);
//     buy_calldata.append(QUANTITY.into());
//     world.execute('buy'.into(), buy_calldata);

//     let player = get!(world, (game_id, player_id).into(), (Player));
//     let player_drug = get!(world, (game_id, player_id, WEED_ID).into(), (Drug));
//     assert(player.drug_count == QUANTITY, 'wrong drug count');
//     assert(player_drug.quantity == QUANTITY, 'wrong purchase amount');

//     // market sell 1 weed
//     let mut sell_calldata = array::ArrayTrait::<felt252>::new();
//     sell_calldata.append(game_id.into());
//     sell_calldata.append(player.location_id);
//     sell_calldata.append(WEED_ID);
//     sell_calldata.append(1);
//     world.execute('sell'.into(), sell_calldata);

//     let player = get!(world, (game_id, player_id).into(), (Player));
//     assert(player.drug_count == QUANTITY - 1, 'wrong sell amount');
// }


