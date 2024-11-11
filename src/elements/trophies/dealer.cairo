use rollyourown::elements::trophies::interface::{TrophyTrait, Task, Quest, QuestTrait};

impl Dealer of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'DEALER_I',
            1 => 'DEALER_II',
            2 => 'DEALER_III',
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
            1 => 30,
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
        'Dealer'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-tablets',
            1 => 'fa-capsules',
            2 => 'fa-bong',
            _ => 'fa-bong'
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Operator',
            1 => 'Broker',
            2 => 'Cartel',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Only drug dealers and software companies call their customers 'users'"
        // "My family tree consists of drug dealers, thugs, and killers."
    }

    #[inline]
    fn tasks(level: u8) -> Span<Task> {
        let difficulty: u8 = 0;
        let count: u32 = match level {
            0 => 100,
            1 => 200,
            2 => 500,
            _ => 0,
        };
        Quest::Dealer.tasks(level, difficulty, count)
    }
}
