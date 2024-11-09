use rollyourown::elements::quests::interface::QuestTrait;

impl BrawlerC of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'BRAWLERC'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "Defeat a Mech"
    }
}
