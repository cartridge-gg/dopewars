#[system]
mod join_game {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use dojo::world::Context;

    use rollyourown::events::{emit, PlayerJoined};
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::{Location, LocationId};
    use rollyourown::constants::SCALING_FACTOR;

    fn execute(ctx: Context, game_id: u32) -> felt252 {
        let block_info = starknet::get_block_info().unbox();
        let player_id: felt252 = ctx.origin.into();

        let game_sk: Query = game_id.into();
        let game = get !(ctx.world, game_sk, Game);
        assert(!game.is_finished, 'game is finished');
        assert(game.max_players > game.num_players, 'game is full');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        // spawn player into game
        set !(
            ctx.world,
            (game_id, player_id).into(),
            (
                Player {
                    name: 0, // set at end of game
                    cash: 100 * SCALING_FACTOR, // $100
                    health: 100,
                    arrested: false,
                    turns_remaining: game.max_turns
                },
                Location {
                    id: LocationId::None(()).into()
                }
            )
        );

        // update num players joined
        set !(
            ctx.world,
            game_sk,
            (Game {
                game_id,
                start_time: game.start_time,
                max_players: game.max_players,
                num_players: game.num_players + 1,
                max_turns: game.max_turns,
                is_finished: false,
                creator: game.creator,
            })
        );

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@PlayerJoined { game_id, player_id }, ref values);
        emit(ctx, 'PlayerJoined', values.span());

        player_id
    }
}
