#[system]
mod JoinGame {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::events::{emit, PlayerJoined};
    use rollyourown::components::{game::Game, player::{Cash, Stats}, location::Location};
    use rollyourown::constants::SCALING_FACTOR;

    fn execute(ctx: Context, game_id: u32) -> felt252 {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = ctx.caller_account.into();

        let game_sk: Query = game_id.into();
        let game = get !(ctx, game_sk, Game);
        assert(!game.is_finished, 'game is finished');
        assert(game.max_players > game.num_players, 'game is full');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        // spawn player into game
        set !(
            ctx,
            (game_id, player_id).into(),
            (
                Stats {
                    health: 100, respect: 0, arrested: false, turns_remaining: game.max_turns
                    }, Cash {
                    amount: 100 * SCALING_FACTOR // $100
                    }, Location {
                    id: 0_u32
                }
            )
        );

        // update num players joined
        set !(
            ctx,
            game_sk,
            (Game {
                start_time: game.start_time,
                max_players: game.max_players,
                num_players: game.num_players + 1,
                max_turns: game.max_turns,
                is_finished: false,
                creator: game.creator,
                max_locations: game.max_locations
            })
        );

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@PlayerJoined { game_id, player_id }, ref values);
        emit(ctx, 'PlayerJoined', values.span());

        player_id
    }
}
