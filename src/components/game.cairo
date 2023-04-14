#[derive(Component)]
struct Game {
    start_time: u64,
    max_players: usize,
    max_turns: usize,
    max_locations: usize,
    is_finished: bool,
    creator: felt252,
}


trait GameTrait {
    fn tick(self: Game, current_time: u64) -> bool;
}

impl GameImpl of GameTrait {
    fn tick(self: Game, current_time: u64) -> bool {
        if current_time < self.start_time {
            return false;
        }
        if self.is_finished {
            return false;
        }

        true
    }
}
