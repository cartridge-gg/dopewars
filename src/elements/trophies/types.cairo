use achievement::types::task::Task;
use rollyourown::elements::trophies;

#[cfg(test)]
mod tests {
    use super::{Trophy, TrophyTrait, TrophyImpl, TROPHY_COUNT};

    #[test]
    fn list_and_sum() {
        let mut trophy_id: u8 = TROPHY_COUNT;
        let mut total: u32 = 0;
        while trophy_id > 0 {
            let trophy: Trophy = trophy_id.into();

            let mut id: ByteArray = "";
            id.append_word(trophy.identifier(), 12);
            let mut group: ByteArray = "";
            group.append_word(trophy.group(), 15);

            println!("{} - {} - {}", id, group, trophy.points());

            trophy_id -= 1;
            total += trophy.points().into();
        };
        println!("total {} points", total);
    }
}


// Constants

pub const TROPHY_COUNT: u8 = 24;

#[derive(Copy, Drop)]
enum Trophy {
    None,
    HustlerI,
    HustlerII,
    HustlerIII,
    Kingpin,
    JailbirdI,
    JailbirdII,
    JailbirdIII,
    Stuffed,
    Rip,
    CopsI,
    CopsII,
    CopsIII,
    GangsI,
    GangsII,
    GangsIII,
    Launderer,
    EscapeI,
    EscapeII,
    EscapeIII,
    Famous,
    DealerI,
    DealerII,
    DealerIII,
    Brawler,
}

#[generate_trait]
impl TrophyImpl of TrophyTrait {
    #[inline]
    fn identifier(self: Trophy) -> felt252 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::identifier(0),
            Trophy::HustlerII => trophies::hustler::Hustler::identifier(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::identifier(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::identifier(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::identifier(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::identifier(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::identifier(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::identifier(0),
            Trophy::Rip => trophies::rip::Rip::identifier(0),
            Trophy::CopsI => trophies::cops::Cops::identifier(0),
            Trophy::CopsII => trophies::cops::Cops::identifier(1),
            Trophy::CopsIII => trophies::cops::Cops::identifier(2),
            Trophy::GangsI => trophies::gangs::Gangs::identifier(0),
            Trophy::GangsII => trophies::gangs::Gangs::identifier(1),
            Trophy::GangsIII => trophies::gangs::Gangs::identifier(2),
            Trophy::Launderer => trophies::launderer::Launderer::identifier(0),
            Trophy::EscapeI => trophies::escape::Escape::identifier(0),
            Trophy::EscapeII => trophies::escape::Escape::identifier(1),
            Trophy::EscapeIII => trophies::escape::Escape::identifier(2),
            Trophy::Famous => trophies::famous::Famous::identifier(0),
            Trophy::DealerI => trophies::dealer::Dealer::identifier(0),
            Trophy::DealerII => trophies::dealer::Dealer::identifier(1),
            Trophy::DealerIII => trophies::dealer::Dealer::identifier(2),
            Trophy::Brawler => trophies::brawler::Brawler::identifier(0),
        }
    }

    #[inline]
    fn hidden(self: Trophy) -> bool {
        match self {
            Trophy::None => true,
            Trophy::HustlerI => trophies::hustler::Hustler::hidden(0),
            Trophy::HustlerII => trophies::hustler::Hustler::hidden(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::hidden(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::hidden(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::hidden(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::hidden(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::hidden(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::hidden(0),
            Trophy::Rip => trophies::rip::Rip::hidden(0),
            Trophy::CopsI => trophies::cops::Cops::hidden(0),
            Trophy::CopsII => trophies::cops::Cops::hidden(1),
            Trophy::CopsIII => trophies::cops::Cops::hidden(2),
            Trophy::GangsI => trophies::gangs::Gangs::hidden(0),
            Trophy::GangsII => trophies::gangs::Gangs::hidden(1),
            Trophy::GangsIII => trophies::gangs::Gangs::hidden(2),
            Trophy::Launderer => trophies::launderer::Launderer::hidden(0),
            Trophy::EscapeI => trophies::escape::Escape::hidden(0),
            Trophy::EscapeII => trophies::escape::Escape::hidden(1),
            Trophy::EscapeIII => trophies::escape::Escape::hidden(2),
            Trophy::Famous => trophies::famous::Famous::hidden(0),
            Trophy::DealerI => trophies::dealer::Dealer::hidden(0),
            Trophy::DealerII => trophies::dealer::Dealer::hidden(1),
            Trophy::DealerIII => trophies::dealer::Dealer::hidden(2),
            Trophy::Brawler => trophies::brawler::Brawler::hidden(0),
        }
    }

    #[inline]
    fn index(self: Trophy) -> u8 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::index(0),
            Trophy::HustlerII => trophies::hustler::Hustler::index(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::index(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::index(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::index(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::index(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::index(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::index(0),
            Trophy::Rip => trophies::rip::Rip::index(0),
            Trophy::CopsI => trophies::cops::Cops::index(0),
            Trophy::CopsII => trophies::cops::Cops::index(1),
            Trophy::CopsIII => trophies::cops::Cops::index(2),
            Trophy::GangsI => trophies::gangs::Gangs::index(0),
            Trophy::GangsII => trophies::gangs::Gangs::index(1),
            Trophy::GangsIII => trophies::gangs::Gangs::index(2),
            Trophy::Launderer => trophies::launderer::Launderer::index(0),
            Trophy::EscapeI => trophies::escape::Escape::index(0),
            Trophy::EscapeII => trophies::escape::Escape::index(1),
            Trophy::EscapeIII => trophies::escape::Escape::index(2),
            Trophy::Famous => trophies::famous::Famous::index(0),
            Trophy::DealerI => trophies::dealer::Dealer::index(0),
            Trophy::DealerII => trophies::dealer::Dealer::index(1),
            Trophy::DealerIII => trophies::dealer::Dealer::index(2),
            Trophy::Brawler => trophies::brawler::Brawler::index(0),
        }
    }

    #[inline]
    fn points(self: Trophy) -> u16 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::points(0),
            Trophy::HustlerII => trophies::hustler::Hustler::points(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::points(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::points(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::points(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::points(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::points(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::points(0),
            Trophy::Rip => trophies::rip::Rip::points(0),
            Trophy::CopsI => trophies::cops::Cops::points(0),
            Trophy::CopsII => trophies::cops::Cops::points(1),
            Trophy::CopsIII => trophies::cops::Cops::points(2),
            Trophy::GangsI => trophies::gangs::Gangs::points(0),
            Trophy::GangsII => trophies::gangs::Gangs::points(1),
            Trophy::GangsIII => trophies::gangs::Gangs::points(2),
            Trophy::Launderer => trophies::launderer::Launderer::points(0),
            Trophy::EscapeI => trophies::escape::Escape::points(0),
            Trophy::EscapeII => trophies::escape::Escape::points(1),
            Trophy::EscapeIII => trophies::escape::Escape::points(2),
            Trophy::Famous => trophies::famous::Famous::points(0),
            Trophy::DealerI => trophies::dealer::Dealer::points(0),
            Trophy::DealerII => trophies::dealer::Dealer::points(1),
            Trophy::DealerIII => trophies::dealer::Dealer::points(2),
            Trophy::Brawler => trophies::brawler::Brawler::points(0),
        }
    }

    #[inline]
    fn start(self: Trophy) -> u64 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::start(),
            Trophy::HustlerII => trophies::hustler::Hustler::start(),
            Trophy::HustlerIII => trophies::hustler::Hustler::start(),
            Trophy::Kingpin => trophies::kingpin::Kingpin::start(),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::start(),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::start(),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::start(),
            Trophy::Stuffed => trophies::stuffed::Stuffed::start(),
            Trophy::Rip => trophies::rip::Rip::start(),
            Trophy::CopsI => trophies::cops::Cops::start(),
            Trophy::CopsII => trophies::cops::Cops::start(),
            Trophy::CopsIII => trophies::cops::Cops::start(),
            Trophy::GangsI => trophies::gangs::Gangs::start(),
            Trophy::GangsII => trophies::gangs::Gangs::start(),
            Trophy::GangsIII => trophies::gangs::Gangs::start(),
            Trophy::Launderer => trophies::launderer::Launderer::start(),
            Trophy::EscapeI => trophies::escape::Escape::start(),
            Trophy::EscapeII => trophies::escape::Escape::start(),
            Trophy::EscapeIII => trophies::escape::Escape::start(),
            Trophy::Famous => trophies::famous::Famous::start(),
            Trophy::DealerI => trophies::dealer::Dealer::start(),
            Trophy::DealerII => trophies::dealer::Dealer::start(),
            Trophy::DealerIII => trophies::dealer::Dealer::start(),
            Trophy::Brawler => trophies::brawler::Brawler::start(),
        }
    }

    #[inline]
    fn end(self: Trophy) -> u64 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::end(),
            Trophy::HustlerII => trophies::hustler::Hustler::end(),
            Trophy::HustlerIII => trophies::hustler::Hustler::end(),
            Trophy::Kingpin => trophies::kingpin::Kingpin::end(),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::end(),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::end(),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::end(),
            Trophy::Stuffed => trophies::stuffed::Stuffed::end(),
            Trophy::Rip => trophies::rip::Rip::end(),
            Trophy::CopsI => trophies::cops::Cops::end(),
            Trophy::CopsII => trophies::cops::Cops::end(),
            Trophy::CopsIII => trophies::cops::Cops::end(),
            Trophy::GangsI => trophies::gangs::Gangs::end(),
            Trophy::GangsII => trophies::gangs::Gangs::end(),
            Trophy::GangsIII => trophies::gangs::Gangs::end(),
            Trophy::Launderer => trophies::launderer::Launderer::end(),
            Trophy::EscapeI => trophies::escape::Escape::end(),
            Trophy::EscapeII => trophies::escape::Escape::end(),
            Trophy::EscapeIII => trophies::escape::Escape::end(),
            Trophy::Famous => trophies::famous::Famous::end(),
            Trophy::DealerI => trophies::dealer::Dealer::end(),
            Trophy::DealerII => trophies::dealer::Dealer::end(),
            Trophy::DealerIII => trophies::dealer::Dealer::end(),
            Trophy::Brawler => trophies::brawler::Brawler::end(),
        }
    }

    #[inline]
    fn group(self: Trophy) -> felt252 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::group(),
            Trophy::HustlerII => trophies::hustler::Hustler::group(),
            Trophy::HustlerIII => trophies::hustler::Hustler::group(),
            Trophy::Kingpin => trophies::kingpin::Kingpin::group(),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::group(),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::group(),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::group(),
            Trophy::Stuffed => trophies::stuffed::Stuffed::group(),
            Trophy::Rip => trophies::rip::Rip::group(),
            Trophy::CopsI => trophies::cops::Cops::group(),
            Trophy::CopsII => trophies::cops::Cops::group(),
            Trophy::CopsIII => trophies::cops::Cops::group(),
            Trophy::GangsI => trophies::gangs::Gangs::group(),
            Trophy::GangsII => trophies::gangs::Gangs::group(),
            Trophy::GangsIII => trophies::gangs::Gangs::group(),
            Trophy::Launderer => trophies::launderer::Launderer::group(),
            Trophy::EscapeI => trophies::escape::Escape::group(),
            Trophy::EscapeII => trophies::escape::Escape::group(),
            Trophy::EscapeIII => trophies::escape::Escape::group(),
            Trophy::Famous => trophies::famous::Famous::group(),
            Trophy::DealerI => trophies::dealer::Dealer::group(),
            Trophy::DealerII => trophies::dealer::Dealer::group(),
            Trophy::DealerIII => trophies::dealer::Dealer::group(),
            Trophy::Brawler => trophies::brawler::Brawler::group(),
        }
    }

    #[inline]
    fn icon(self: Trophy) -> felt252 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::icon(0),
            Trophy::HustlerII => trophies::hustler::Hustler::icon(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::icon(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::icon(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::icon(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::icon(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::icon(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::icon(0),
            Trophy::Rip => trophies::rip::Rip::icon(0),
            Trophy::CopsI => trophies::cops::Cops::icon(0),
            Trophy::CopsII => trophies::cops::Cops::icon(1),
            Trophy::CopsIII => trophies::cops::Cops::icon(2),
            Trophy::GangsI => trophies::gangs::Gangs::icon(0),
            Trophy::GangsII => trophies::gangs::Gangs::icon(1),
            Trophy::GangsIII => trophies::gangs::Gangs::icon(2),
            Trophy::Launderer => trophies::launderer::Launderer::icon(0),
            Trophy::EscapeI => trophies::escape::Escape::icon(0),
            Trophy::EscapeII => trophies::escape::Escape::icon(1),
            Trophy::EscapeIII => trophies::escape::Escape::icon(2),
            Trophy::Famous => trophies::famous::Famous::icon(0),
            Trophy::DealerI => trophies::dealer::Dealer::icon(0),
            Trophy::DealerII => trophies::dealer::Dealer::icon(1),
            Trophy::DealerIII => trophies::dealer::Dealer::icon(2),
            Trophy::Brawler => trophies::brawler::Brawler::icon(0),
        }
    }

    #[inline]
    fn title(self: Trophy) -> felt252 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => trophies::hustler::Hustler::title(0),
            Trophy::HustlerII => trophies::hustler::Hustler::title(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::title(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::title(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::title(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::title(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::title(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::title(0),
            Trophy::Rip => trophies::rip::Rip::title(0),
            Trophy::CopsI => trophies::cops::Cops::title(0),
            Trophy::CopsII => trophies::cops::Cops::title(1),
            Trophy::CopsIII => trophies::cops::Cops::title(2),
            Trophy::GangsI => trophies::gangs::Gangs::title(0),
            Trophy::GangsII => trophies::gangs::Gangs::title(1),
            Trophy::GangsIII => trophies::gangs::Gangs::title(2),
            Trophy::Launderer => trophies::launderer::Launderer::title(0),
            Trophy::EscapeI => trophies::escape::Escape::title(0),
            Trophy::EscapeII => trophies::escape::Escape::title(1),
            Trophy::EscapeIII => trophies::escape::Escape::title(2),
            Trophy::Famous => trophies::famous::Famous::title(0),
            Trophy::DealerI => trophies::dealer::Dealer::title(0),
            Trophy::DealerII => trophies::dealer::Dealer::title(1),
            Trophy::DealerIII => trophies::dealer::Dealer::title(2),
            Trophy::Brawler => trophies::brawler::Brawler::title(0),
        }
    }


    #[inline]
    fn description(self: Trophy) -> ByteArray {
        match self {
            Trophy::None => "",
            Trophy::HustlerI => trophies::hustler::Hustler::description(0),
            Trophy::HustlerII => trophies::hustler::Hustler::description(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::description(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::description(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::description(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::description(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::description(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::description(0),
            Trophy::Rip => trophies::rip::Rip::description(0),
            Trophy::CopsI => trophies::cops::Cops::description(0),
            Trophy::CopsII => trophies::cops::Cops::description(1),
            Trophy::CopsIII => trophies::cops::Cops::description(2),
            Trophy::GangsI => trophies::gangs::Gangs::description(0),
            Trophy::GangsII => trophies::gangs::Gangs::description(1),
            Trophy::GangsIII => trophies::gangs::Gangs::description(2),
            Trophy::Launderer => trophies::launderer::Launderer::description(0),
            Trophy::EscapeI => trophies::escape::Escape::description(0),
            Trophy::EscapeII => trophies::escape::Escape::description(1),
            Trophy::EscapeIII => trophies::escape::Escape::description(2),
            Trophy::Famous => trophies::famous::Famous::description(0),
            Trophy::DealerI => trophies::dealer::Dealer::description(0),
            Trophy::DealerII => trophies::dealer::Dealer::description(1),
            Trophy::DealerIII => trophies::dealer::Dealer::description(2),
            Trophy::Brawler => trophies::brawler::Brawler::description(0),
        }
    }

    #[inline]
    fn tasks(self: Trophy) -> Span<Task> {
        match self {
            Trophy::None => [].span(),
            Trophy::HustlerI => trophies::hustler::Hustler::tasks(0),
            Trophy::HustlerII => trophies::hustler::Hustler::tasks(1),
            Trophy::HustlerIII => trophies::hustler::Hustler::tasks(2),
            Trophy::Kingpin => trophies::kingpin::Kingpin::tasks(0),
            Trophy::JailbirdI => trophies::jailbird::Jailbird::tasks(0),
            Trophy::JailbirdII => trophies::jailbird::Jailbird::tasks(1),
            Trophy::JailbirdIII => trophies::jailbird::Jailbird::tasks(2),
            Trophy::Stuffed => trophies::stuffed::Stuffed::tasks(0),
            Trophy::Rip => trophies::rip::Rip::tasks(0),
            Trophy::CopsI => trophies::cops::Cops::tasks(0),
            Trophy::CopsII => trophies::cops::Cops::tasks(1),
            Trophy::CopsIII => trophies::cops::Cops::tasks(2),
            Trophy::GangsI => trophies::gangs::Gangs::tasks(0),
            Trophy::GangsII => trophies::gangs::Gangs::tasks(1),
            Trophy::GangsIII => trophies::gangs::Gangs::tasks(2),
            Trophy::Launderer => trophies::launderer::Launderer::tasks(0),
            Trophy::EscapeI => trophies::escape::Escape::tasks(0),
            Trophy::EscapeII => trophies::escape::Escape::tasks(1),
            Trophy::EscapeIII => trophies::escape::Escape::tasks(2),
            Trophy::Famous => trophies::famous::Famous::tasks(0),
            Trophy::DealerI => trophies::dealer::Dealer::tasks(0),
            Trophy::DealerII => trophies::dealer::Dealer::tasks(1),
            Trophy::DealerIII => trophies::dealer::Dealer::tasks(2),
            Trophy::Brawler => trophies::brawler::Brawler::tasks(0),
        }
    }

    #[inline]
    fn data(self: Trophy) -> ByteArray {
        ""
    }
}

impl IntoTrophyU8 of core::Into<Trophy, u8> {
    #[inline]
    fn into(self: Trophy) -> u8 {
        match self {
            Trophy::None => 0,
            Trophy::HustlerI => 1,
            Trophy::HustlerII => 2,
            Trophy::HustlerIII => 3,
            Trophy::Kingpin => 4,
            Trophy::JailbirdI => 5,
            Trophy::JailbirdII => 6,
            Trophy::JailbirdIII => 7,
            Trophy::Stuffed => 8,
            Trophy::Rip => 9,
            Trophy::CopsI => 10,
            Trophy::CopsII => 11,
            Trophy::CopsIII => 12,
            Trophy::GangsI => 13,
            Trophy::GangsII => 14,
            Trophy::GangsIII => 15,
            Trophy::Launderer => 16,
            Trophy::EscapeI => 17,
            Trophy::EscapeII => 18,
            Trophy::EscapeIII => 19,
            Trophy::Famous => 20,
            Trophy::DealerI => 21,
            Trophy::DealerII => 22,
            Trophy::DealerIII => 23,
            Trophy::Brawler => 24,
        }
    }
}

impl IntoU8Trophy of core::Into<u8, Trophy> {
    #[inline]
    fn into(self: u8) -> Trophy {
        let card: felt252 = self.into();
        match card {
            0 => Trophy::None,
            1 => Trophy::HustlerI,
            2 => Trophy::HustlerII,
            3 => Trophy::HustlerIII,
            4 => Trophy::Kingpin,
            5 => Trophy::JailbirdI,
            6 => Trophy::JailbirdII,
            7 => Trophy::JailbirdIII,
            8 => Trophy::Stuffed,
            9 => Trophy::Rip,
            10 => Trophy::CopsI,
            11 => Trophy::CopsII,
            12 => Trophy::CopsIII,
            13 => Trophy::GangsI,
            14 => Trophy::GangsII,
            15 => Trophy::GangsIII,
            16 => Trophy::Launderer,
            17 => Trophy::EscapeI,
            18 => Trophy::EscapeII,
            19 => Trophy::EscapeIII,
            20 => Trophy::Famous,
            21 => Trophy::DealerI,
            22 => Trophy::DealerII,
            23 => Trophy::DealerIII,
            24 => Trophy::Brawler,
            _ => Trophy::None,
        }
    }
}

impl TrophyPrint of core::debug::PrintTrait<Trophy> {
    #[inline]
    fn print(self: Trophy) {
        self.identifier().print();
    }
}
