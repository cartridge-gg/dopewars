use box::BoxTrait;
use dojo_core::integer::u250;

#[derive(Component, Copy, Drop, Serde)]
struct Game {
    start_time: u64,
    max_players: usize,
    max_turns: usize,
    max_locations: usize,
    is_finished: bool,
    creator: u250,
}


trait GameTrait {
    fn tick(self: @Game) -> bool;
}

impl GameImpl of GameTrait {
    fn tick(self: @Game) -> bool {
        let info = starknet::get_block_info().unbox();

        if info.block_timestamp > *self.start_time {
            return false;
        }
        if *self.is_finished {
            return false;
        }

        true
    }
}
