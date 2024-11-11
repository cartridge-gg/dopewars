use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Cops of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'COPS_I',
            1 => 'COPS_II',
            2 => 'COPS_III',
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
        'Encounters'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-user-police',
            1 => 'fa-siren',
            2 => 'fa-helicopter',
            _ => 'fa-helicopter'
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Patrol Buster',
            1 => 'Precinct Nightmare',
            2 => 'Five-O Reaper',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "When the streets talk back, the law listens"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 10,
            1 => 100,
            2 => 500,
            _ => 0,
        };
        Quest::Cops.tasks(level, difficulty, count)
    }
}
