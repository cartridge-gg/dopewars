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
use dojo::interfaces::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::execution_context::Context;
use dojo::auth::components::AuthRole;
use dojo::string::ShortStringTrait;
use dojo::integer::u250Trait;
use dojo::executor::Executor;
use dojo::world::World;

use rollyourown::components::{
    player::Cash, drug::Drug, location::Location, market::{Market, MarketTrait}
};
use rollyourown::tests::spawn::{spawn_game, spawn_location, spawn_player};
use rollyourown::constants::SCALING_FACTOR;

const DRUG_ID: felt252 = 0;
const QUANTITY: usize = 50;

#[test]
#[available_gas(100000000)]
fn test_player_buy() {
    let (world_address, game_id, player_id) = spawn_game();
    let location_id = spawn_location(world_address, game_id);

    let world = IWorldDispatcher { contract_address: world_address };

    // travel to location
    let mut player_travel_calldata = array::ArrayTrait::<felt252>::new();
    player_travel_calldata.append(game_id);
    player_travel_calldata.append(location_id);
    world.execute('Travel'.into(), player_travel_calldata.span());

    // buy from market
    let mut buy_calldata = array::ArrayTrait::<felt252>::new();
    buy_calldata.append(game_id);
    buy_calldata.append(location_id);
    buy_calldata.append(DRUG_ID);
    buy_calldata.append(QUANTITY.into());
    world.execute('Buy'.into(), buy_calldata.span());

    // verify player has drug in inventory
    let mut res = world
        .entity('Drug'.into(), (game_id, (player_id, DRUG_ID)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no drug');
    let drug = serde::Serde::<Drug>::deserialize(ref res).expect('deserialization failed');
    assert(drug.quantity == QUANTITY, 'incorrect quantity');

    // calc market cost
    let market = Market { cash: 100 * SCALING_FACTOR, quantity: 1000 };
    let cost = market.buy(QUANTITY);

    // verify player has cash - cost
    let mut res = world.entity('Cash'.into(), (game_id, (player_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no cash');
    let cash = serde::Serde::<Cash>::deserialize(ref res).expect('deserialization failed');
    assert(cash.amount == (100 * SCALING_FACTOR - cost), 'incorrect cash');
}
// FIXME
// #[test]
// #[available_gas(100000000)]
// fn test_player_sell() {
//     let (world_address, game_id, player_id) = spawn_game();
//     let location_id = spawn_location(world_address, game_id);

//     let world = IWorldDispatcher { contract_address: world_address };

//     let ctx = Context {
//         world,
//         caller_account: world.contract_address,
//         caller_system: 'Sell'.into(),
//         execution_role: AuthRole {
//             id: 'DrugWriter'.into()
//         },
//     };
//     // give player drug
//     let mut calldata = array::ArrayTrait::new();
//     serde::Serde::serialize(@Drug { id: 0.into(), quantity: QUANTITY }, ref calldata);
//     World::set_entity(
//             ctx,
//             'Drug'.into(),
//             (game_id, (player_id, DRUG_ID)).into_partitioned(),
//             0,
//             ArrayTrait::span(@calldata)
//         );

//     // travel to location
//     let mut player_travel_calldata = array::ArrayTrait::<felt252>::new();
//     player_travel_calldata.append(game_id);
//     player_travel_calldata.append(location_id);
//     world.execute('Travel'.into(), player_travel_calldata.span());

//     // sell to market
//     let mut sell_calldata = array::ArrayTrait::<felt252>::new();
//     sell_calldata.append(game_id);
//     sell_calldata.append(location_id);
//     sell_calldata.append(DRUG_ID);
//     sell_calldata.append(QUANTITY.into());
//     world.execute('Sell'.into(), sell_calldata.span());

//     // verify player has no drug
//     let mut res = world
//         .entity('Drug'.into(), (game_id, (player_id, DRUG_ID)).into_partitioned(), 0, 0);
//     assert(res.len() > 0, 'no drug');
//     let drug = serde::Serde::<Drug>::deserialize(ref res).expect('deserialization failed');
//     assert(drug.quantity == 0, 'incorrect quantity');
// // FIXME: keep getting gas withdraw errors
// // // calc market cost
// // let market = Market { cash: 100 * SCALING_FACTOR, quantity: 1000};
// // let payout = market.sell(QUANTITY);

// // // verify player has cash + payout
// // let mut res = world.entity('Cash'.into(), (game_id, (player_id)).into_partitioned(), 0, 0);
// // assert(res.len() > 0, 'no cash');
// // let cash = serde::Serde::<Cash>::deserialize(ref res).expect('deserialization failed');
// // assert(cash.amount == (100 * SCALING_FACTOR + payout), 'incorrect cash');
// }


