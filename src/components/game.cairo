use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde)]
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

#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn tick(self: Game) -> bool {
        let info = starknet::get_block_info().unbox();

        if info.block_timestamp < self.start_time {
            return false;
        }
        if self.is_finished {
            return false;
        }

        true
    }
}
