mod constants;

mod events;

mod store;

#[cfg(test)]
mod tests;

mod traits;
mod config {
    mod config;
    mod drugs;
    mod encounters;
    mod game;
    mod hustlers;
    mod locations;
    mod ryo;
    mod ryo_address;
    mod settings;
}

mod elements {
    mod quests {
        mod brawlerC;
        mod brawlerG;
        mod cops;
        mod dealer;
        mod escape;
        mod famous;
        mod gangs;
        mod hustler;
        mod interface;
        mod jailbird;
        mod kingpin;
        mod launderer;
        mod rip;
        mod stuffed;
        mod types;
    }
    mod trophies {
        mod brawler;
        mod cops;
        mod dealer;
        mod escape;
        mod famous;
        mod gangs;
        mod hustler;
        mod interface;
        mod jailbird;
        mod kingpin;
        mod launderer;
        mod rip;
        mod stuffed;
        mod types;
    }
}

mod helpers {
    mod season_manager;
}

mod models {
    mod game;
    mod game_store_packed;

    mod season;
}

mod packing {
    mod drugs_packed;
    mod game_store;
    mod game_store_layout;
    mod items_packed;
    mod markets_packed;

    mod player;
    mod player_layout;
    mod wanted_packed;
}

mod systems {
    mod game;
    mod laundromat;
    mod ryo;

    mod helpers {
        mod game_loop;
        mod shopping;

        mod trading;
        mod traveling;
    }
    // mod slot;
// mod devtools;
}

mod tokens {
    // mod chips;
}

mod utils {
    mod bits;
    mod bytes16;
    mod events;
    mod introspect;
    mod math;
    mod payout_structure;
    mod random;
    mod sorted_list;
}

mod interfaces {
    mod chips;
    mod paper;
}

mod _mocks {
    mod paper_mock;
    mod vrf_provider_mock;
}

