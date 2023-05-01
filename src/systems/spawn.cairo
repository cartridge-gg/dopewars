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

    fn execute(game_id: felt252) {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');
        assert(game.start_time < block_info.block_timestamp, 'already started');

        let players = commands::<(Game, Player)>::entities();
        assert(game.max_players > players.len(), 'max players');

        commands::set_entity(
            (game_id, (player_id)).into(),
            (
                Stats {
                    health: 100_u8, respect: 0_u8, arrested: false, turns_remaining: game.max_turns
                    }, Cash {
                    amount: 100_u128 * SCALING_FACTOR // $100
                }
            )
        );

        PlayerJoined(game_id, player_id);
    }
}

#[system]
mod SpawnLocation {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

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
    ) {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.creator == player_id, 'only creator');
        assert(game.start_time < block_info.block_timestamp, 'already started');

        let locations = commands::<(Game, Location)>::entities();
        assert(locations.len() < game.max_locations, 'max locations');

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

    fn execute(start_time: u64, max_players: usize, max_turns: usize, max_locations: usize) -> felt252 {
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
    use core::traits::Into;
    use core::result::ResultTrait;
    use array::ArrayTrait;
    use array::SpanTrait;
    use option::OptionTrait;
    use traits::TryInto;
    use box::BoxTrait;
    use debug::PrintTrait;

    use starknet::syscalls::deploy_syscall;
    use starknet::class_hash::ClassHash;
    use starknet::class_hash::Felt252TryIntoClassHash;
    use dojo_core::interfaces::IWorldDispatcher;
    use dojo_core::interfaces::IWorldDispatcherTrait;
    use dojo_core::string::ShortStringTrait;
    use dojo_core::integer::u250Trait;

    use rollyourown::tests::executor::Executor;
    use rollyourown::tests::world_factory::WorldFactory;
    use rollyourown::tests::world::World;
    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameComponent;
    use rollyourown::components::player::StatsComponent;
    use rollyourown::components::player::CashComponent;
    use super::SpawnGameSystem;

    #[test]
    #[available_gas(30000000)]
    fn test_spawn_game () {
        let constructor_calldata = array::ArrayTrait::<felt252>::new();
        let (executor_address, _) = deploy_syscall(
            Executor::TEST_CLASS_HASH.try_into().unwrap(), 0, constructor_calldata.span(), false
        ).unwrap();

        WorldFactory::constructor(World::TEST_CLASS_HASH.try_into().unwrap(), executor_address);

        let mut components = array::ArrayTrait::<ClassHash>::new();
        components.append(GameComponent::TEST_CLASS_HASH.try_into().unwrap());
        components.append(StatsComponent::TEST_CLASS_HASH.try_into().unwrap());
        components.append(CashComponent::TEST_CLASS_HASH.try_into().unwrap());

        let mut systems = array::ArrayTrait::<ClassHash>::new();
        systems.append(SpawnGameSystem::TEST_CLASS_HASH.try_into().unwrap());

        let world_address = WorldFactory::spawn('RyoWorld'.into(), components, systems);

        let game_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Game'.into());
        assert(game_hash == GameComponent::TEST_CLASS_HASH.try_into().unwrap(), 'game not registered');

        let stats_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Stats'.into());
        assert(stats_hash == StatsComponent::TEST_CLASS_HASH.try_into().unwrap(), 'stats not registered');

        let cash_hash = IWorldDispatcher {
            contract_address: world_address
        }.component('Cash'.into());
        assert(cash_hash == CashComponent::TEST_CLASS_HASH.try_into().unwrap(), 'cash not registered');

        let spawn_hash = IWorldDispatcher {
            contract_address: world_address
        }.system('SpawnGame'.into());
        assert(spawn_hash == SpawnGameSystem::TEST_CLASS_HASH.try_into().unwrap(), 'spawn not registered');

        let mut spawn_game_calldata = array::ArrayTrait::<felt252>::new();
        spawn_game_calldata.append(100_u64.into());     
        spawn_game_calldata.append(2_usize.into());     
        spawn_game_calldata.append(10_usize.into());    
        spawn_game_calldata.append(3_usize.into()); 

        let world = IWorldDispatcher { contract_address: world_address };
        let mut res = world.execute('SpawnGame'.into(), spawn_game_calldata.span());
        assert(res.len() > 0_usize, 'did not spawn');

        let game_id = serde::Serde::<felt252>::deserialize( ref res ).expect('spawn deserialization failed');
        let mut res = world.entity(ShortStringTrait::new('Game'), game_id.into(), 0_u8, 0_usize);
        assert(res.len() > 0_usize, 'game not found');

        gas::withdraw_gas().expect('not enough gas'); 

        let game = serde::Serde::<Game>::deserialize( ref res ).expect('game deserialization failed');
        // For some reason using variable for these casues a "unknown ap change" error
        assert(game.start_time == 100_u64, 'start time mismatch');
        assert(game.max_players == 2_usize, 'max players mismatch');
        assert(game.max_turns == 10_usize, 'max turns mismatch');
        assert(game.max_locations == 3_usize, 'max locations mismatch');
        assert(game.is_finished == false, 'game is finished mismatch');
    }
}