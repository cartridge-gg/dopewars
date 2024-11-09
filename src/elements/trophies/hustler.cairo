use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Hustler of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'HUSTLER_I',
            1 => 'HUSTLER_II',
            2 => 'HUSTLER_III',
            _ => '',
        }
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
        match level {
            0 => 20,
            1 => 60,
            2 => 100,
            _ => 0,
        }
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
        'Hustler'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-head-side-mask',
            1 => 'fa-user-hoodie',
            2 => 'fa-luchador-mask',
            _ => 'fa-luchador-mask'
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Hustler',
            1 => 'Streetboss',
            2 => 'OG',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Every day im hustlin'"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 1,
            1 => 3,
            2 => 5,
            _ => 0,
        };
        Quest::Hustler.tasks(level, difficulty, count)
    }
}
