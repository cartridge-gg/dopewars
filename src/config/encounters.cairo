use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl},
        bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}
    }
};


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
    attack: u8,
    defense: u8,
    speed: u8,
    // 32
    payout: u32,
    // 32
    demand_pct: u8,
    rep_pay: u8,   // reputation modifier for paying NEGATIVE
    rep_run: u8,   // reputation modifier for running
    rep_fight: u8, // reputation modifier for fighting
    // 16
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
}

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



fn initialize_encounter_config(world: IWorldDispatcher) {

    //////// COPS ////////

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('Cops LVL 1'),
            id:0,
            encounter: Encounters::Cops,
            //
            level: 1,
            health: 16,
            attack: 8,
            defense: 5,
            speed : 2,
            //
            payout: 420,
            demand_pct: 20,
            //
            rep_pay: 10,  
            rep_run: 0,  
            rep_fight: 2,
            // 
            min_rep: 0,
            max_rep: 40,
        }
    );

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('Cops LVL 2'),
            id:1,
            encounter: Encounters::Cops,
            //
            level: 2,
            health: 26,
            attack: 16,
            defense: 11,
            speed : 5,
            //
            payout: 2500,
            demand_pct: 30,
            //
            rep_pay: 6,  
            rep_run: 2,  
            rep_fight: 4,
            // 
            min_rep: 20,
            max_rep: 60,
        }
    );

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('Cops LVL 3'),
            id:2,
            encounter: Encounters::Cops,
            //
            level: 3,
            health: 42,
            attack: 25,
            defense: 15,
            speed : 15,
            //
            payout: 20000,
            demand_pct: 30,
            //
            rep_pay: 5,  
            rep_run: 3,  
            rep_fight: 6,
            // 
            min_rep: 40,
            max_rep: 100,
        }
    );


    //////// GANGS ////////

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('GANG LVL 1'),
            id:7,
            encounter: Encounters::Gang,
            //
            level: 1,
            health: 16,
            attack: 8,
            defense: 5,
            speed : 2,
            //
            payout: 420,
            demand_pct: 20,
            //
            rep_pay: 10,  
            rep_run: 0,  
            rep_fight: 2,
            // 
            min_rep: 0,
            max_rep: 40,
        }
    );

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('GANG LVL 2'),
            id:8,
            encounter: Encounters::Gang,
            //
            level: 2,
            health: 26,
            attack: 16,
            defense: 11,
            speed : 5,
            //
            payout: 2500,
            demand_pct: 30,
            //
            rep_pay: 6,  
            rep_run: 2,  
            rep_fight: 4,
            // 
            min_rep: 20,
            max_rep: 60,
        }
    );

    set!(
        world,
        EncounterConfig {
            // name: Bytes16Impl::from('GANG LVL 3'),
            id:9,
            encounter: Encounters::Gang,
            //
            level: 3,
            health: 42,
            attack: 25,
            defense: 15,
            speed : 15,
            //
            payout: 20000,
            demand_pct: 30,
            //
            rep_pay: 5,  
            rep_run: 3,  
            rep_fight: 6,
            // 
            min_rep: 40,
            max_rep: 100,
        }
    );

}