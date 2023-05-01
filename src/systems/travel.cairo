#[system]
mod Travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::StatsTrait;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksTrait;
    use rollyourown::components::risks::TravelResult;

    #[event]
    fn Traveled(
        game_id: felt252, player_id: felt252, from_location_id: felt252, to_location_id: felt252
    ) {}

    #[event]
    fn RandomEvent(
        game_id: felt252,
        player_id: felt252,
        health_loss: u8,
        money_loss: u128,
        respect_loss: u8,
        arrested: bool,
        killed: bool
    ) {}

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(game_id: felt252, next_location_id: felt252) {
        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(), 'cannot progress');

        let player_id = starknet::get_caller_address().into();
        let (location, stats, cash) = commands::<Location,
        Stats,
        Cash>::entity((game_id, (player_id)).into());

        assert(location.id != next_location_id, 'already at location');
        assert(stats.can_continue(), 'cannot continue');

        let (next_location, risks) = commands::<Location,
        Risks>::entity((game_id, (next_location_id)).into());
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        let (event_occured, result) = risks.travel(seed);
        let updated_health = match result.killed {
            bool::False(()) => stats.health - result.health_loss,
            bool::True(()) => 0_u8,
        };

        // update player
        commands::set_entity(
            (game_id, (player_id)).into(),
            (
                Location {
                    id: next_location_id
                    }, Cash {
                    amount: cash.amount - result.money_loss
                    }, Stats {
                    health: updated_health,
                    respect: stats.respect - result.respect_loss,
                    arrested: result.arrested,
                    turns_remaining: stats.turns_remaining - 1_usize,
                },
            )
        );

        if event_occured {
            RandomEvent(
                game_id,
                player_id,
                result.health_loss,
                result.money_loss,
                result.respect_loss,
                result.arrested,
                result.killed
            );
        }

        Traveled(game_id, player_id, location.id, next_location_id);
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

    use starknet::ContractAddress;
    use starknet::syscalls::deploy_syscall;
    use starknet::class_hash::ClassHash;
    use starknet::class_hash::Felt252TryIntoClassHash;
    use dojo_core::interfaces::IWorldDispatcher;
    use dojo_core::interfaces::IWorldDispatcherTrait;
    use dojo_core::string::ShortStringTrait;
    use dojo_core::integer::u250Trait;
    use dojo_core::executor::Executor;
    use dojo_core::world::World;
    
    use rollyourown::systems::spawn::tests::spawn_game;
    use rollyourown::systems::spawn::tests::spawn_location;
    use rollyourown::systems::spawn::tests::spawn_player;

    #[test]
    #[available_gas(30000000)]
    fn test_travel () {
        let (world_address, game_id) = spawn_game();
        let player_one = spawn_player(world_address, game_id, 1);
        let location = spawn_location(world_address, game_id);
    }
}