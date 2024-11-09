use rollyourown::elements::quests::interface::QuestTrait;

impl Dealer of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'DEALER'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
       format!("Make {} deals worth over a million", count)
    }
}