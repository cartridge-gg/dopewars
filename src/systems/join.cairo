#[system]
mod join_game {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::events::PlayerJoined;
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::{Location, LocationTrait};
    use rollyourown::constants::{SCALING_FACTOR, STARTING_CASH};

    fn execute(ctx: Context, game_id: u32) -> ContractAddress {
        let block_info = starknet::get_block_info().unbox();

        let game = get!(ctx.world, game_id, (Game));
        assert(!game.is_finished, 'game is finished');
        assert(game.max_players > game.num_players, 'game is full');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let location_id = LocationTrait::random(seed);
        // spawn player into game
        set!(
            ctx.world,
            (Player {
                game_id,
                player_id: ctx.origin,
                location_id,
                cash: STARTING_CASH,
                health: 100,
                turns_remaining: game.max_turns
            })
        );

        // update num players joined
        set!(
            ctx.world,
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

        // emit player joined
        emit!(ctx.world, PlayerJoined { game_id, player_id: ctx.origin, location_id });

        ctx.origin
    }
}
