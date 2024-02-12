use rollyourown::packing::encounters_packed::EncountersPackedTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{items::{ItemConfig, ItemSlot, ItemConfigImpl, ItemLevel}, locations::{Locations}},
    packing::{
        game_store::{GameStore}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl},
        encounters_packed::{Encounters, EncountersPackedImpl},drugs_packed::{DrugsPacked,DrugsPackedImpl,DrugsUnpacked}
    },
    systems::game::EncounterActions
};

#[derive(Copy, Drop, Serde, PartialEq)]
enum EncounterOutcomes {
    Died,
    Paid,
    Escaped,
    Victorious,
// Jailed,
// Hospitalized,
}


// #[derive(Copy, Drop, Serde, PartialEq)]
// enum EncountersDemand {
//     Pct20,
//     Pct30,
//     Pct50,
//     Special
// }

#[derive(Copy, Drop)]
struct Encounter {
    encounter: Encounters,
    level: u8,
    health: u8,
    attack: u8,
    payout: u32,
    demand_pct: u8,
}


#[generate_trait]
impl EncounterImpl of EncounterTrait {
    fn get_first_strike_dmg(self: Encounter) -> u8 {
        if self.attack < 3 {
            1
        } else {
            self.attack / 3
        }
    }
}


//
//
//

fn get_encounter_demand_from_game_store(game_store: GameStore) -> u8 {
    let rand_from_game_store: u256 = pedersen::pedersen(
        game_store.markets.packed, game_store.encounters.packed
    )
        .into();
    let rand_0_99: u8 = (rand_from_game_store % 100).try_into().unwrap();

    if rand_0_99 < 1 {
        69
    } else if rand_0_99 < 20 {
        50
    } else if rand_0_99 < 50 {
        30
    } else {
        20
    }
}

fn get_encounter_by_slot(game_store: GameStore, encounter_slot: Encounters) -> Encounter {
    let turn = game_store.player.turn;

    let encounter_level = game_store.encounters.get_encounter_level(encounter_slot) + 1;
    let health = encounter_level * 7 + turn;
    let attack = encounter_level * 2 + turn / 4;
    let payout: u32 = (encounter_level.into() * encounter_level.into() * 6900)
        + (turn.into() * 420);
    let demand_pct = get_encounter_demand_from_game_store(game_store);

    Encounter {
        encounter: encounter_slot,
        level: encounter_level,
        health: health,
        attack: attack,
        payout: payout,
        demand_pct: demand_pct,
    }
}

// fn get_encounter(ref self: EncountersPacked, ref randomizer: Random) -> Encounter {

fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> bool {
    // get wanted level at destination 0-7
    let wanted_risk = game_store.wanted.get_wanted_risk(game_store.player.next_location);

    if randomizer.occurs(wanted_risk) {
        //get random Gang / Cops
        let encounter_slot = if randomizer.bool() {
            Encounters::Gang
        } else {
            Encounters::Cops
        };

        // get encounter
        let encounter = get_encounter_by_slot(game_store, encounter_slot);

        // update player status
        game_store.player.status = match encounter.encounter {
            Encounters::Cops => PlayerStatus::BeingArrested,
            Encounters::Gang => PlayerStatus::BeingMugged,
        };

        // player lose health
        let health_loss = encounter.get_first_strike_dmg();
        game_store.player.health = game_store.player.health.sub_capped(health_loss, 0);

        // emit TravelEncounter
        game_store
            .world
            .emit_raw(
                array![
                    selector!("TravelEncounter"),
                    Into::<u32, felt252>::into(game_store.game_id),
                    Into::<starknet::ContractAddress, felt252>::into(game_store.player_id).into()
                ],
                array![
                    Into::<Encounters, u8>::into(encounter.encounter).into(),
                    Into::<u8, felt252>::into(encounter.attack),
                    Into::<u8, felt252>::into(encounter.health),
                    Into::<u8, felt252>::into(encounter.level),
                    Into::<u8, felt252>::into(health_loss),
                    Into::<u8, felt252>::into(encounter.demand_pct),
                    Into::<u32, felt252>::into(encounter.payout),
                ],
            );

        // // todo check if dead here ?
        // if game_store.player.health == 0 {
        //     ryo::game_over(ref game_store);
        // };

        return true;
    }

    false
}


fn decide(ref game_store: GameStore, ref randomizer: Random, action: EncounterActions) {
    let encounter_slot = match game_store.player.status {
        PlayerStatus::Normal => Encounters::Cops, // can't happen
        PlayerStatus::BeingArrested => Encounters::Cops,
        PlayerStatus::BeingMugged => Encounters::Gang,
    };

    // get encounter
    let encounter = get_encounter_by_slot(game_store, encounter_slot);

    // run action
    match action {
        EncounterActions::Run => { on_run(ref game_store, ref randomizer, encounter); },
        EncounterActions::Pay => { on_pay(ref game_store, ref randomizer, encounter); },
        EncounterActions::Fight => { on_fight(ref game_store, ref randomizer, encounter); },
    };

    // update encounter level
    game_store.encounters.increase_encounter_level(encounter_slot);

    // update player status
    game_store.player.status = PlayerStatus::Normal;
}

fn on_pay(ref game_store: GameStore, ref randomizer: Random, encounter: Encounter) {

    match encounter.encounter {
        Encounters::Cops => {
            // pay demand_pct drugs
            let mut drug_unpacked = game_store.drugs.get();
            let drug_loss = drug_unpacked.quantity.pct(encounter.demand_pct.into());
            drug_unpacked.quantity -= drug_loss;

            // set drugs
            game_store.drugs.set(drug_unpacked);
        },
        Encounters::Gang => {
            // calc cash_loss
            let cash_loss = game_store.player.cash.pct(encounter.demand_pct.into());
            // pay demand_pct cash
            game_store.player.cash -= cash_loss;
        },
    };

}



fn on_run(ref game_store: GameStore, ref randomizer: Random, encounter: Encounter) {}
fn on_fight(ref game_store: GameStore, ref randomizer: Random, encounter: Encounter) {}
