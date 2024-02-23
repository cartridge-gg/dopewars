use rollyourown::{traits::{Enumerable, Packable},};

#[derive(Copy, Drop, Serde, PartialEq)]
enum PlayerLayout {
    Cash,
    Health,
    Turn,
    Status,
    PrevLocation,
    Location,
    NextLocation,
    DrugLevel
}

impl PlayerLayoutIntoBytes31Impl of Into<PlayerLayout, bytes31> {
    fn into(self: PlayerLayout) -> bytes31 {
        let value = match self {
            PlayerLayout::Cash => 'Cash',
            PlayerLayout::Health => 'Health',
            PlayerLayout::Turn => 'Turn',
            PlayerLayout::Status => 'Status',
            PlayerLayout::PrevLocation => 'PrevLocation',
            PlayerLayout::Location => 'Location',
            PlayerLayout::NextLocation => 'NextLocation',
            PlayerLayout::DrugLevel => 'DrugLevel',
        };
        value.try_into().unwrap()
    }
}


// Enumerable

impl PlayerLayoutEnumerableImpl of Enumerable<PlayerLayout> {
    fn all() -> Span<PlayerLayout> {
        let items = array![
            PlayerLayout::Cash,
            PlayerLayout::Health,
            PlayerLayout::Turn,
            PlayerLayout::Status,
            PlayerLayout::PrevLocation,
            PlayerLayout::Location,
            PlayerLayout::NextLocation,
            PlayerLayout::DrugLevel,
        ];
        items.span()
    }
}

// Packable

impl PlayerLayoutPackableImpl of Packable<PlayerLayout> {
    fn bits(self: @PlayerLayout) -> u8 {
        match *self {
            PlayerLayout::Cash => 29,
            PlayerLayout::Health => 7,
            PlayerLayout::Turn => 6,
            PlayerLayout::Status => 2,
            PlayerLayout::PrevLocation => 3,
            PlayerLayout::Location => 3,
            PlayerLayout::NextLocation => 3,
            PlayerLayout::DrugLevel => 2,
        }
    }

    fn idx(self: @PlayerLayout) -> u8 {
        let mut layout = PlayerLayoutEnumerableImpl::all();
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
