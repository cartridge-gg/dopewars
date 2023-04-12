#[system]
mod SpawnPlayer {
    use traits::Into;  
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::location::Location;
    use rollyourown::constants::SCALING_FACTOR;

    fn execute(game_id: felt252, name: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');

        commands::set_entity((game_id, (player_id)).into(), (
            Name { name: name },
            Location { id: 0_u32 },
            Stats { 
                health: 100_u8, 
                respect: 0_u8,
                turns_remaining: game.max_turns 
            },
            Cash { amount: 100_u128 * SCALING_FACTOR } // $100
        ));

        ()
    }
}


#[system]
mod SpawnGame {
    use array::ArrayTrait;
    use traits::Into;  

    use rollyourown::components::game::Game;

    fn execute(start_time: usize, max_players: usize, max_turns: usize) {
        let game_id = commands::uuid(); 
        commands::set_entity(game_id.into(), (
            Game {
                start_time,
                max_players,
                max_turns,
                is_finished: false,
            }
        ));

        ()
    }

}