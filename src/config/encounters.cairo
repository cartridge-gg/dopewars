use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::game::{GameConfig},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl},
        bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}
    },
    packing::{game_store::{GameStore},},
    library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
};

//
//
//

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum Encounters {
    Cops,
    Gang,
}

impl EncountersIntoFelt252 of Into<Encounters, felt252> {
    fn into(self: Encounters) -> felt252 {
        match self {
            Encounters::Cops => 'Cops',
            Encounters::Gang => 'Gang',
        }
    }
}

impl EncountersIntoU8 of Into<Encounters, u8> {
    fn into(self: Encounters) -> u8 {
        match self {
            Encounters::Cops => 0,
            Encounters::Gang => 1,
        }
    }
}


//
//
//

#[derive(Model, Copy, Drop, Serde)]
struct EncounterConfig {
    // name: Bytes16,
    #[key]
    id: u8,
    encounter: Encounters,
    //
    level: u8,
    health: u8,
    attack: u8, // *
    defense: u8, // % dmg reduction
    speed: u8, // run: rand speed win | fight: initiative  
    //
    rep_pay: u8, // reputation modifier for paying NEGATIVE
    rep_run: u8, // reputation modifier for running POSITIVE(success) or NEGATIVE(fail)
    rep_fight: u8, // reputation modifier for fighting
    // 
    min_rep: u8,
    max_rep: u8,
    //
    payout: u32,
}

//
//
//


fn add_encounter(
    s: IStoreLibraryDispatcher, ref encounter: EncounterConfig, ref game_config: GameConfig
) {
    // override id
    encounter.id = game_config.encounter_count;

    // create encounter
    s.save_encounter_config(encounter);

    // update total encounter count
    game_config.encounter_count += 1;
}
// 
//
//

#[generate_trait]
impl EncounterSpawnerImpl of EncounterSpawnerTrait {
    fn get_encounters_ids_by_rep(s: IStoreLibraryDispatcher, rep: u8) -> Span<u8> {
        let mut game_config = s.game_config();
        let mut encounters_ids = array![];
        
        let mut id = 0;

        loop {
            if id == game_config.encounter_count {
                break;
            }

            let encounter = s.encounter_config(id);

            if rep >= encounter.min_rep && rep <= encounter.max_rep {
                encounters_ids.append(encounter.id);
            };

            id += 1;
        };

        encounters_ids.span()
    }

    fn get_encounter(ref game_store: GameStore) -> EncounterConfig {
        let rep = game_store.player.reputation;

        let encounters_ids = EncounterSpawnerImpl::get_encounters_ids_by_rep(game_store.s, rep);

        let rand_from_game_store: u256 = pedersen::pedersen(
            game_store.markets.packed, game_store.markets.packed
        )
            .into();

        let rand_index = rand_from_game_store % encounters_ids.len().into();
        let rand_id = *encounters_ids.at(rand_index.try_into().unwrap());

        let mut encounter = game_store.s.encounter_config(rand_id);

        encounter
    }

    fn get_random_demand_pct(ref game_store: GameStore) -> u8 {
        let rand_from_game_store: u256 = pedersen::pedersen(
            game_store.markets.packed, game_store.game.game_id.into()
        )
            .into();

        let rand_0_99: u8 = (rand_from_game_store % 100).try_into().unwrap();

        if rand_0_99 < 1 {
            69
        } else if rand_0_99 < 10 {
            50
        } else if rand_0_99 < 20 {
            40
        } else if rand_0_99 < 50 {
            30
        } else {
            20
        }
    }
}


//
//
//

#[generate_trait]
impl EncounterImpl of EncounterTrait {
    #[inline(always)]
    fn is_dead(ref self: EncounterConfig) -> bool {
        self.health == 0
    }

    #[inline(always)]
    fn health_loss(ref self: EncounterConfig, amount: u8) {
        self.health = self.health.sub_capped(amount, 0);
    }

    fn get_demand_pct(self: EncounterConfig, ref game_store: GameStore) -> u8 {
        EncounterSpawnerImpl::get_random_demand_pct(ref game_store)
    }

    fn get_payout(self: EncounterConfig, ref game_store: GameStore) -> u32 {
        (self.level.into() * self.level.into() * 3_000) + (game_store.player.turn.into() * 1_000)
    }
}


//
//
//

// fn get_encounter_by_slot(game_store: GameStore, encounter_slot: Encounters) -> Encounter {
//     let turn = game_store.player.turn;

//     // temp: lvl based on reputation    
//     let encounter_level = game_store.player.reputation / 15 + 1;

//     let health = encounter_level * 5 + turn;
//     let attack = encounter_level * 2 + turn / 3;

//     let payout: u32 = (encounter_level.into() * encounter_level.into() * 4_000)
//         + (turn.into() * 1_000);
//     let demand_pct = get_encounter_demand_from_game_store(game_store);

//     Encounter {
//         encounter: encounter_slot,
//         level: encounter_level,
//         health: health,
//         attack: attack,
//         payout: payout,
//         demand_pct: demand_pct,
//     }
// }

//
//
//

fn initialize_encounter_config(s: IStoreLibraryDispatcher) {
    let mut game_config = s.game_config();

    // COPS

    let mut i = 0;
    loop {
        if i == 6 {
            break;
        }

        let lvl = i + 1;
        let mut encounter = EncounterConfig {
            id: 0, // overrided
            encounter: Encounters::Cops,
            //
            level: lvl,
            health: lvl * 12,
            attack: lvl * 8,
            defense: lvl * 10,
            speed: lvl * 8,
            //
            rep_pay: lvl + 5,
            rep_run: lvl,
            rep_fight: lvl + 2,
            // 
            min_rep: i * 15,
            max_rep: (i * 15) + 25,
            //
            payout: 0, // overrided
        };

        add_encounter(s, ref encounter, ref game_config);
        i += 1;
    };

    // GANG

    let mut i = 0;
    loop {
        if i == 6 {
            break;
        }

        let lvl = i + 1;
        let mut encounter = EncounterConfig {
            id: 0, // overrided
            encounter: Encounters::Gang,
            //
            level: lvl,
            health: lvl * 8,
            attack: lvl * 12,
            defense: lvl * 9,
            speed: lvl * 8,
            //
            rep_pay: lvl + 5,
            rep_run: lvl,
            rep_fight: lvl + 2,
            // 
            min_rep: i * 15,
            max_rep: (i * 15) + 25,
            //
            payout: 0, // overrided
        };

        add_encounter(s, ref encounter, ref game_config);
        i += 1;
    };

    // save encounter_count
    s.save_game_config(game_config);
}

fn initialize_encounter_config_extra(s: IStoreLibraryDispatcher) {
    let mut game_config = s.game_config();

    //////// COPS ////////

    let mut cops1 = EncounterConfig {
        id: 0, // overrided
        encounter: Encounters::Cops,
        //
        level: 1,
        health: 15,
        attack: 15,
        defense: 15,
        speed: 15,
        //
        rep_pay: 5,
        rep_run: 1,
        rep_fight: 2,
        // 
        min_rep: 0,
        max_rep: 40,
        //
        payout: 0, // overrided
    };

    let mut cops2 = EncounterConfig {
        id: 0,
        encounter: Encounters::Cops,
        //
        level: 2,
        health: 25,
        attack: 25,
        defense: 25,
        speed: 25,
        //
        rep_pay: 6,
        rep_run: 2,
        rep_fight: 4,
        // 
        min_rep: 30,
        max_rep: 70,
        //
        payout: 0, // overrided
    };

    let mut cops3 = EncounterConfig {
        id: 0,
        encounter: Encounters::Cops,
        //
        level: 3,
        health: 35,
        attack: 35,
        defense: 35,
        speed: 25,
        //
        rep_pay: 7,
        rep_run: 3,
        rep_fight: 5,
        // 
        min_rep: 50,
        max_rep: 100,
        //
        payout: 0, // overrided
    };

    add_encounter(s, ref cops1, ref game_config);
    add_encounter(s, ref cops2, ref game_config);
    add_encounter(s, ref cops3, ref game_config);

    //////// GANGS ////////

    let mut gang1 = EncounterConfig {
        id: 0,
        encounter: Encounters::Gang,
        //
        level: 1,
        health: 15,
        attack: 15,
        defense: 15,
        speed: 15,
        //
        rep_pay: 12,
        rep_run: 2,
        rep_fight: 3,
        // 
        min_rep: 0,
        max_rep: 40,
        //
        payout: 0, // overrided
    };

    let mut gang2 = EncounterConfig {
        id: 0,
        encounter: Encounters::Gang,
        //
        level: 2,
        health: 25,
        attack: 25,
        defense: 25,
        speed: 35,
        //
        rep_pay: 5,
        rep_run: 2,
        rep_fight: 4,
        // 
        min_rep: 30,
        max_rep: 80,
        //
        payout: 0, // overrided
    };

    let mut gang3 = EncounterConfig {
        id: 0,
        encounter: Encounters::Gang,
        //
        level: 4,
        health: 45,
        attack: 45,
        defense: 45,
        speed: 45,
        //
        rep_pay: 4,
        rep_run: 3,
        rep_fight: 6,
        // 
        min_rep: 60,
        max_rep: 100,
        //
        payout: 0, // overrided
    };

    add_encounter(s, ref gang1, ref game_config);
    add_encounter(s, ref gang2, ref game_config);
    add_encounter(s, ref gang3, ref game_config);

    // save encounter_count
    s.save_game_config(game_config);
}
