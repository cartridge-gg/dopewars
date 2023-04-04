#[derive(Component)]
struct Game {
    start_time: usize,
    max_players: usize,
    max_turns: usize,
    is_finished: bool,
}

