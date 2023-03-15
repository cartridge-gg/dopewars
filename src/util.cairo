fn namespace_id_for_game(player_id: u32, game_id: u32) -> u64 {
    player_id * 2 ** 32 + game_id
}
