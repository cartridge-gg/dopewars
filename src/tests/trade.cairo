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

use rollyourown::components::player::Cash;
use rollyourown::components::drug::Drug;
use rollyourown::components::location::Location;
use rollyourown::components::market::Market;
use rollyourown::components::market::MarketTrait;
use rollyourown::tests::spawn::spawn_game;
use rollyourown::tests::spawn::spawn_location;
use rollyourown::tests::spawn::spawn_player;
use rollyourown::constants::SCALING_FACTOR;

const DRUG_ID: felt252 = 0;
const QUANTITY: usize = 50_usize;

#[test]
#[available_gas(30000000)]
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

    gas::withdraw_gas().expect('out of gas');

    // verify player has drug in inventory
    let mut res = world.entity(
        'Drug'.into(), (game_id, (player_id, DRUG_ID)).into_partitioned(), 0_u8, 0_usize
    );
    assert(res.len() > 0_usize, 'no drug');
    let drug = serde::Serde::<Drug>::deserialize(ref res).expect('deserialization failed');
    assert(drug.quantity == QUANTITY, 'incorrect quantity');

    // calc market cost
    let market = Market { cash: 100_u128 * SCALING_FACTOR, quantity: 1000_usize };
    let cost = market.buy(QUANTITY);

    // verify player has cash - cost
    let mut res = world.entity(
        'Cash'.into(), (game_id, (player_id)).into_partitioned(), 0_u8, 0_usize
    );
    assert(res.len() > 0_usize, 'no cash');
    let cash = serde::Serde::<Cash>::deserialize(ref res).expect('deserialization failed');
    assert(cash.amount == (100_u128 * SCALING_FACTOR - cost), 'incorrect cash');

    gas::withdraw_gas().expect('out of gas');
}


#[test]
#[available_gas(30000000)]
fn test_player_sell() {
    let (world_address, game_id, player_id) = spawn_game();
    let location_id = spawn_location(world_address, game_id);

    let world = IWorldDispatcher { contract_address: world_address };

    // give player drug
    let mut calldata = array::ArrayTrait::new();
    serde::Serde::<Drug>::serialize(ref calldata, Drug { id: 0, quantity: QUANTITY });
    world.set_entity(
        'Drug'.into(),
        (game_id, (player_id, DRUG_ID)).into_partitioned(),
        0_u8,
        ArrayTrait::span(@calldata)
    );

    // travel to location
    let mut player_travel_calldata = array::ArrayTrait::<felt252>::new();
    player_travel_calldata.append(game_id);
    player_travel_calldata.append(location_id);
    world.execute('Travel'.into(), player_travel_calldata.span());

    // sell to market
    let mut sell_calldata = array::ArrayTrait::<felt252>::new();
    sell_calldata.append(game_id);
    sell_calldata.append(location_id);
    sell_calldata.append(DRUG_ID);
    sell_calldata.append(QUANTITY.into());
    world.execute('Sell'.into(), sell_calldata.span());

    gas::withdraw_gas().expect('out of gas');

    // verify player has no drug
    let mut res = world.entity(
        'Drug'.into(), (game_id, (player_id, DRUG_ID)).into_partitioned(), 0_u8, 0_usize
    );
    assert(res.len() > 0_usize, 'no drug');
    let drug = serde::Serde::<Drug>::deserialize(ref res).expect('deserialization failed');
    assert(drug.quantity == 0_usize, 'incorrect quantity');
// FIXME: keep getting gas withdraw errors
// // calc market cost
// let market = Market { cash: 100_u128 * SCALING_FACTOR, quantity: 1000_usize};
// let payout = market.sell(QUANTITY);

// // verify player has cash + payout
// let mut res = world.entity('Cash'.into(), (game_id, (player_id)).into_partitioned(), 0_u8, 0_usize);
// assert(res.len() > 0_usize, 'no cash');
// let cash = serde::Serde::<Cash>::deserialize(ref res).expect('deserialization failed');
// assert(cash.amount == (100_u128 * SCALING_FACTOR + payout), 'incorrect cash');
}
