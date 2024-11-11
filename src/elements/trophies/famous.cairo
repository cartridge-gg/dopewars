use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Famous of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'FAMOUS'
    }

    #[inline]
    fn hidden(level: u8) -> bool {
        false
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
        'Notorious'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-joint'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Notorious'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "The game is the game. Always."
        // "It takes many good deals to build a good reputation, and only one bad one to lose it."
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Famous.tasks(level, 0, 1)
    }
}
