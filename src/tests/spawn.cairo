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
use dojo_core::interfaces::{IWorldDispatcher, IWorldDispatcherTrait, IComponentLibraryDispatcher,
                            IComponentDispatcherTrait, ISystemLibraryDispatcher, ISystemDispatcherTrait};
use dojo_core::string::ShortStringTrait;
use dojo_core::integer::u250Trait;
use dojo_core::executor::Executor;
use dojo_core::world::World;

use rollyourown::tests::world_factory::WorldFactory;
use rollyourown::components::game::{Game, GameComponent};
use rollyourown::components::market::{Market, MarketComponent};
use rollyourown::components::player::{Stats, StatsComponent};
use rollyourown::components::drug::{Drug, DrugComponent};
use rollyourown::components::player::{Cash, CashComponent};
use rollyourown::components::location::{Location, LocationComponent};
use rollyourown::components::risks::{Risks, RisksComponent};
use rollyourown::systems::travel::TravelSystem;
use rollyourown::systems::trade::{BuySystem, SellSystem};
use rollyourown::systems::spawn::{SpawnGameSystem, SpawnLocationSystem, SpawnPlayerSystem};
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

fn assert_systems(world_address: ContractAddress, mut hashes: Array::<ClassHash>) {
    let hash = hashes.pop_front();
    match hash {
        Option::Some(class_hash) => {
            let name = ISystemLibraryDispatcher { class_hash }.name();
            let registered = IWorldDispatcher { contract_address: world_address }.system(name);
            assert(registered.into() != 0, 'system not registered');
            assert_systems(world_address, hashes);
        },
        Option::None(_) => ()
    }
}

fn assert_components(world_address: ContractAddress, mut hashes: Array::<ClassHash>) {
    let hash = hashes.pop_front();
    match hash {
        Option::Some(class_hash) => {
            let name = IComponentLibraryDispatcher { class_hash }.name();
            let registered = IWorldDispatcher { contract_address: world_address }.component(name);
            assert(registered.into() != 0, 'component not registered');
            assert_components(world_address, hashes);
        },
        Option::None(_) => ()
    }
}

fn spawn_game() -> (ContractAddress, felt252, felt252) {
    let constructor_calldata = array::ArrayTrait::<felt252>::new();
    let (executor_address, _) = deploy_syscall(
        Executor::TEST_CLASS_HASH.try_into().unwrap(), 0, constructor_calldata.span(), false
    ).unwrap();

    WorldFactory::constructor(World::TEST_CLASS_HASH.try_into().unwrap(), executor_address);

    let mut components = array::ArrayTrait::<ClassHash>::new();
    components.append(GameComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(StatsComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(CashComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(LocationComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(RisksComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(MarketComponent::TEST_CLASS_HASH.try_into().unwrap());
    components.append(DrugComponent::TEST_CLASS_HASH.try_into().unwrap());

    let mut systems = array::ArrayTrait::<ClassHash>::new();
    systems.append(SpawnGameSystem::TEST_CLASS_HASH.try_into().unwrap());
    systems.append(SpawnLocationSystem::TEST_CLASS_HASH.try_into().unwrap());
    systems.append(SpawnPlayerSystem::TEST_CLASS_HASH.try_into().unwrap());
    systems.append(TravelSystem::TEST_CLASS_HASH.try_into().unwrap());
    systems.append(BuySystem::TEST_CLASS_HASH.try_into().unwrap());
    systems.append(SellSystem::TEST_CLASS_HASH.try_into().unwrap());

    // TODO: world factory shouldn't take ownership
    let mut systems_clone = systems.clone();
    let mut components_clone = components.clone();
    let world_address = WorldFactory::spawn('RyoWorld'.into(), components, systems);
    assert_systems(world_address, systems_clone);
    assert_components(world_address, components_clone);

    let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
    spawn_game_calldata.append(START_TIME.into());
    spawn_game_calldata.append(MAX_PLAYERS.into());
    spawn_game_calldata.append(MAX_TURNS.into());
    spawn_game_calldata.append(MAX_LOCATIONS.into());

    let world = IWorldDispatcher { contract_address: world_address };
    let mut res = world.execute('SpawnGame'.into(), spawn_game_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let (game_id, player_id) = serde::Serde::<(
        felt252, felt252
    )>::deserialize(ref res).expect('spawn deserialization failed');
    let mut res = world.entity(ShortStringTrait::new('Game'), game_id.into(), 0, 0);
    assert(res.len() > 0, 'game not found');

    let game = serde::Serde::<Game>::deserialize(ref res).expect('game deserialization failed');
    assert(game.start_time == START_TIME, 'start time mismatch');
    assert(game.max_players == MAX_PLAYERS, 'max players mismatch');
    assert(game.max_turns == MAX_TURNS, 'max turns mismatch');
    assert(game.max_locations == MAX_LOCATIONS, 'max locations mismatch');
    assert(game.is_finished == false, 'game is finished mismatch');

    (world_address, game_id, player_id)
}

fn spawn_player(world_address: ContractAddress, game_id: felt252) -> felt252 {
    let world = IWorldDispatcher { contract_address: world_address };

    let mut spawn_player_calldata = array::ArrayTrait::<felt252>::new();
    spawn_player_calldata.append(game_id);

    let mut res = world.execute('SpawnPlayer'.into(), spawn_player_calldata.span());
    assert(res.len() > 0, 'did not spawn');

    let player_id = serde::Serde::<felt252>::deserialize(
        ref res
    ).expect('spawn deserialization failed');

    let mut res = world.entity(
        ShortStringTrait::new('Stats'), (game_id, (player_id)).into_partitioned(), 0, 0
    );
    assert(res.len() > 0, 'player stats not found');

    let stats = serde::Serde::<Stats>::deserialize(ref res).expect('stats deserialization failed');

    assert(stats.health == 100, 'health mismatch');
    assert(stats.arrested == false, 'arrested mismatch');

    let mut res = world.entity(
        ShortStringTrait::new('Cash'), (game_id, (player_id)).into_partitioned(), 0, 0
    );
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

    let location_id = serde::Serde::<felt252>::deserialize(
        ref res
    ).expect('spawn deserialization failed');
    let mut res = world.entity(
        ShortStringTrait::new('Risks'), (game_id, (location_id)).into_partitioned(), 0, 0
    );
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
#[available_gas(30000000)]
fn test_spawn_locations() {
    let (world_address, game_id, _) = spawn_game();
    let location_one = spawn_location(world_address, game_id);

    let location_two = spawn_location(world_address, game_id);

    let locations = IWorldDispatcher {
        contract_address: world_address
    }.entities(ShortStringTrait::new('Location'), u250Trait::new(game_id));
    assert(locations.len() == 2, 'wrong num locations');
}

#[test]
#[available_gas(30000000)]
fn test_spawn_player() {
    let (world_address, game_id, _) = spawn_game(); //creator auto joins

    let players = IWorldDispatcher {
        contract_address: world_address
    }.entities(ShortStringTrait::new('Stats'), u250Trait::new(game_id));
    assert(players.len() == 1, 'wrong num players');
}
// FIXME: unexpected error, maybe because ENTRPOINT_FAILED is returned
// #[test]
// #[should_panic(expected: ('already joined', ))]
// fn test_already_joined() {
//     let (world_address, game_id) = spawn_game(); //creator auto joins
//     let player_id = spawn_player(world_address, game_id);
// }


