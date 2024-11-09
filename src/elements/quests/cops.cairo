use rollyourown::elements::quests::interface::QuestTrait;

impl Cops of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'COPS'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        format!("Defeat {} cops", count)
    }
}
