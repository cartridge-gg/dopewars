#[system]
mod Travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::{game::{Game, GameTrait}, location::Location};
    use rollyourown::components::player::{Cash, Stats, StatsTrait};
    use rollyourown::components::risks::{Risks, RisksTrait, TravelResult};

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
    fn execute(game_id: felt252, next_location_id: felt252) -> bool {
        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(), 'game cannot progress');

        let player_id: felt252 = starknet::get_caller_address().into();
        let player_sk: Query = (game_id, (player_id)).into_partitioned();
        let location_sk: Query = (game_id, (next_location_id)).into_partitioned();

        let (location, stats, cash) = commands::<(Location, Stats, Cash)>::entity(player_sk);
        assert(stats.can_continue(), 'player cannot continue');
        assert(location.id != next_location_id, 'already at location');

        let (next_location, risks) = commands::<(Location, Risks)>::entity(location_sk);
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        let (event_occured, result) = risks.travel(seed);
        let updated_health = match result.killed {
            bool::False(()) => stats.health - result.health_loss,
            bool::True(()) => 0,
        };

        // update player
        commands::set_entity(
            player_sk,
            (
                Location {
                    id: next_location_id
                    }, Cash {
                    amount: cash.amount - result.money_loss
                    }, Stats {
                    health: updated_health,
                    respect: stats.respect - result.respect_loss,
                    arrested: result.arrested,
                    turns_remaining: stats.turns_remaining - 1,
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
        event_occured
    }
}
