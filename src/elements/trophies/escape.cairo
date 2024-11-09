use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Escape of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'ESCAPE_I',
            1 => 'ESCAPE_II',
            2 => 'ESCAPE_III',
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
            0 => 10,
            1 => 25,
            2 => 50,
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
        'Escape'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-person-running-fast',
            1 => 'fa-motorcycle',
            2 => 'fa-snake',
            _ => 'fa-snake',
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Quickstep',
            1 => 'Shadow',
            2 => 'Eel',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "It's not outrunning them, it's outsmarting them."
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 3,
            1 => 10,
            2 => 50,
            _ => 0,
        };
        Quest::Escape.tasks(level, difficulty, count)
    }
}
