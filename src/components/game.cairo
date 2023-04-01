#[derive(Component)]
struct Game {
    start_time: u64,
    max_players: u32,
    max_turns: u32,
    is_finished: bool,
}

