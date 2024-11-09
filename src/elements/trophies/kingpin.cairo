use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Kingpin of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
       'KINGPIN'
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
        100
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
        'Domination'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-crown'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
       'Kingpin'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "There can be only one"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        Quest::Kingpin.tasks(level, 0, 1)
    }
}