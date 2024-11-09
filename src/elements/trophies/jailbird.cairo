use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Jailbird of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'JAILBIRD_I',
            1 => 'JAILBIRD_II',
            2 => 'JAILBIRD_III',
            _ => '',
        }
    }

    #[inline]
    fn hidden(level: u8) -> bool {
        false
        // true
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
        'Jailbird'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level{
            0 => 'fa-hands-bound',
            1 => 'fa-handcuffs',
            2 => 'fa-dungeon',
            _ =>  'fa-dungeon',
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Outlaw',
            1 => 'Criminal',
            2 => 'Jailbird',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Every true hustler knows that you cannot hustle forever. You will go to jail eventually."
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 1,
            1 => 2,
            2 => 3,
            _ => 0,
        };
        Quest::Jailbird.tasks(level, difficulty, count)
    }
}
