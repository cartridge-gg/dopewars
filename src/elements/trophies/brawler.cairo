use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Brawler of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'BRAWLER'
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
        'Brawler'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-person-rifle'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Brawler'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "I am what I am. A fighter."
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let mut arr: Array<Task> = array![];
        arr.append_span(Quest::BrawlerC.tasks(level, 0, 1));
        arr.append_span(Quest::BrawlerG.tasks(level, 0, 1));
        arr.span()
    }
}
