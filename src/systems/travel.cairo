#[system]
mod Travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::player::Name;
    use rollyourown::components::location::Location;
    use rollyourown::components::location::LocationTrait;
    use rollyourown::components::location::Event;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::player::StatsTrait;

    #[event]
    fn Traveled(game_id: felt252, player_id: felt252, from_location_id: u32, to_location_id: u32) {}

    #[event]
    fn LocationEvent(game_id: felt252, player_id: felt252, event_name: felt252) {}

    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(game_id: felt252, next_location_id: u32) {
        let block_info = starknet::get_block_info().unbox();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(block_info.block_timestamp), 'cannot progress');

        let player_id = starknet::get_caller_address().into();
        let player = commands::<Name, Location, Stats, Cash>::entity((game_id, (player_id)).into());
        let (name, location, stats, cash) = player;
        
        assert(location.id != next_location_id, 'already at location');
        assert(stats.can_continue(), 'cannot continue');

        let next_location = commands::<Location>::entity((game_id, (next_location_id.into())).into());
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let event = next_location.maybe_event(seed);

        let mut money = cash.amount;
        let mut health = stats.health;
        let mut respect = stats.respect;
        let mut arrested = stats.arrested;
        let mut can_travel = true;

        match event {
            Option::Some(e) => {
                let event_name = match e {
                    Event::Hurt(x) => { 
                        health = health - x;
                        'hurt'
                    },
                    Event::Killed(_) => {
                        health = 0_u8;
                        can_travel = false;
                        'killed'
                    },
                    Event::Mugged(x) => {
                        money = money - x;
                        'mugged'
                    },
                    Event::Arrested(_) => {
                        arrested = true;
                        can_travel = false;
                        'arrested'
                    },
                };

                LocationEvent(game_id, player_id, event_name);
            },
            Option::None(()) => {},
        }

        if can_travel {
            Traveled(game_id, player_id, location.id, next_location_id);
        }
        
        // update player
        commands::set_entity((game_id, (player_id)).into(), (
            Location { id: next_location_id },
            Cash { amount: money },
            Stats { 
                health,
                respect,
                arrested,
                turns_remaining: stats.turns_remaining - 1_usize, 
            },
        ));

        ()
    }
}
