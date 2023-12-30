use rollyourown::models::tile::Tile;

#[derive(Model, Copy, Drop, Serde)]
struct Cop {
    #[key]
    game_id: u32,
    level: u32,
    step: u32,
    coordinate_x: u32,
    coordinate_y: u32,
}


#[generate_trait]
impl CopImpl of CopTrait {
    #[inline(always)]
    fn new(game_id: u32, level: u32, coordinate_x: u32, coordinate_y: u32) -> Cop {
        if (level == 1) {
            Cop { game_id: game_id, level: level, step: 1, coordinate_x, coordinate_y }
        } else {
            Cop { game_id: game_id, level: level, step: 2, coordinate_x, coordinate_y }
        }
    }
}
