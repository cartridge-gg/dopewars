use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Stuffed of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'STUFFED'
    }

    #[inline]
    fn hidden(level: u8) -> bool {
        false
        // true
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
        'Stuffed'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-user-ninja'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Stuffed'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Need all of them"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Stuffed.tasks(level, 0, 1)
    }
}
