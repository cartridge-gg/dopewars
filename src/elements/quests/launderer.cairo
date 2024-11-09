use rollyourown::elements::quests::interface::QuestTrait;

impl Launderer of QuestTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'LAUNDERER'
    }

    #[inline]
    fn description(difficulty: u8, count: u32) -> ByteArray {
        "On season end, $PAPER have to be washed..."
    }
}
