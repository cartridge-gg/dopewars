use rollyourown::elements::quests::interface::QuestTrait;

impl Kingpin of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'KINGPIN'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "Win a season of Dopewars"
    }
}
