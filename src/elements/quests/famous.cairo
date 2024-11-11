use rollyourown::elements::quests::interface::QuestTrait;

impl Famous of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'FAMOUS'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "End a game with max reputation"
    }
}
