use rollyourown::elements::quests::interface::QuestTrait;

impl BrawlerG of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'BRAWLERG'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "Defeat a Big Boss"
    }
}
