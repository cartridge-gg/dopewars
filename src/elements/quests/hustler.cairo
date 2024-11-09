use rollyourown::elements::quests::interface::QuestTrait;

impl Hustler of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'HUSTLER'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        match count {
            0 => "",
            1 => "Play 1 ranked game",
            _ => format!("Play {} ranked games", count),
        }
    }
}