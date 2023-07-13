#[system]
mod travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use dojo::world::Context;

    use rollyourown::events::{emit, Traveled, RandomEvent};
    use rollyourown::components::{game::{Game, GameTrait}, location::Location};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::risks::{Risks, RisksTrait, TravelResult};

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(ctx: Context, game_id: u32, next_location_name: felt252) -> bool {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'game cannot progress');

        let player_id: felt252 = ctx.origin.into();
        let player_sk: Query = (game_id, player_id).into();
        let location_sk: Query = (game_id, next_location_name).into();

        let (location, player) = get !(ctx.world, player_sk, (Location, Player));
        assert(player.can_continue(), 'player cannot continue');
        assert(location.name != next_location_name, 'already at location');

        let (next_location, risks) = get !(ctx.world, location_sk, (Location, Risks));
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        let (event_occured, result) = risks.travel(seed);
        if event_occured {
            let mut values = array::ArrayTrait::new();
            serde::Serde::serialize(
                @RandomEvent {
                    game_id,
                    player_id,
                    health_loss: result.health_loss,
                    mugged: result.mugged,
                    arrested: result.arrested,
                },
                ref values
            );
            emit(ctx, 'RandomEvent', values.span());
        }

        // If arrested, player loses a turn and stays at same location
        if result.arrested {
            set !(
                ctx.world,
                player_sk,
                (Player {
                    cash: player.cash,
                    health: player.health,
                    turns_remaining: player.turns_remaining - 1,
                })
            );

            return (true);
        }

        // If mugged, player loses half their cash
        let updated_cash = if result.mugged {
            player.cash / 2
        } else {
            player.cash
        };

        // update player
        set !(
            ctx.world,
            player_sk,
            (
                Location {
                    name: next_location_name
                    }, Player {
                    cash: updated_cash,
                    health: player.health,
                    turns_remaining: player.turns_remaining - 1,
                }
            )
        );

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @Traveled {
                game_id, player_id, from_location: location.name, to_location: next_location_name
            },
            ref values
        );
        emit(ctx, 'Traveled', values.span());

        event_occured
    }
}
