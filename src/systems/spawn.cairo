#[system]
mod SpawnPlayer {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::constants::SCALING_FACTOR;

    #[event]
    fn PlayerJoined(game_id: felt252, player_id: felt252) {}

    fn execute(game_id: felt252, player_id: felt252) -> felt252 {
        let block_info = starknet::get_block_info().unbox();

        let player_id = match player_id {
            0 => starknet::get_caller_address().into(),
            _ => player_id
        };

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        // FIXME: num players is always zero
        // let players = commands::<Player>::entities(u250Trait::new(game_id));
        // assert(game.max_players > players.len(), 'max players');

        commands::set_entity(
            (game_id, (player_id)).into_partitioned(),
            (
                Stats {
                    health: 100_u8, respect: 0_u8, arrested: false, turns_remaining: game.max_turns
                    }, Cash {
                    amount: 100_u128 * SCALING_FACTOR // $100
                }
            )
        );

        PlayerJoined(game_id, player_id);
        player_id
    }
}

#[system]
mod SpawnLocation {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use debug::PrintTrait;
    use dojo_core::integer::u250Trait;

    use rollyourown::components::risks::Risks;
    use rollyourown::components::game::Game;
    use rollyourown::components::location::Location;

    #[event]
    fn LocationCreated(game_id: felt252, location_id: felt252) {}

    fn execute(
        game_id: felt252,
        travel_risk: u8,
        hurt_risk: u8,
        killed_risk: u8,
        mugged_risk: u8,
        arrested_risk: u8
    ) -> felt252 {
        gas::withdraw_gas().expect('out of gas');
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.creator == player_id, 'only creator');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        // FIXME: num locations is always zero
        // let locations = commands::<Location>::entities(u250Trait::new(game_id));
        // assert(locations.len() < game.max_locations, 'max locations');

        let location_id = commands::uuid();
        commands::set_entity(
            (game_id, (location_id)).into_partitioned(),
            (
                Location {
                    id: location_id.into()
                    }, Risks {
                    travel: travel_risk,
                    hurt: hurt_risk,
                    killed: killed_risk,
                    mugged: mugged_risk,
                    arrested: arrested_risk,
                }
            )
        );

        LocationCreated(game_id, location_id.into());
        location_id.into()
    }
}

// maybe this should be part of spawn location since each location can only
// have one market. possible once commands is lined acro
#[system]
mod SpawnMarket {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::location::Location;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::Drug;
    use rollyourown::constants::SCALING_FACTOR;

    fn execute(game_id: felt252, location_id: felt252) {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.creator == player_id, 'only creator');
        assert(game.start_time < block_info.block_timestamp, 'already started');

        let drug_1_id = commands::uuid();
        let cash = 1000_u128 * SCALING_FACTOR;
        let quantity = 1000_usize;
        commands::set_entity(
            (game_id, (location_id, drug_1_id)).into_partitioned(), (Market { cash, quantity })
        );

        let drug_2_id = commands::uuid();
        let cash = 500_u128 * SCALING_FACTOR;
        let quantity = 1000_usize;
        commands::set_entity(
            (game_id, (location_id, drug_2_id)).into_partitioned(), (Market { cash, quantity })
        );

        let drug_3_id = commands::uuid();
        let cash = 500_u128 * SCALING_FACTOR;
        let quantity = 1000_usize;
        commands::set_entity(
            (game_id, (location_id, drug_3_id)).into_partitioned(), (Market { cash, quantity })
        );
    }
}


#[system]
mod SpawnGame {
    use array::ArrayTrait;
    use traits::Into;
    use debug::PrintTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::constants::SCALING_FACTOR;

    #[event]
    fn GameCreated(game_id: felt252, creator: felt252) {}

    fn execute(
        start_time: u64, max_players: usize, max_turns: usize, max_locations: usize
    ) -> felt252 {
        gas::withdraw_gas().expect('out of gas');
        let player_id: felt252 = starknet::get_caller_address().into();

        let game_id = commands::uuid();
        commands::set_entity(
            game_id.into(),
            (Game {
                start_time,
                max_players,
                max_turns,
                is_finished: false,
                creator: player_id,
                max_locations
            })
        );

        commands::set_entity(
            (game_id, (player_id)).into(),
            (
                Stats {
                    health: 100_u8, respect: 0_u8, arrested: false, turns_remaining: max_turns
                    }, Cash {
                    amount: 100_u128 * SCALING_FACTOR // $100
                }
            )
        );

        GameCreated(game_id.into(), player_id);
        game_id.into()
    }
}


mod tests {
    use traits::Into;
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

    use rollyourown::tests::world_factory::WorldFactory;
    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameComponent;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::StatsComponent;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::CashComponent;
    use rollyourown::components::location::Location;
    use rollyourown::components::location::LocationComponent;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksComponent;
    use rollyourown::constants::SCALING_FACTOR;
    use super::SpawnGameSystem;
    use super::SpawnLocationSystem;
    use super::SpawnPlayerSystem;

    const START_TIME: u64 = 100_u64;
    const MAX_PLAYERS: usize = 2_usize;
    const MAX_TURNS: usize = 10_usize;
    const MAX_LOCATIONS: usize = 3_usize;
    const TRAVEL_RISK: u8 = 10_u8;
    const HURT_RISK: u8 = 9_u8;
    const KILLED_RISK: u8 = 8_u8;
    const MUGGED_RISK: u8 = 7_u8;
    const ARRESTED_RISK: u8 = 6_u8;


    fn spawn_game() -> (ContractAddress, felt252) {
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

        let mut systems = array::ArrayTrait::<ClassHash>::new();
        systems.append(SpawnGameSystem::TEST_CLASS_HASH.try_into().unwrap());
        systems.append(SpawnLocationSystem::TEST_CLASS_HASH.try_into().unwrap());
        systems.append(SpawnPlayerSystem::TEST_CLASS_HASH.try_into().unwrap());

        let world_address = WorldFactory::spawn('RyoWorld'.into(), components, systems);

        let game_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Game'.into());
        assert(
            game_hash == GameComponent::TEST_CLASS_HASH.try_into().unwrap(), 'unregistered game'
        );

        let stats_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Stats'.into());
        assert(
            stats_hash == StatsComponent::TEST_CLASS_HASH.try_into().unwrap(), 'unregistered stats'
        );

        let cash_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Cash'.into());
        assert(
            cash_hash == CashComponent::TEST_CLASS_HASH.try_into().unwrap(), 'unregistered cash'
        );

        let location_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Location'.into());
        assert(
            location_hash == LocationComponent::TEST_CLASS_HASH.try_into().unwrap(),
            'unregistred location'
        );

        let risks_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Risks'.into());
        assert(
            risks_hash == RisksComponent::TEST_CLASS_HASH.try_into().unwrap(), 'unregistred risks'
        );

        let game_hash = IWorldDispatcher {
            contract_address: world_address
        }.system('SpawnGame'.into());
        assert(
            game_hash == SpawnGameSystem::TEST_CLASS_HASH.try_into().unwrap(), 'unregistered spawn'
        );

        let location_hash = IWorldDispatcher {
            contract_address: world_address
        }.system('SpawnLocation'.into());
        assert(
            location_hash == SpawnLocationSystem::TEST_CLASS_HASH.try_into().unwrap(),
            'unregistered spawn'
        );

        let player_hash = IWorldDispatcher {
            contract_address: world_address
        }.system('SpawnPlayer'.into());
        assert(
            player_hash == SpawnPlayerSystem::TEST_CLASS_HASH.try_into().unwrap(),
            'unregistered spawn'
        );

        let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
        spawn_game_calldata.append(START_TIME.into());
        spawn_game_calldata.append(MAX_PLAYERS.into());
        spawn_game_calldata.append(MAX_TURNS.into());
        spawn_game_calldata.append(MAX_LOCATIONS.into());

        let world = IWorldDispatcher { contract_address: world_address };
        let mut res = world.execute('SpawnGame'.into(), spawn_game_calldata.span());
        assert(res.len() > 0_usize, 'did not spawn');

        let game_id = serde::Serde::<felt252>::deserialize(
            ref res
        ).expect('spawn deserialization failed');
        let mut res = world.entity(ShortStringTrait::new('Game'), game_id.into(), 0_u8, 0_usize);
        assert(res.len() > 0_usize, 'game not found');

        let game = serde::Serde::<Game>::deserialize(ref res).expect('game deserialization failed');
        assert(game.start_time == START_TIME, 'start time mismatch');
        assert(game.max_players == MAX_PLAYERS, 'max players mismatch');
        assert(game.max_turns == MAX_TURNS, 'max turns mismatch');
        assert(game.max_locations == MAX_LOCATIONS, 'max locations mismatch');
        assert(game.is_finished == false, 'game is finished mismatch');

        (world_address, game_id)
    }

    fn spawn_player(world_address: ContractAddress, game_id: felt252, player_id: felt252) -> felt252 {
        let world = IWorldDispatcher { contract_address: world_address };

        let mut spawn_player_calldata = array::ArrayTrait::<felt252>::new();
        spawn_player_calldata.append(game_id);
        spawn_player_calldata.append(player_id);

        gas::withdraw_gas().expect('out of gas');
        let mut res = world.execute('SpawnPlayer'.into(), spawn_player_calldata.span());
        assert(res.len() > 0_usize, 'did not spawn');

        let player_id = serde::Serde::<felt252>::deserialize(
            ref res
        ).expect('spawn deserialization failed');

        let mut res = IWorldDispatcher {
            contract_address: world_address
        }.entity(ShortStringTrait::new('Stats'), (game_id, (player_id)).into_partitioned(), 0_u8, 0_usize);
        assert(res.len() > 0_usize, 'player stats not found');

        let stats = serde::Serde::<Stats>::deserialize(
            ref res
        ).expect('stats deserialization failed');

        assert(stats.health == 100_u8, 'health mismatch');
        assert(stats.arrested == false, 'arrested mismatch');

        gas::withdraw_gas().expect('out of gas');
        let mut res = IWorldDispatcher {
            contract_address: world_address
        }.entity(ShortStringTrait::new('Cash'), (game_id, (player_id)).into_partitioned(), 0_u8, 0_usize);
        assert(res.len() > 0_usize, 'player cash not found');

        let cash = serde::Serde::<Cash>::deserialize(ref res).expect('cash deserialization failed');

        assert(cash.amount == 100_u128 * SCALING_FACTOR, 'cash mismatch');
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
        assert(res.len() > 0_usize, 'did not spawn');

        let location_id = serde::Serde::<felt252>::deserialize(
            ref res
        ).expect('spawn deserialization failed');
        let mut res = world.entity(
            ShortStringTrait::new('Risks'), location_id.into(), 0_u8, 0_usize
        );
        assert(res.len() > 0_usize, 'loc not found');

        let risks = serde::Serde::<Risks>::deserialize(
            ref res
        ).expect('loc deserialization failed');
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
        let (world_address, game_id) = spawn_game();
        let location_one = spawn_location(world_address, game_id);

        gas::withdraw_gas().expect('out of gas');
        let location_two = spawn_location(world_address, game_id);

        let locations = IWorldDispatcher {
            contract_address: world_address
        }.entities(ShortStringTrait::new('Location'), u250Trait::new(game_id));
        assert(locations.len() == 2_usize, 'wrong num locations');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_spawn_player() {
        let (world_address, game_id) = spawn_game();
        let player_one = spawn_player(world_address, game_id, 1);
        let player_two = spawn_player(world_address, game_id, 2);
        assert(player_one == 1, 'wrong player id');
        assert(player_two == 2, 'wrong player id');
    }
}
