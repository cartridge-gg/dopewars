trait QuestTrait {
    fn identifier(level: u8) -> felt252;
    fn description(difficulty: u8, count: u32) -> ByteArray;
}
