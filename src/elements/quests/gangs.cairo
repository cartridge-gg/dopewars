use rollyourown::elements::quests::interface::QuestTrait;

impl Gangs of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'GANGS'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        format!("Defeat {} gangs", count)
    }
}
