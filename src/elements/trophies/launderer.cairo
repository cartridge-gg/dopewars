use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Launderer of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'LAUNDERER'
    }

    #[inline]
    fn hidden(level: u8) -> bool {
       true
    }

    #[inline]
    fn index(level: u8) -> u8 {
        level
    }

    #[inline]
    fn points(level: u8) -> u16 {
        50
    }

    #[inline]
    fn start() -> u64 {
        0
    }

    #[inline]
    fn end() -> u64 {
        0
    }

    #[inline]
    fn group() -> felt252 {
        'Launderer'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-washing-machine'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'The Cleaner'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Mixing the dirt with the dough"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Launderer.tasks(level, 0, 1)
    }
}
