#[system]
mod join_game {
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::{Location, LocationTrait};
    use rollyourown::constants::{STARTING_CASH, STARTING_HEALTH, STARTING_BAG_LIMIT};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PlayerJoined: PlayerJoined
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        game_id: u32,
        player_id: ContractAddress
    }

    fn execute(ctx: Context, game_id: u32) -> ContractAddress {
        let player_id = ctx.origin;
        let block_info = starknet::get_block_info().unbox();

        let mut game = get!(ctx.world, game_id, (Game));
        assert(!game.is_finished, 'game is finished');
        assert(game.max_players > game.num_players, 'game is full');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        game.num_players += 1;

        let player = Player {
            game_id,
            player_id,
            status: PlayerStatus::Normal,
            location_id: 0,
            cash: STARTING_CASH,
            health: STARTING_HEALTH,
            run_attempts: 0,
            drug_count: 0,
            bag_limit: STARTING_BAG_LIMIT,
            turns_remaining: game.max_turns,
            turns_remaining_on_death: 0
        };

        set!(ctx.world, (game, player));
        emit!(ctx.world, PlayerJoined { game_id, player_id });

        player_id
    }
}
