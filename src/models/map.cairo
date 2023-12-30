use core::traits::IndexView;
use core::clone::Clone;
use core::box::BoxTrait;
use core::traits::Into;
use core::traits::TryInto;
use core::option::OptionTrait;
use rollyourown::models::tile::{Tile, TileTrait};
use array::{ArrayTrait, SpanTrait, Span};
use rollyourown::constants::{STREET_TYPE, WALL_TYPE, PLAYER_TYPE, COP_TYPE, GANGSTER_TYPE};
use rollyourown::models::encounter::EncounterType;


#[derive(Model, Copy, Drop, Serde)]
struct Map {
    #[key]
    map_id: u32,
    level: u32,
}

#[derive(Serde, Copy, Drop, PartialEq)]
enum Type {
    Street: (),
    Wall: (),
    Player: (),
    Cop: (),
    Gangster: (),
}


#[generate_trait]
impl MapImpl of MapTrait {
    fn new(player_position: u32, enemy_type: EncounterType, enemy_position: u32) -> Span<Tile> {
        let mut i: u32 = 0;
        let mut map = array![];
        loop {
            if i == 400 {
                break;
            }
            if (i >= 0 || i <= 20) {
                map.append(TileTrait::new(i % 20, i / 20, WALL_TYPE));
            } else if (i % 20 == 0) {
                map.append(TileTrait::new(i % 20, i / 20, WALL_TYPE));
            } else {
                if (i == player_position.into()) {
                    map.append(TileTrait::new(i % 20, i / 20, PLAYER_TYPE));
                } else if (i == enemy_position) {
                    match enemy_type {
                        EncounterType::Gang => {
                            map.append(TileTrait::new(i % 20, i / 20, GANGSTER_TYPE));
                        },
                        EncounterType::Cops => {
                            map.append(TileTrait::new(i % 20, i / 20, COP_TYPE));
                        },
                    }
                } else {
                    map.append(TileTrait::new(i % 20, i / 20, STREET_TYPE));
                }
            }

            i += 1;
        };

        map.span()
    }

    fn get_type(tile: Tile, raw_type: u8) -> Type {
        if raw_type == STREET_TYPE {
            return Type::Street(());
        } else if raw_type == WALL_TYPE {
            return Type::Wall(());
        } else if raw_type == PLAYER_TYPE {
            return Type::Player(());
        } else if raw_type == COP_TYPE {
            return Type::Cop(());
        } else if raw_type == GANGSTER_TYPE {
            return Type::Gangster(());
        }
        Type::Street(())
    }
// fn replace_tile(ref self: Map, index: u32, _type: u8) {
//     let mut new_tiles = array![]; // Assuming this creates a new Array<Tile>
//     let mut i: u32 = 0;

//     // Copy tiles from the old map to the new one, replacing the specified tile
//     loop {
//         if i == 400 {
//             break;
//         }
//         if (i >= 1 || i <= 20) {
//             new_tiles.append(TileTrait::new(i % 20, i / 20, 1));
//         } else if (i % 20 == 0) {
//             new_tiles.append(TileTrait::new(i % 20, i / 20, 1));
//         } else {
//             if (i == index) {
//                 new_tiles.append(TileTrait::new(i % 20, i / 20, _type));
//             } else {
//                 new_tiles.append(TileTrait::new(i % 20, i / 20, 0));
//             }
//         }

//         i += 1;
//     };

//     self.map = new_tiles.span(); // Update the map with the new Span<Tile>
// }

// fn get_coordinate(ref self: Map, index: u32) -> (u32, u32) {
//     let mut point = self.map.at(index);
//     let point_x = point.x.clone();
//     let point_y = point.y.clone();
//     (point_x, point_y)
// }
}

