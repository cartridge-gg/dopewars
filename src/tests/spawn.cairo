use traits::Into;
use core::result::ResultTrait;
use array::{ArrayTrait, SpanTrait};
use option::OptionTrait;
use traits::TryInto;
use box::BoxTrait;
use clone::Clone;
use debug::PrintTrait;

use starknet::{ContractAddress, syscalls::deploy_syscall};
use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
use dojo_core::storage::query::{IntoPartitioned, IntoPartitionedQuery};
use dojo_core::interfaces::{
    IWorldDispatcher, IWorldDispatcherTrait, IComponentLibraryDispatcher, IComponentDispatcherTrait,
    ISystemLibraryDispatcher, ISystemDispatcherTrait
};
use dojo_core::string::ShortStringTrait;
use dojo_core::integer::u250Trait;
use dojo_core::executor::Executor;
use dojo_core::world::World;
use dojo_core::test_utils::spawn_test_world;
use dojo_core::auth::systems::{Route, RouteTrait, GrantAuthRole};

use rollyourown::components::game::{Game, GameComponent};
use rollyourown::components::market::{Market, MarketComponent};
use rollyourown::components::player::{Stats, StatsComponent};
use rollyourown::components::drug::{Drug, DrugComponent};
use rollyourown::components::player::{Cash, CashComponent};
use rollyourown::components::location::{Location, LocationComponent};
use rollyourown::components::risks::{Risks, RisksComponent};
use rollyourown::systems::travel::Travel;
use rollyourown::systems::trade::{Buy, Sell};
use rollyourown::systems::spawn::{SpawnGame, SpawnLocation, SpawnPlayer};
use rollyourown::constants::SCALING_FACTOR;

const START_TIME: u64 = 100;
const MAX_PLAYERS: usize = 2;
const MAX_TURNS: usize = 10;
const MAX_LOCATIONS: usize = 3;
const TRAVEL_RISK: u8 = 10;
const HURT_RISK: u8 = 9;
const KILLED_RISK: u8 = 8;
const MUGGED_RISK: u8 = 7;
const ARRESTED_RISK: u8 = 6;

fn spawn_game() -> (ContractAddress, felt252, felt252) {
    let mut components = array::ArrayTrait::new();
    components.append(GameComponent::TEST_CLASS_HASH);
    components.append(StatsComponent::TEST_CLASS_HASH);
    components.append(CashComponent::TEST_CLASS_HASH);
    components.append(LocationComponent::TEST_CLASS_HASH);
    components.append(RisksComponent::TEST_CLASS_HASH);
    components.append(MarketComponent::TEST_CLASS_HASH);
    components.append(DrugComponent::TEST_CLASS_HASH);

    let mut systems = array::ArrayTrait::new();
    systems.append(SpawnGame::TEST_CLASS_HASH);
    systems.append(SpawnLocation::TEST_CLASS_HASH);
    systems.append(SpawnPlayer::TEST_CLASS_HASH);
    systems.append(Travel::TEST_CLASS_HASH);
    systems.append(Buy::TEST_CLASS_HASH);
    systems.append(Sell::TEST_CLASS_HASH);

    let mut routes = array::ArrayTrait::new();
    routes.append(RouteTrait::new('SpawnGame'.into(), 'GameWriter'.into(), 'Game'.into()));
    routes.append(RouteTrait::new('SpawnGame'.into(), 'StatsWriter'.into(), 'Stats'.into()));
    routes.append(RouteTrait::new('SpawnGame'.into(), 'CashWriter'.into(), 'Cash'.into()));
    routes.append(RouteTrait::new('SpawnGame'.into(), 'LocationWriter'.into(), 'Location'.into()));
    routes
        .append(
            RouteTrait::new('SpawnLocation'.into(), 'LocationWriter'.into(), 'Location'.into())
        );
    routes.append(RouteTrait::new('SpawnLocation'.into(), 'MarketWriter'.into(), 'Market'.into()));
    routes.append(RouteTrait::new('SpawnLocation'.into(), 'RisksWriter'.into(), 'Risks'.into()));
    routes.append(RouteTrait::new('Travel'.into(), 'LocationWriter'.into(), 'Location'.into()));
    routes.append(RouteTrait::new('Travel'.into(), 'StatsWriter'.into(), 'Stats'.into()));
    routes.append(RouteTrait::new('Travel'.into(), 'CashWriter'.into(), 'Cash'.into()));
    routes.append(RouteTrait::new('Buy'.into(), 'MarketWriter'.into(), 'Market'.into()));
    routes.append(RouteTrait::new('Buy'.into(), 'CashWriter'.into(), 'Cash'.into()));
    routes.append(RouteTrait::new('Buy'.into(), 'DrugWriter'.into(), 'Drug'.into()));
    routes.append(RouteTrait::new('Sell'.into(), 'MarketWriter'.into(), 'Market'.into()));
    routes.append(RouteTrait::new('Sell'.into(), 'CashWriter'.into(), 'Cash'.into()));
    routes.append(RouteTrait::new('Sell'.into(), 'DrugWriter'.into(), 'Drug'.into()));

    let world = spawn_test_world(components, systems, routes);

    let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
    spawn_game_calldata.append(START_TIME.into());
    spawn_game_calldata.append(MAX_PLAYERS.into());
    spawn_game_calldata.append(MAX_TURNS.into());
    spawn_game_calldata.append(MAX_LOCATIONS.into());
    let mut res = world.execute('SpawnGame'.into(), spawn_game_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let (game_id, player_id) = serde::Serde::<(felt252, felt252)>::deserialize(ref res)
        .expect('spawn deserialization failed');
    let mut res = world.entity(ShortStringTrait::new('Game'), game_id.into(), 0, 0);
    assert(res.len() > 0, 'game not found');

    let game = serde::Serde::<Game>::deserialize(ref res).expect('game deserialization failed');
    assert(game.start_time == START_TIME, 'start time mismatch');
    assert(game.max_players == MAX_PLAYERS, 'max players mismatch');
    assert(game.max_turns == MAX_TURNS, 'max turns mismatch');
    assert(game.max_locations == MAX_LOCATIONS, 'max locations mismatch');
    assert(game.is_finished == false, 'game is finished mismatch');

    (world.contract_address, game_id, player_id)
}

fn spawn_player(world_address: ContractAddress, game_id: felt252) -> felt252 {
    let world = IWorldDispatcher { contract_address: world_address };

    let mut spawn_player_calldata = array::ArrayTrait::<felt252>::new();
    spawn_player_calldata.append(game_id);

    let mut res = world.execute('SpawnPlayer'.into(), spawn_player_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let player_id = serde::Serde::<felt252>::deserialize(ref res)
        .expect('spawn deserialization failed');

    let mut res = world
        .entity(ShortStringTrait::new('Stats'), (game_id, (player_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'player stats not found');

    let stats = serde::Serde::<Stats>::deserialize(ref res).expect('stats deserialization failed');

    assert(stats.health == 100, 'health mismatch');
    assert(stats.arrested == false, 'arrested mismatch');

    let mut res = world
        .entity(ShortStringTrait::new('Cash'), (game_id, (player_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'player cash not found');

    let cash = serde::Serde::<Cash>::deserialize(ref res).expect('cash deserialization failed');

    assert(cash.amount == 100 * SCALING_FACTOR, 'cash mismatch');
    player_id
}

fn spawn_location(world_address: ContractAddress, game_id: felt252) -> felt252 {
    let world = IWorldDispatcher { contract_address: world_address };

    let mut spawn_location_calldata = array::ArrayTrait::<felt252>::new();
    spawn_location_calldata.append(game_id);
    spawn_location_calldata.append(TRAVEL_RISK.into());
    spawn_location_calldata.append(HURT_RISK.into());
    spawn_location_calldata.append(KILLED_RISK.into());
    spawn_location_calldata.append(MUGGED_RISK.into());
    spawn_location_calldata.append(ARRESTED_RISK.into());

    let mut res = world.execute('SpawnLocation'.into(), spawn_location_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let location_id = serde::Serde::<felt252>::deserialize(ref res)
        .expect('spawn deserialization failed');
    let mut res = world
        .entity(ShortStringTrait::new('Risks'), (game_id, (location_id)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'loc not found');

    let risks = serde::Serde::<Risks>::deserialize(ref res).expect('loc deserialization failed');
    assert(risks.travel == TRAVEL_RISK, 'travel risk mismatch');
    assert(risks.hurt == HURT_RISK, 'hurt risk mismatch');
    assert(risks.killed == KILLED_RISK, 'killed risk mismatch');
    assert(risks.mugged == MUGGED_RISK, 'mugged risk mismatch');
    assert(risks.arrested == ARRESTED_RISK, 'arrested risk mismatch');

    location_id
}

#[test]
#[available_gas(100000000)]
fn test_spawn_locations() {
    let (world_address, game_id, _) = spawn_game();
    let location_one = spawn_location(world_address, game_id);
    let location_two = spawn_location(world_address, game_id);

    let res = IWorldDispatcher {
        contract_address: world_address
    }.entity('Location'.into(), (game_id, (location_one)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no location 1');

    let res = IWorldDispatcher{
        contract_address: world_address
    }.entity('Location'.into(), (game_id, (location_two)).into_partitioned(), 0, 0);
    assert(res.len() > 0, 'no location 2');
}

#[test]
#[available_gas(100000000)]
fn test_spawn_player() {
    let (world_address, game_id, _) = spawn_game(); //creator auto joins

    let (players, _) = IWorldDispatcher {
        contract_address: world_address
    }.entities(ShortStringTrait::new('Stats'), u250Trait::new(game_id));
    assert(players.len() == 1, 'wrong num players');
}

