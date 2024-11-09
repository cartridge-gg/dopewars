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
            1 => 50,
            2 => 75,
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
        'BLOCK AMBITION'
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
            0 => 'Slinger',
            1 => 'Hustler',
            2 => 'OG',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "It's not about becoming someone. It's about becoming someone they can't ignore"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 5,
            1 => 20,
            2 => 50,
            _ => 0,
        };
        Quest::Hustler.tasks(level, difficulty, count)
    }
}
