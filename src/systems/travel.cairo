#[system]
mod Travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::player::Name;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::StatsTrait;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksTrait;

    #[event]
    fn Traveled(game_id: felt252, player_id: felt252, from_location_id: u32, to_location_id: u32) {}

    #[event]
    fn TravelEvent(game_id: felt252, player_id: felt252, event_name: felt252) {}

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(game_id: felt252, next_location_id: u32) {
        let block_info = starknet::get_block_info().unbox();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(block_info.block_timestamp), 'cannot progress');

        let player_id = starknet::get_caller_address().into();
        let (name, location, stats, cash) = commands::<Name,
        Location,
        Stats,
        Cash>::entity((game_id, (player_id)).into());

        assert(location.id != next_location_id, 'already at location');
        assert(stats.can_continue(), 'cannot continue');

        let (next_location, risks) = commands::<Location,
        Risks>::entity((game_id, (next_location_id.into())).into());
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        let (event_name, arrested, killed, money_loss, health_loss, respect_loss) = risks.travel(
            seed
        );

        let updated_health = match killed {
            bool::False(()) => stats.health - health_loss,
            bool::True(()) => 0_u8,
        };

        // update player
        commands::set_entity(
            (game_id, (player_id)).into(),
            (
                Location {
                    id: next_location_id
                    }, Cash {
                    amount: cash.amount - money_loss
                    }, Stats {
                    health: updated_health,
                    respect: stats.respect - respect_loss,
                    arrested,
                    turns_remaining: stats.turns_remaining - 1_usize,
                },
            )
        );

        if event_name != 'none' {
            TravelEvent(game_id, player_id, event_name)
        }
        Traveled(game_id, player_id, location.id, next_location_id);
        ()
    }
}
