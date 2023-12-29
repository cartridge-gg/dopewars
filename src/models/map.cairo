use core::clone::Clone;
use core::box::BoxTrait;
use core::traits::Into;
use core::traits::TryInto;
use core::option::OptionTrait;
use rollyourown::models::tile::{Tile, TileTrait};
use array::{ArrayTrait, SpanTrait, Span};

struct Map {
    map: Span<Tile>,
}

trait MapTrait {
    fn new() -> Map;
    fn get_coordinate(ref self: Map, index: u32) -> (u32, u32);
}

impl MapImpl of MapTrait {
    fn new() -> Map {
        let mut i: u32 = 0;
        let mut map = array![];
        loop {
            if i == 400 {
                break;
            }
            if (i >= 1 || i <= 20) {
                map.append(TileTrait::new(i % 20, i / 20, 1));
            } else if (i % 20 == 0) {
                map.append(TileTrait::new(i % 20, i / 20, 1));
            } else {
                map.append(TileTrait::new(i % 20, i / 20, 0));
            }

            i += 1;
        };

        Map { map: map.span() }
    }

    fn get_coordinate(ref self: Map, index: u32) -> (u32, u32) {
        let mut point = self.map.at(index);
        let point_x = point.x.clone();
        let point_y = point.y.clone();
        (point_x, point_y)
    }
}
