use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Gangs of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'GANGS_I',
            1 => 'GANGS_II',
            2 => 'GANGS_III',
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
        'Encounters'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-hand-back-fist',
            1 => 'fa-knife-kitchen',
            2 => 'fa-gun',
            _ => 'fa-gun'
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Gangs hater',
            1 => 'Gangs terror',
            2 => 'Gangs killer',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Gangs description"
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 3,
            1 => 5,
            2 => 10,
            _ => 0,
        };
        Quest::Gangs.tasks(level, difficulty, count)
    }
}
