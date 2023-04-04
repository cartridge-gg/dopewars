#[system]
mod SpawnPlayer {
    use traits::Into;  
    use array::ArrayTrait;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameLibraryDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;
    
    use rollyourown::components::player::Name;
    use rollyourown::components::player::INameLibraryDispatcher;
    use rollyourown::components::player::INameDispatcherTrait;

    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::IInventoryLibraryDispatcher;
    use rollyourown::components::player::IInventoryDispatcherTrait;

    use rollyourown::components::player::Stats;
    use rollyourown::components::player::IStatsLibraryDispatcher;
    use rollyourown::components::player::IStatsDispatcherTrait;

    use rollyourown::components::player::Cash;
    use rollyourown::components::player::ICashLibraryDispatcher;
    use rollyourown::components::player::ICashDispatcherTrait;

    use rollyourown::components::location::Location;
    use rollyourown::components::location::ILocationLibraryDispatcher;
    use rollyourown::components::location::ILocationDispatcherTrait;

    fn execute(game_id: felt252, name: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        let player_game_id = commands::set((game_id, (player_id)).into(), (
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
    use rollyourown::components::game::IGameLibraryDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;

    fn execute(start_time: usize, max_players: usize, max_turns: usize) {
        let game_id = commands::uuid(); 
        let _ = commands::set(game_id.into(), (
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

        recurse_locs(ref locations, locations.len());
    }

    fn recurse_locs(
        ref locs: Array::<felt252>, 
        len: usize, ) {

        if len == 0_usize {
            ()
        }

        let location_id = locs.pop_front();

        // FIX: commands:: error 
        // let _ = commands::set((game_id, (location_id)).into(), (
        //     Location { id: location_id }
        // ));
        // 
        // let _ = commnads::set((game_id, (location_id, drug_id)). into(), (
        //     Market { 
        //          cash: 100000000000000000000.into(),
        //          quantity: 100000000000000000000.into(),
        //     }
        // ));

        recurse_locs(ref locs, len - 1_usize);
    }

}