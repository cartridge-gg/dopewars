use box::BoxTrait;
use traits::Into;
use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    game_id: u32,
    start_time: u64,
    max_players: usize,
    num_players: usize,
    max_turns: usize,
    is_finished: bool,
    creator: ContractAddress,
}


trait GameTrait {
    fn tick(self: @Game) -> bool;
}

impl GameImpl of GameTrait {
    fn tick(self: @Game) -> bool {
        let info = starknet::get_block_info().unbox();

        if info.block_timestamp < *self.start_time {
            return false;
        }
        if *self.is_finished {
            return false;
        }

        true
    }
}
