use traits::{Into, TryInto};
use core::result::ResultTrait;
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use box::BoxTrait;
use clone::Clone;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use dojo::test_utils::spawn_test_world;

use rollyourown::models::game::{game, Game};
use rollyourown::models::market::{market, Market};
use rollyourown::models::player::{player, Player};
use rollyourown::models::drug::{drug, Drug};
use rollyourown::models::location::Location;
use rollyourown::models::risks::{risks, Risks};
use rollyourown::models::name::{name, Name};
use rollyourown::systems::decide::decide;
use rollyourown::systems::travel::travel;
use rollyourown::systems::trade::{buy, sell};
use rollyourown::systems::join::join_game;
use rollyourown::systems::create::create_game;
use rollyourown::systems::set_name::set_name;
use rollyourown::constants::SCALING_FACTOR;

const MAX_PLAYERS: usize = 2;
const MAX_TURNS: usize = 10;
const TRAVEL_RISK: u8 = 10;
const HURT_RISK: u8 = 9;
const MUGGED_RISK: u8 = 7;
const ARRESTED_RISK: u8 = 6;

fn spawn_game() -> (ContractAddress, u32, felt252) {
    let mut components = array::ArrayTrait::new();
    components.append(game::TEST_CLASS_HASH);
    components.append(player::TEST_CLASS_HASH);
    components.append(risks::TEST_CLASS_HASH);
    components.append(market::TEST_CLASS_HASH);
    components.append(drug::TEST_CLASS_HASH);
    components.append(name::TEST_CLASS_HASH);

    let mut systems = array::ArrayTrait::new();
    systems.append(create_game::TEST_CLASS_HASH);
    systems.append(join_game::TEST_CLASS_HASH);
    systems.append(travel::TEST_CLASS_HASH);
    systems.append(buy::TEST_CLASS_HASH);
    systems.append(sell::TEST_CLASS_HASH);
    systems.append(set_name::TEST_CLASS_HASH);
    systems.append(decide::TEST_CLASS_HASH);

    let world = spawn_test_world(components, systems);

    let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
    spawn_game_calldata.append(MAX_PLAYERS.into());
    spawn_game_calldata.append(MAX_TURNS.into());
    let mut res = world.execute('create_game', spawn_game_calldata);
    assert(res.len() > 0, 'did not spawn');

    let (game_id, player_id) = serde::Serde::<(u32, felt252)>::deserialize(ref res)
        .expect('spawn deserialization failed');

    let game = get!(world, game_id, (Game));
    assert(game.max_players == MAX_PLAYERS, 'max players mismatch');
    assert(game.max_turns == MAX_TURNS, 'max turns mismatch');

    (world.contract_address, game_id, player_id)
}

fn spawn_player(world_address: ContractAddress, game_id: felt252) -> felt252 {
    let world = IWorldDispatcher { contract_address: world_address };

    let mut spawn_player_calldata = array::ArrayTrait::<felt252>::new();
    spawn_player_calldata.append(game_id);

    let mut res = world.execute('join_game', spawn_player_calldata);
    assert(res.len() > 0, 'did not spawn');

    let player_id = serde::Serde::<felt252>::deserialize(ref res)
        .expect('spawn deserialization failed');

    let player = get!(world, (game_id, player_id).into(), (Player));
    assert(player.health == 100, 'health mismatch');
    assert(player.cash == 100 * SCALING_FACTOR, 'cash mismatch');

    player_id
}


#[test]
#[available_gas(100000000)]
fn test_create_game() {
    let (world_address, game_id, player_id) = spawn_game();
    let world = IWorldDispatcher { contract_address: world_address };

    let brooklyn_risks = get!(world, (game_id, 'Brooklyn').into(), (Risks));
    assert(brooklyn_risks.location_id == 'Brooklyn', 'not Brooklyn location');

    let queens_risks = get!(world, (game_id, 'Queens').into(), (Risks));
    assert(queens_risks.location_id == 'Queens', 'not Queens location');

    let player = get!(world, (game_id, player_id).into(), (Player));
    assert(player.turns_remaining == 10, 'wrong Player turns remaining');
}

