use core::traits::TryInto;
use core::option::OptionTrait;
use array::{ArrayTrait, SpanTrait, Span};

struct Map {
    horizontal: Span<u32>, //20
    vertical: Span<u32>, //20
}

trait MapTrait {
    fn new() -> Map;
    fn get_horizontal(self: Map) -> Span<u32>;
    fn get_horizontal_index(self: Map, index: u32) -> u32;
    fn get_vertical(self: Map) -> Span<u32>;
    fn get_vertical_index(self: Map, index: u32) -> u32;
}

impl MapImpl of MapTrait {
    fn new() -> Map {
        Map {
            horizontal: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].span(),
            vertical: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].span(),
        }
    }

    fn get_horizontal(self: Map) -> Span<u32> {
        self.horizontal
    }

    fn get_horizontal_index(self: Map, index: u32) -> u32 {
        *self.horizontal.at(index)
    }

    fn get_vertical(self: Map) -> Span<u32> {
        self.vertical
    }

    fn get_vertical_index(self: Map, index: u32) -> u32 {
        *self.vertical.at(index)
    }
}

#[cfg(test)]
mod map_test {
    use core::array::SpanTrait;
    use super::{Map, MapTrait};
    #[test]
    #[available_gas(1000000)]
    fn test_create_map_horizontal() {
        let map = Map {
            horizontal: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].span(),
            vertical: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,].span(),
        };
        assert(map.get_horizontal().len() == 20, 'Horizontal length is not 20');
    }

    #[test]
    #[available_gas(1000000)]
    fn test_create_map_vertical() {
        let map = Map {
            horizontal: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].span(),
            vertical: array![0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,].span(),
        };
        assert(map.get_vertical().len() == 20, 'Vertical length is not 20');
    }
}
