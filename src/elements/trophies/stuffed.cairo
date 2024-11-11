use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Stuffed of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'STUFFED'
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
        80
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
        'Fully Loaded'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-user-ninja'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Fully Loaded'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "If they bring a knife to the fight, we bring a gun"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Stuffed.tasks(level, 0, 1)
    }
}
