mod random;
mod settings;
mod market;
mod risk;
mod shop;
mod math;
mod events;
mod leaderboard;
use rollyourown::models::player_minigame::PlayerMiniGame;
use rollyourown::models::direction::Direction;

fn next_position_player(mut player: PlayerMiniGame, direction: Direction) -> PlayerMiniGame {
    match direction {
        Direction::None(()) => { return player; },
        Direction::Left(()) => { player.x -= 1; },
        Direction::Right(()) => { player.x += 1; },
        Direction::Up(()) => { player.y -= 1; },
        Direction::Down(()) => { player.y += 1; },
    };

    player
}
