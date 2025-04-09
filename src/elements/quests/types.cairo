// External imports

use achievement::types::task::{Task, TaskTrait};

// Internal imports

use rollyourown::elements::quests;

// Constants

pub const QUEST_COUNT: u8 = 13;

#[derive(Copy, Drop)]
enum Quest {
    None,
    Hustler, // ok
    Kingpin, // ok
    Jailbird, // ok
    Stuffed, // ok
    Rip, // ok
    Cops, // ok
    Gangs, // ok
    Launderer, // ok
    Escape, // ok
    Famous, // ok
    Dealer, // ok
    BrawlerC, // ??
    BrawlerG, // ??
}

#[generate_trait]
impl QuestImpl of QuestTrait {
    #[inline]
    fn identifier(self: Quest, level: u8) -> felt252 {
        match self {
            Quest::None => 0,
            Quest::Hustler => quests::hustler::Hustler::identifier(level),
            Quest::Kingpin => quests::kingpin::Kingpin::identifier(level),
            Quest::Jailbird => quests::jailbird::Jailbird::identifier(level),
            Quest::Stuffed => quests::stuffed::Stuffed::identifier(level),
            Quest::Rip => quests::rip::Rip::identifier(level),
            Quest::Cops => quests::cops::Cops::identifier(level),
            Quest::Gangs => quests::gangs::Gangs::identifier(level),
            Quest::Launderer => quests::launderer::Launderer::identifier(level),
            Quest::Escape => quests::escape::Escape::identifier(level),
            Quest::Famous => quests::famous::Famous::identifier(level),
            Quest::Dealer => quests::dealer::Dealer::identifier(level),
            Quest::BrawlerC => quests::brawlerC::BrawlerC::identifier(level),
            Quest::BrawlerG => quests::brawlerG::BrawlerG::identifier(level),
        }
    }

    #[inline]
    fn description(self: Quest, difficulty: u8, count: u32) -> ByteArray {
        match self {
            Quest::None => "",
            Quest::Hustler => quests::hustler::Hustler::description(difficulty, count),
            Quest::Kingpin => quests::kingpin::Kingpin::description(difficulty, count),
            Quest::Jailbird => quests::jailbird::Jailbird::description(difficulty, count),
            Quest::Stuffed => quests::stuffed::Stuffed::description(difficulty, count),
            Quest::Rip => quests::rip::Rip::description(difficulty, count),
            Quest::Cops => quests::cops::Cops::description(difficulty, count),
            Quest::Gangs => quests::gangs::Gangs::description(difficulty, count),
            Quest::Launderer => quests::launderer::Launderer::description(difficulty, count),
            Quest::Escape => quests::escape::Escape::description(difficulty, count),
            Quest::Famous => quests::famous::Famous::description(difficulty, count),
            Quest::Dealer => quests::dealer::Dealer::description(difficulty, count),
            Quest::BrawlerC => quests::brawlerC::BrawlerC::description(difficulty, count),
            Quest::BrawlerG => quests::brawlerG::BrawlerG::description(difficulty, count),
        }
    }

    #[inline]
    fn tasks(self: Quest, level: u8, difficulty: u8, count: u32) -> Span<Task> {
        let task_id: felt252 = self.identifier(level);
        let description: ByteArray = self.description(difficulty, count);
        array![TaskTrait::new(task_id, count, description)].span()
    }
}

impl IntoQuestU8 of core::Into<Quest, u8> {
    #[inline]
    fn into(self: Quest) -> u8 {
        match self {
            Quest::None => 0,
            Quest::Hustler => 1,
            Quest::Kingpin => 2,
            Quest::Jailbird => 3,
            Quest::Stuffed => 4,
            Quest::Rip => 5,
            Quest::Cops => 6,
            Quest::Gangs => 7,
            Quest::Launderer => 8,
            Quest::Escape => 9,
            Quest::Famous => 10,
            Quest::Dealer => 11,
            Quest::BrawlerC => 12,
            Quest::BrawlerG => 13,
        }
    }
}

impl IntoU8Quest of core::Into<u8, Quest> {
    #[inline]
    fn into(self: u8) -> Quest {
        let card: felt252 = self.into();
        match card {
            0 => Quest::None,
            1 => Quest::Hustler,
            2 => Quest::Kingpin,
            3 => Quest::Jailbird,
            4 => Quest::Stuffed,
            5 => Quest::Rip,
            6 => Quest::Cops,
            7 => Quest::Gangs,
            8 => Quest::Launderer,
            9 => Quest::Escape,
            10 => Quest::Famous,
            11 => Quest::Dealer,
            12 => Quest::BrawlerC,
            13 => Quest::BrawlerG,
            _ => Quest::None,
        }
    }
}
