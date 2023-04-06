#[system]
mod SpawnPlayer {
    use traits::Into;  
    use array::ArrayTrait;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::Cash;
    use rollyourown::components::location::Location;

    fn execute(game_id: felt252, name: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        commands::set_entity((game_id, (player_id)).into(), (
            Name { name: name },
            Location { id: 0 },
            Stats { health: 100_usize },
            Inventory { weapon: 69_usize, shoes: 1337_usize },
            Cash { amount: 100_u128 } // $100
        ));

        return ();
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

        let mut locations = ArrayTrait::<felt252>::new();
        locations.append('location_1');
        locations.append('location_2');
        locations.append('location_3');
        locations.append('location_4');
        locations.append('location_5');

        // recurse_locs(ref locations, locations.len());
    }

    // fn recurse_locs(
    //     ref locs: Array::<felt252>, 
    //     len: usize, ) {

        // match gas::withdraw_gas() {
        //     Option::Some(_) => {},
        //     Option::None(_) => {
        //         let mut data = ArrayTrait::new();
        //         data.append('Out of gas');
        //         panic(data);
        //     },
        // }

    //     if len == 0_usize {
    //         ()
    //     }

    //     let location_id = locs.pop_front();

    //     // FIX: commands:: error 
    //     // commands::set_entity((game_id, (location_id)).into(), (
    //     //     Location { id: location_id }
    //     // ));
    //     // 
    //     // commands::set_entity((game_id, (location_id, drug_id)). into(), (
    //     //     Market { 
    //     //          cash: 100000000000000000000.into(),
    //     //          quantity: 100000000000000000000.into(),
    //     //     }
    //     // ));

    //     recurse_locs(ref locs, len - 1_usize);
    // }

}