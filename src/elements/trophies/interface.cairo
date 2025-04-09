use achievement::types::task::Task;
use rollyourown::elements::quests::types::{Quest, QuestTrait};

trait TrophyTrait {
    fn identifier(level: u8) -> felt252;
    fn hidden(level: u8) -> bool;
    fn index(level: u8) -> u8;
    fn points(level: u8) -> u16;
    fn start() -> u64;
    fn end() -> u64;
    fn group() -> felt252;
    fn icon(level: u8) -> felt252;
    fn title(level: u8) -> felt252;
    fn description(level: u8) -> ByteArray;
    fn tasks(level: u8) -> Span<Task>;
}
