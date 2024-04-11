use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::game::{GameConfig, GameConfigImpl},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl},
        bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}
    },
    packing::{
        game_store::{GameStore},
    },
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
    defense: u8, // *
    speed: u8,
    // 
    payout: u32,
    // 
    demand_pct: u8,
    //
    rep_pay: u8,   // reputation modifier for paying NEGATIVE
    rep_run: u8,   // reputation modifier for running POSITIVE(success) or NEGATIVE(fail)
    rep_fight: u8, // reputation modifier for fighting
    // 
    min_rep: u8,
    max_rep: u8,
    //
    // crit_rate:u8,
    // incorruptible: bool,
    // challenger: bool,
    // challenger: bool,
}

//
//
//

#[generate_trait]
impl EncounterConfigImpl of EncounterConfigTrait {
    #[inline(always)]
    fn get(world: IWorldDispatcher, id: u8) -> EncounterConfig {
        get!(world, (id), EncounterConfig)
    }
    
    fn add_encounter(world: IWorldDispatcher,ref encounter: EncounterConfig, ref game_config: GameConfig) {
        // override id
        encounter.id = game_config.encounter_count;

        // create encounter
        set!(world, (encounter));

        // update total encounter count
        game_config.encounter_count += 1;
    }
}

//
//
//

#[generate_trait]
impl EncounterImpl of EncounterTrait {
    fn get_encounters_ids_by_rep(world: IWorldDispatcher, rep: u8) -> Span<u8> {
        let mut game_config = GameConfigImpl::get(world);
        let mut encounters_ids = array![];

        let mut id = 0;

        loop {
            if id == game_config.encounter_count {
                break;
            }

            let encounter = get!(world, (id), (EncounterConfig));

            if rep >= encounter.min_rep && rep < encounter.max_rep {
                encounters_ids.append(encounter.id);
            };

            id += 1;
        };

        encounters_ids.span()
    }

    fn get_encounter(ref game_store: GameStore) -> EncounterConfig {
        let rep = game_store.player.reputation;

        let encounters_ids = EncounterImpl::get_encounters_ids_by_rep(game_store.world, rep);

        let rand_from_game_store: u256 = pedersen::pedersen(
             game_store.markets.packed, game_store.markets.packed
        ).into();

        let rand_index = rand_from_game_store % encounters_ids.len().into();
        let rand_id = *encounters_ids.at(rand_index.try_into().unwrap());

        get!(game_store.world, (rand_id), (EncounterConfig))
    }
}

//
//
//

fn initialize_encounter_config(world: IWorldDispatcher) {

    let mut game_config = GameConfigImpl::get(world);

    // COPS

    let mut i = 0;
    loop {
        if i == 6 {
            break;
        }

        let lvl = i+1;
        let mut encounter = EncounterConfig {
                id:0, // overrided
                encounter: Encounters::Cops,
                //
                level: lvl,
                health: lvl * 9,
                attack: lvl * 11,
                defense: lvl * 7,
                speed : lvl * 8,
                //
                payout: 2500_u32 * lvl.into(),
                demand_pct: 20,
                //
                rep_pay: lvl + 5,  
                rep_run: lvl,  
                rep_fight: lvl + 2,
                // 
                min_rep: i * 15,
                max_rep: (i * 15) + 25,
        };

        EncounterConfigImpl::add_encounter(world,ref encounter, ref game_config);
        i += 1;
    };


    // GANG

    let mut i = 0;
    loop {
        if i == 6 {
            break;
        }

        let lvl = i+1;
        let mut encounter = EncounterConfig {
                id:0, // overrided
                encounter: Encounters::Gang,
                //
                level: lvl,
                health: lvl * 11,
                attack: lvl * 10,
                defense: lvl * 6,
                speed : lvl * 6,
                //
                payout: 2000_u32 * lvl.into(),
                demand_pct: 20,
                //
                rep_pay: lvl + 5,  
                rep_run: lvl,  
                rep_fight: lvl + 2,
                // 
                min_rep: i * 15,
                max_rep: (i * 15) + 25,
        };

        EncounterConfigImpl::add_encounter(world,ref encounter, ref game_config);
        i += 1;
    };

    // save encounter_count
    GameConfigImpl::set(world, game_config);

    initialize_encounter_config_extra(world);
}

fn initialize_encounter_config_extra(world: IWorldDispatcher) {

    let mut game_config = GameConfigImpl::get(world);

    //////// COPS ////////

    let mut cops1 = EncounterConfig {
            id:0, // overrided
            encounter: Encounters::Cops,
            //
            level: 1,
            health: 16,
            attack: 8,
            defense: 5,
            speed : 2,
            //
            payout: 4200,
            demand_pct: 20,
            //
            rep_pay: 10,  
            rep_run: 0,  
            rep_fight: 2,
            // 
            min_rep: 0,
            max_rep: 40,
        };


    let mut cops2 = EncounterConfig {
            id:0,
            encounter: Encounters::Cops,
            //
            level: 3,
            health: 26,
            attack: 16,
            defense: 11,
            speed : 14,
            //
            payout: 42000,
            demand_pct: 30,
            //
            rep_pay: 6,  
            rep_run: 2,  
            rep_fight: 4,
            // 
            min_rep: 40,
            max_rep: 100,
        };
    

   
    EncounterConfigImpl::add_encounter(world,ref cops1, ref game_config );
    EncounterConfigImpl::add_encounter(world,ref cops2, ref game_config );


    //////// GANGS ////////

   let mut gang1 = EncounterConfig {
            id:0,
            encounter: Encounters::Gang,
            //
            level: 2,
            health: 40,
            attack: 25,
            defense: 15,
            speed : 20,
            //
            payout: 20000,
            demand_pct: 50,
            //
            rep_pay: 10,  
            rep_run: 0,  
            rep_fight: 2,
            // 
            min_rep: 0,
            max_rep: 40,
        };

   let mut gang2 = EncounterConfig {
            id:0,
            encounter: Encounters::Gang,
            //
            level: 4,
            health: 60,
            attack: 45,
            defense: 25,
            speed : 35,
            //
            payout: 50000,
            demand_pct: 60,
            //
            rep_pay: 6,  
            rep_run: 2,  
            rep_fight: 4,
            // 
            min_rep: 40,
            max_rep: 100,
        };


    EncounterConfigImpl::add_encounter(world,ref gang1, ref game_config );
    EncounterConfigImpl::add_encounter(world,ref gang2, ref game_config );

    // save encounter_count
    GameConfigImpl::set(world, game_config);

}
