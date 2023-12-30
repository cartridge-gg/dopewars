use rollyourown::models::tile::Tile;

#[derive(Model, Copy, Drop, Serde)]
struct Gangster {
    #[key]
    game_id: u32,
    level: u32,
    step: u32,
    coordinate_x: u32,
    coordinate_y: u32,
}


#[generate_trait]
impl GangsterImpl of GangsterTrait {
    #[inline(always)]
    fn new(game_id: u32, level: u32, coordinate_x: u32, coordinate_y: u32) -> Gangster {
        if (level == 1) {
            Gangster { game_id: game_id, level: level, step: 2, coordinate_x, coordinate_y }
        } else if (level == 2) {
            Gangster { game_id: game_id, level: level, step: 3, coordinate_x, coordinate_y }
        } else if (level == 3) {
            Gangster { game_id: game_id, level: level, step: 4, coordinate_x, coordinate_y }
        } else {
            Gangster { game_id: game_id, level: level, step: 5, coordinate_x, coordinate_y }
        }
    }
}
