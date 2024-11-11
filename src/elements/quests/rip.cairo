use rollyourown::elements::quests::interface::QuestTrait;

impl Rip of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'RIP'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "Die"
    }
}
