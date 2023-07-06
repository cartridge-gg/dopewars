use traits::{Into, TryInto};
use core::result::ResultTrait;
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use box::BoxTrait;
use clone::Clone;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo::database::query::{IntoPartitioned, IntoPartitionedQuery};
use dojo::interfaces::{
    IComponentLibraryDispatcher, IComponentDispatcherTrait, ISystemLibraryDispatcher,
    ISystemDispatcherTrait
};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use dojo::test_utils::spawn_test_world;

use rollyourown::components::game::{game, Game};
use rollyourown::components::market::{market, Market};
use rollyourown::components::player::{stats, Stats};
use rollyourown::components::drug::{drug, Drug};
use rollyourown::components::player::{cash, Cash};
use rollyourown::components::location::{location, Location};
use rollyourown::components::risks::{risks, Risks};
use rollyourown::systems::travel::travel;
use rollyourown::systems::trade::{buy, sell};
use rollyourown::systems::join::join_game;
use rollyourown::systems::create::create_game;
use rollyourown::constants::SCALING_FACTOR;

const START_TIME: u64 = 0;
const MAX_PLAYERS: usize = 2;
const MAX_TURNS: usize = 10;
const TRAVEL_RISK: u8 = 10;
const HURT_RISK: u8 = 9;
const MUGGED_RISK: u8 = 7;
const ARRESTED_RISK: u8 = 6;

fn spawn_game() -> (ContractAddress, u32, felt252) {
    let mut components = array::ArrayTrait::new();
    components.append(game::TEST_CLASS_HASH);
    components.append(stats::TEST_CLASS_HASH);
    components.append(cash::TEST_CLASS_HASH);
    components.append(location::TEST_CLASS_HASH);
    components.append(risks::TEST_CLASS_HASH);
    components.append(market::TEST_CLASS_HASH);
    components.append(drug::TEST_CLASS_HASH);

    let mut systems = array::ArrayTrait::new();
    systems.append(create_game::TEST_CLASS_HASH);
    systems.append(join_game::TEST_CLASS_HASH);
    systems.append(travel::TEST_CLASS_HASH);
    systems.append(buy::TEST_CLASS_HASH);
    systems.append(sell::TEST_CLASS_HASH);

    let world = spawn_test_world(components, systems);

    let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
    spawn_game_calldata.append(START_TIME.into());
    spawn_game_calldata.append(MAX_PLAYERS.into());
    spawn_game_calldata.append(MAX_TURNS.into());
    let mut res = world.execute('create_game'.into(), spawn_game_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let (game_id, player_id) = serde::Serde::<(u32, felt252)>::deserialize(ref res)
        .expect('spawn deserialization failed');
    let mut res = world.entity('Game'.into(), game_id.into(), 0, 0);
    assert(res.len() > 0, 'game not found');

    let game = serde::Serde::<Game>::deserialize(ref res).expect('game deserialization failed');
    assert(game.start_time == START_TIME, 'start time mismatch');
    assert(game.max_players == MAX_PLAYERS, 'max players mismatch');
    assert(game.max_turns == MAX_TURNS, 'max turns mismatch');
    assert(game.is_finished == false, 'game is finished mismatch');

    (world.contract_address, game_id, player_id)
}

fn spawn_player(world_address: ContractAddress, game_id: felt252) -> felt252 {
    let world = IWorldDispatcher { contract_address: world_address };

    let mut spawn_player_calldata = array::ArrayTrait::<felt252>::new();
    spawn_player_calldata.append(game_id);

    let mut res = world.execute('join_game'.into(), spawn_player_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let player_id = serde::Serde::<felt252>::deserialize(ref res)
        .expect('spawn deserialization failed');

    let mut res = world.entity('Stats'.into(), (game_id, player_id).into(), 0, 0);
    assert(res.len() > 0, 'player stats not found');

    let stats = serde::Serde::<Stats>::deserialize(ref res).expect('stats deserialization failed');

    assert(stats.health == 100, 'health mismatch');
    assert(stats.arrested == false, 'arrested mismatch');

    let mut res = world.entity('Cash'.into(), (game_id, player_id).into(), 0, 0);
    assert(res.len() > 0, 'player cash not found');

    let cash = serde::Serde::<Cash>::deserialize(ref res).expect('cash deserialization failed');

    assert(cash.amount == 100 * SCALING_FACTOR, 'cash mismatch');
    player_id
}


#[test]
#[available_gas(100000000)]
fn test_create_game() {
    let (world_address, game_id, _) = spawn_game();

    let res = IWorldDispatcher {
        contract_address: world_address
    }.entity('Location'.into(), (game_id, 0).into(), 0, 0);
    assert(res.len() > 0, 'no location 1');

    let res = IWorldDispatcher {
        contract_address: world_address
    }.entity('Location'.into(), (game_id, 1).into(), 0, 0);
    assert(res.len() > 0, 'no location 2');

    let (players, _) = IWorldDispatcher {
        contract_address: world_address
    }.entities('Stats'.into(), game_id.into());
    assert(players.len() == 1, 'wrong num players');
}

