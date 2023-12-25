const STREET_TYPE: u8 = 0;
const WALL_TYPE: u8 = 1;
const PLAYER_TYPE: u8 = 2;
const COP_TYPE: u8 = 3;
const GANGSTER_TYPE: u8 = 4;


#[derive(Model, Copy, Drop, Serde)]
struct Tile {
    #[key]
    game_id: u32,
    #[key]
    index: u32,
    _type: u8,
    x: u32,
    y: u32
}

trait TileTrait {
    fn new(x: u32, y: u32, _type: u8) -> Tile;
    fn is_street(self: Tile) -> bool;
    fn is_wall(self: Tile) -> bool;
    fn is_player(self: Tile) -> bool;
    fn is_cop(self: Tile) -> bool;
    fn is_gangster(self: Tile) -> bool;
    fn is_zero(self: Tile) -> bool;
    fn is_equal(self: Tile, b: Tile) -> bool;
    fn is_close(self: Tile, b: Tile) -> bool;
    fn distance(self: Tile, b: Tile) -> u32;
}

impl TileImpl of TileTrait {
    fn new(x: u32, y: u32, _type: u8) -> Tile {
        Tile { game_id: 0, index: 0, x: x, y: y, _type: _type }
    }

    fn is_street(self: Tile) -> bool {
        self._type == STREET_TYPE
    }

    fn is_wall(self: Tile) -> bool {
        self._type == WALL_TYPE
    }

    fn is_player(self: Tile) -> bool {
        self._type == PLAYER_TYPE
    }

    fn is_cop(self: Tile) -> bool {
        self._type == COP_TYPE
    }

    fn is_gangster(self: Tile) -> bool {
        self._type == GANGSTER_TYPE
    }

    fn is_zero(self: Tile) -> bool {
        self.x == 0 && self.y == 0
    }

    fn is_equal(self: Tile, b: Tile) -> bool {
        self.x == b.x && self.y == b.y
    }

    fn is_close(self: Tile, b: Tile) -> bool {
        self.distance(b) <= 1
    }

    fn distance(self: Tile, b: Tile) -> u32 {
        let mut dx = 0;
        if self.x > b.x {
            dx = self.x - b.x;
        } else {
            dx = b.x - self.x;
        };

        let mut dy = 0;
        if self.y > b.y {
            dy = self.y - b.y;
        } else {
            dy = b.y - self.y;
        };
        dx * dx + dy * dy
    }
}
