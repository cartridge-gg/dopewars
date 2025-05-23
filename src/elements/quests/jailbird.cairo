use rollyourown::elements::quests::interface::QuestTrait;

impl Jailbird of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'JAILBIRD'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        match count {
            0 => "",
            1 => "Get jailed",
            _ => format!("Get jailed {} times", count),
        }
    }
}
