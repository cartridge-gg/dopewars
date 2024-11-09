use rollyourown::elements::quests::interface::QuestTrait;

impl Stuffed of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'STUFFED'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "Max out equipment"
    }
}
