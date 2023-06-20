#[system]
mod CreateLocation {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use debug::PrintTrait;

    use rollyourown::components::risks::Risks;
    use rollyourown::components::game::Game;
    use rollyourown::components::location::Location;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::Drug;
    use rollyourown::constants::SCALING_FACTOR;

    const MAX_PRODUCTS: u32 = 6;

    #[event]
    fn LocationCreated(game_id: u32, location_id: u32) {}

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
        let player_id: felt252 = ctx.caller_account.into();

        let game_sk: Query = game_id.into();
        let game = commands::<Game>::entity(game_sk);
        assert(game.creator == player_id, 'only creator');
        assert(game.start_time >= block_info.block_timestamp, 'already started');

        let location_id = commands::uuid();
        commands::set_entity(
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
            commands::set_entity((game_id, location_id, i).into(), (Market { cash, quantity }));
            i += 1;
        }

        LocationCreated(game_id, location_id);
        location_id
    }
}


#[system]
mod CreateGame {
    use array::ArrayTrait;
    use traits::Into;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::location::Location;
    use rollyourown::constants::SCALING_FACTOR;

    #[event]
    fn GameCreated(
        game_id: u32,
        creator: felt252,
        start_time: u64,
        max_turns: usize,
        max_players: usize,
        max_locations: usize
    ) {}

    fn execute(
        ctx: Context, start_time: u64, max_players: usize, max_turns: usize, max_locations: usize
    ) -> (u32, felt252) {
        let player_id: felt252 = ctx.caller_account.into();

        let game_id = commands::uuid();
        commands::set_entity(
            game_id.into(),
            (Game {
                start_time,
                max_players,
                num_players: 1, // caller auto joins
                max_turns,
                is_finished: false,
                creator: player_id,
                max_locations
            })
        );

        commands::set_entity(
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

        GameCreated(game_id, player_id, start_time, max_players, max_turns, max_locations);
        (game_id, player_id)
    }
}
