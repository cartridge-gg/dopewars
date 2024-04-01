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
    DrugLevel,
    Reputation,
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
            PlayerLayout::Reputation => 'Reputation',
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
            PlayerLayout::Reputation,
        ];
        items.span()
    }
}

// Packable

impl PlayerLayoutPackableImpl of Packable<PlayerLayout> {
    fn bits(self: @PlayerLayout) -> u8 {
        match *self {
            PlayerLayout::Cash => 30, // max 1,073,741,824
            PlayerLayout::Health => 7,
            PlayerLayout::Turn => 6, // max 64
            PlayerLayout::Status => 2,
            PlayerLayout::PrevLocation => 3,
            PlayerLayout::Location => 3,
            PlayerLayout::NextLocation => 3,
            PlayerLayout::DrugLevel => 3,
            PlayerLayout::Reputation => 7,
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
