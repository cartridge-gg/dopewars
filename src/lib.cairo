pub mod constants;

pub mod events;

pub mod store;

#[cfg(test)]
pub mod tests;

pub mod traits;
pub mod config {
    pub mod config;
    pub mod drugs;
    pub mod encounters;
    pub mod game;
    pub mod gear;
    pub mod hustlers;
    pub mod locations;
    pub mod ryo;
    pub mod ryo_address;
    pub mod settings;
}

pub mod elements {
    pub mod quests {
        pub mod brawlerC;
        pub mod brawlerG;
        pub mod cops;
        pub mod dealer;
        pub mod escape;
        pub mod famous;
        pub mod gangs;
        pub mod hustler;
        pub mod interface;
        pub mod jailbird;
        pub mod kingpin;
        pub mod launderer;
        pub mod rip;
        pub mod stuffed;
        pub mod types;
    }
    pub mod trophies {
        pub mod brawler;
        pub mod cops;
        pub mod dealer;
        pub mod escape;
        pub mod famous;
        pub mod gangs;
        pub mod hustler;
        pub mod interface;
        pub mod jailbird;
        pub mod kingpin;
        pub mod launderer;
        pub mod rip;
        pub mod stuffed;
        pub mod types;
    }
}

pub mod helpers {
    pub mod season_manager;
}

pub mod models {
    pub mod game;
    pub mod game_store_packed;
    pub mod game_with_token_id;

    pub mod season;
}

pub mod packing {
    pub mod drugs_packed;
    pub mod game_store;
    pub mod game_store_layout;
    pub mod items_packed;
    pub mod markets_packed;

    pub mod player;
    pub mod player_layout;
    pub mod wanted_packed;
}

pub mod systems {
    pub mod game;
    pub mod decide;
    pub mod laundromat;
    pub mod ryo;

    pub mod helpers {
        pub mod game_loop;
        pub mod shopping;

        pub mod trading;
        pub mod traveling;
    }
    // pub mod slot;
// pub mod devtools;
}

pub mod tokens {
    // pub mod chips;
}

pub mod utils {
    pub mod bits;
    pub mod bytes16;
    pub mod events;
    pub mod introspect;
    pub mod math;
    pub mod payout_structure;
    pub mod random;
    pub mod sorted_list;
}

pub mod interfaces {
    pub mod chips;
    pub mod paper;
    pub mod erc721;
    pub mod dope_hustlers;
    pub mod dope_loot;
}

pub mod _mocks {
    pub mod paper_mock;
    pub mod vrf_provider_mock;
}


pub mod libraries {
    pub mod dopewars_items;
}
