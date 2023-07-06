#[system]
mod travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use dojo::world::Context;

    use rollyourown::events::{emit, Traveled, RandomEvent};
    use rollyourown::components::{game::{Game, GameTrait}, location::Location};
    use rollyourown::components::player::{Cash, Stats, StatsTrait};
    use rollyourown::components::risks::{Risks, RisksTrait, TravelResult};

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(ctx: Context, game_id: u32, next_location_id: u8) -> bool {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'game cannot progress');

        let player_id: felt252 = ctx.origin.into();
        let player_sk: Query = (game_id, player_id).into();
        let location_sk: Query = (game_id, next_location_id).into();

        let (location, stats, cash) = get !(ctx.world, player_sk, (Location, Stats, Cash));
        assert(stats.can_continue(), 'player cannot continue');
        assert(location.id != next_location_id, 'already at location');

        let (next_location, risks) = get !(ctx.world, location_sk, (Location, Risks));
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        let (event_occured, result) = risks.travel(seed);
        let updated_health = if result.health_loss < stats.health {
            stats.health - result.health_loss
        } else {
            0
        };

        // update player
        set !(
            ctx.world,
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
            let mut values = array::ArrayTrait::new();
            serde::Serde::serialize(
                @RandomEvent {
                    game_id,
                    player_id,
                    health_loss: result.health_loss,
                    money_loss: result.money_loss,
                    respect_loss: result.respect_loss,
                    arrested: result.arrested,
                },
                ref values
            );
            emit(ctx, 'RandomEvent', values.span());
        }

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @Traveled {
                game_id, player_id, from_location_id: location.id, to_location_id: next_location_id
            },
            ref values
        );
        emit(ctx, 'Traveled', values.span());

        event_occured
    }
}
