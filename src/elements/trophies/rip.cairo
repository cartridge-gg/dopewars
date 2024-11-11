use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Rip of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'RIP'
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
        10
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
        'Rip'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-skull-crossbones'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Flatliner'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "We all got a number, and it's not the one you dial"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Rip.tasks(level, 0, 1)
    }
}
