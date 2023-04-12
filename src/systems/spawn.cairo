#[system]
mod SpawnPlayer {
    use traits::Into;  
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::constants::SCALING_FACTOR;
    
    #[event]
    fn PlayerJoined(game_id: felt252, player_id: felt252) {}

    fn execute(game_id: felt252, name: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');

        let players = commands::<(Game, Player)>::entities();
        assert(game.max_players > players.len(), 'max players');

        commands::set_entity((game_id, (player_id)).into(), (
            Name { name: name },
            Stats { 
                health: 100_u8, 
                respect: 0_u8,
                arrested: false,
                turns_remaining: game.max_turns 
            },
            Cash { amount: 100_u128 * SCALING_FACTOR } // $100
        ));

        PlayerJoined(game_id, player_id);
        ()
    }
}


#[system]
mod SpawnGame {
    use array::ArrayTrait;
    use traits::Into;  

    use rollyourown::components::game::Game;

    #[event]
    fn GameCreated(game_id: felt252) {}

    fn execute(start_time: u64, max_players: usize, max_turns: usize) {
        let game_id = commands::uuid(); 
        commands::set_entity(game_id.into(), (
            Game {
                start_time,
                max_players,
                max_turns,
                is_finished: false,
            }
        ));

        GameCreated(game_id);
        ()
    }
}