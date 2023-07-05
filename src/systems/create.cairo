#[system]
mod create_location {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use debug::PrintTrait;

    use dojo::world::Context;

    use rollyourown::events::{emit, LocationCreated};
    use rollyourown::components::risks::Risks;
    use rollyourown::components::game::Game;
    use rollyourown::components::location::Location;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::Drug;
    use rollyourown::constants::SCALING_FACTOR;

    const MAX_PRODUCTS: u32 = 6;

    fn execute(
        ctx: Context,
        game_id: u32,
        travel_risk: u8,
        hurt_risk: u8,
        killed_risk: u8,
        mugged_risk: u8,
        arrested_risk: u8
    ) -> u32 {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = ctx.origin.into();

        let game_sk: Query = game_id.into();
        let game = get !(ctx.world, game_sk, Game);
        assert(game.creator == player_id, 'only creator');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        let location_id = ctx.world.uuid();
        set !(
            ctx.world,
            (game_id, location_id).into(),
            (
                Location {
                    id: location_id
                    }, Risks {
                    travel: travel_risk,
                    hurt: hurt_risk,
                    killed: killed_risk,
                    mugged: mugged_risk,
                    arrested: arrested_risk,
                }
            )
        );

        let mut i: u32 = 0;
        loop {
            if i >= MAX_PRODUCTS {
                break ();
            }
            let quantity = 1000;
            let cash = 100 * SCALING_FACTOR;
            set !(ctx.world, (game_id, location_id, i).into(), (Market { cash, quantity }));
            i += 1;
        }

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@LocationCreated { game_id, location_id }, ref values);
        emit(ctx, 'LocationCreated', values.span());

        location_id
    }
}


#[system]
mod create_game {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;

    use rollyourown::events::{emit, GameCreated};
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::location::Location;
    use rollyourown::constants::SCALING_FACTOR;

    fn execute(
        ctx: Context, start_time: u64, max_players: usize, max_turns: usize
    ) -> (u32, felt252) {
        let player_id: felt252 = ctx.origin.into();

        let game_id = ctx.world.uuid();
        set !(
            ctx.world,
            game_id.into(),
            (Game {
                game_id,
                start_time,
                max_players,
                num_players: 1, // caller auto joins
                max_turns,
                is_finished: false,
                creator: player_id,
            })
        );

        set !(
            ctx.world,
            (game_id, player_id).into(),
            (
                Stats {
                    health: 100, respect: 0, arrested: false, turns_remaining: max_turns
                    }, Cash {
                    amount: 100 * SCALING_FACTOR // $100
                    }, Location {
                    id: 0_u32
                }
            )
        );

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @GameCreated {
                game_id, creator: player_id, start_time, max_players, max_turns
            },
            ref values
        );
        emit(ctx, 'GameCreated', values.span());

        (game_id, player_id)
    }
}
