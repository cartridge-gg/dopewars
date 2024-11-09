use rollyourown::elements::quests::interface::QuestTrait;

impl Escape of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'ESCAPE'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        format!("Escape Cops or Gangs {} times", count)
    }
}
