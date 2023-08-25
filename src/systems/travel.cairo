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
    fn execute(ctx: Context, game_id: u32, next_location_id: felt252) -> bool {
        let game = get!(ctx.world, game_id, Game);
        assert(game.tick(), 'game cannot progress');

        let player_id = ctx.origin;
        let mut player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.can_continue(), 'player cannot continue');
        assert(player.location_id != next_location_id, 'already at location');

        let risks = get!(ctx.world, (game_id, next_location_id).into(), Risks);
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
            player.turns_remaining - 1;
            set!(ctx.world, (player));
            return (true);
        }

        // If mugged, player loses half their cash
        if result.mugged {
            player.cash /= 2;
        }

        // update player
        player.location_id = next_location_id;
        set!(ctx.world, (player));

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @Traveled {
                game_id, player_id, from_location: player.location_id, to_location: next_location_id
            },
            ref values
        );
        emit(ctx, 'Traveled', values.span());

        event_occured
    }
}
