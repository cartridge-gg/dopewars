use rollyourown::{
    traits::{Enumerable, Packable},
};

#[derive(Copy, Drop, Serde, PartialEq)]
enum GameStoreLayout {
    Markets,
    Items,
    Drugs,
    Wanted,
    Encounters,
    Player,
}

impl GameStoreLayoutIntoBytes31Impl of Into<GameStoreLayout, bytes31> {
    fn into(self: GameStoreLayout) -> bytes31 {
        let value = match self {
            GameStoreLayout::Markets => 'Markets',
            GameStoreLayout::Items => 'Items',
            GameStoreLayout::Drugs => 'Drugs',
            GameStoreLayout::Wanted => 'Wanted',
            GameStoreLayout::Encounters => 'Encounters',
            GameStoreLayout::Player => 'Player',
        };
        value.try_into().unwrap()
    }
}


// Enumerable

impl GameStoreLayoutEnumerableImpl of Enumerable<GameStoreLayout> {
    fn all() -> Span<GameStoreLayout> {
        let items = array![
            GameStoreLayout::Markets,
            GameStoreLayout::Items,
            GameStoreLayout::Drugs,
            GameStoreLayout::Wanted,
            GameStoreLayout::Encounters,
            GameStoreLayout::Player,
        ];
        items.span()
    }
}

// Packable

impl GameStoreLayoutPackableImpl of Packable<GameStoreLayout> {
    fn bits(self: @GameStoreLayout) -> u8 {
        match *self {
            GameStoreLayout::Markets => 144,
            GameStoreLayout::Items => 8,
            GameStoreLayout::Drugs => 16,
            GameStoreLayout::Wanted => 18,
            GameStoreLayout::Encounters => 6,
            GameStoreLayout::Player => 55,
        }
    }

    fn idx(self: @GameStoreLayout) -> u8 {
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let mut idx = 0_u8;

        loop {
            match layout.pop_front() {
                Option::Some(i) => { if self == i {
                    break;
                } else {
                    idx += i.bits()
                } },
                Option::None => { break; }
            }
        };
        idx
    }
}


#[cfg(test)]
mod tests {
    use super::{GameStoreLayout, GameStoreLayoutPackableImpl};

    #[test]
    #[available_gas(100000000)]
    fn test_layout_idx() {
        assert(GameStoreLayout::Markets.idx() == 0, 'bad markets idx');
        assert(GameStoreLayout::Items.idx() == 144, 'bad items idx');
    }

    #[test]
    #[available_gas(100000000)]
    fn test_layout_size() {
        assert(GameStoreLayout::Markets.idx() == 144, 'bad markets size');
        assert(GameStoreLayout::Items.idx() == 8, 'bad items size');
    }
}
