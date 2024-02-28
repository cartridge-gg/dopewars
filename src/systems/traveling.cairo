use rollyourown::packing::drugs_packed::DrugsPackedTrait;
use rollyourown::utils::random::RandomTrait;
use core::traits::TryInto;
use rollyourown::packing::items_packed::ItemsPackedTrait;
use rollyourown::packing::encounters_packed::EncountersPackedTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{
        hustlers::{HustlerItemConfig, ItemSlot}, locations::{Locations, LocationsRandomizableImpl}
    },
    packing::{
        game_store::{GameStore}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl},
        encounters_packed::{Encounters, EncountersPackedImpl},
        drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsUnpacked}
    },
    systems::game::{EncounterActions, game::TravelEncounterResult}
};

#[derive(Copy, Drop, Serde, PartialEq)]
enum EncounterOutcomes {
    Died,
    Paid,
    Escaped,
    Victorious,
    Jailed,
    Hospitalized,
}

impl EncounterActionsIntoFelt252 of Into<EncounterActions, felt252> {
    fn into(self: EncounterActions) -> felt252 {
        match self {
            EncounterActions::Run => 'Run',
            EncounterActions::Pay => 'Pay',
            EncounterActions::Fight => 'Fight',
        }
    }
}

impl EncounterActionsIntoU8 of Into<EncounterActions, u8> {
    fn into(self: EncounterActions) -> u8 {
        match self {
            EncounterActions::Run => 0,
            EncounterActions::Pay => 1,
            EncounterActions::Fight => 2,
        }
    }
}


impl EncounterOutcomesIntoFelt252 of Into<EncounterOutcomes, felt252> {
    fn into(self: EncounterOutcomes) -> felt252 {
        match self {
            EncounterOutcomes::Died => 'Died',
            EncounterOutcomes::Paid => 'Paid',
            EncounterOutcomes::Escaped => 'Escaped',
            EncounterOutcomes::Victorious => 'Victorious',
            EncounterOutcomes::Jailed => 'Jailed',
            EncounterOutcomes::Hospitalized => 'Hospitalized',
        }
    }
}

impl EncounterOutcomesIntoU8 of Into<EncounterOutcomes, u8> {
    fn into(self: EncounterOutcomes) -> u8 {
        match self {
            EncounterOutcomes::Died => 0,
            EncounterOutcomes::Paid => 1,
            EncounterOutcomes::Escaped => 2,
            EncounterOutcomes::Victorious => 3,
            EncounterOutcomes::Jailed => 4,
            EncounterOutcomes::Hospitalized => 5,
        }
    }
}


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
        game_store.markets.packed, game_store.markets.packed
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
    let health = encounter_level * 5 + turn;
    // let attack = encounter_level * 2 + turn / 3;
    let attack = encounter_level * 1 + turn / 3;
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

fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> (bool, bool) {
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
                    Into::<u32, felt252>::into(game_store.game.game_id),
                    Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id)
                        .into()
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

        return (game_store.player.is_dead(), true);
    }

    (false, false)
}


fn decide(ref game_store: GameStore, ref randomizer: Random, action: EncounterActions) -> bool {
    let encounter_slot = match game_store.player.status {
        PlayerStatus::Normal => Encounters::Cops, // can't happen
        PlayerStatus::BeingArrested => Encounters::Cops,
        PlayerStatus::BeingMugged => Encounters::Gang,
    };

    // get encounter
    let encounter = get_encounter_by_slot(game_store, encounter_slot);

    // run action
    let result = match action {
        EncounterActions::Run => { on_run(ref game_store, ref randomizer, encounter) },
        EncounterActions::Pay => { on_pay(ref game_store, ref randomizer, encounter) },
        EncounterActions::Fight => { on_fight(ref game_store, ref randomizer, encounter) },
    };

    // emit event
    game_store
        .world
        .emit_raw(
            array![
                selector!("TravelEncounterResult"),
                Into::<u32, felt252>::into(game_store.game.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into()
            ],
            array![
                Into::<EncounterActions, u8>::into(result.action).into(),
                Into::<EncounterOutcomes, u8>::into(result.outcome).into(),
                Into::<u8, felt252>::into(result.rounds),
                Into::<u8, felt252>::into(result.dmg_dealt),
                Into::<u8, felt252>::into(result.dmg_taken),
                Into::<u32, felt252>::into(result.cash_earnt),
                Into::<u32, felt252>::into(result.cash_loss),
                Into::<u8, felt252>::into(result.drug_id),
                Into::<u32, felt252>::into(result.drug_loss),
                Into::<u8, felt252>::into(result.turn_loss),
            ],
        );

    let is_dead = game_store.player.is_dead();
    if !is_dead {
        // update encounter level
        game_store.encounters.increase_encounter_level(encounter_slot);

        // update player status
        game_store.player.status = PlayerStatus::Normal;
    }

    is_dead
}

fn on_pay(
    ref game_store: GameStore, ref randomizer: Random, encounter: Encounter
) -> TravelEncounterResult {
    let mut drug_id: u8 = 0;
    let mut drug_loss: u32 = 0;
    let mut cash_loss: u32 = 0;
    let mut dmg_taken: u8 = 0;

    match encounter.encounter {
        Encounters::Cops => {
            // pay demand_pct drugs
            let mut drug_unpacked = game_store.drugs.get();
            drug_loss = drug_unpacked.quantity.pct(encounter.demand_pct.into());
            drug_id = drug_unpacked.drug.into();
            drug_unpacked.quantity -= drug_loss;

            // set drugs
            game_store.drugs.set(drug_unpacked);
        },
        Encounters::Gang => {
            // calc cash_loss
            cash_loss = game_store.player.cash.pct(encounter.demand_pct.into());
            // gang make u lose 1 extra hp (but can't die)
            dmg_taken = 1;

            // update player cash
            game_store.player.cash -= cash_loss;
            // update player health
            game_store.player.health = game_store.player.health.sub_capped(dmg_taken, 1);
        },
    };

    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: EncounterActions::Pay,
        outcome: EncounterOutcomes::Paid,
        rounds: 0,
        dmg_dealt: 0,
        dmg_taken,
        cash_earnt: 0,
        cash_loss,
        drug_id,
        drug_loss,
        turn_loss: 0
    }
}


fn on_run(
    ref game_store: GameStore, ref randomizer: Random, encounter: Encounter
) -> TravelEncounterResult {
    // TODO: adjust with items
    let initial_capture_rate: u8 = 82; // 82% chance of capture 

    let player_defense: u8 = game_store
        .items
        .get_item(ItemSlot::Clothes)
        .tier
        .stat
        .try_into()
        .unwrap();
    let player_speed: u8 = game_store.items.get_item(ItemSlot::Feet).tier.stat.try_into().unwrap();

    let capture_rate = initial_capture_rate.sub_capped(player_speed, 0);

    let mut drug_unpacked = game_store.drugs.get();
    let drug_id: u8 = drug_unpacked.drug.into();

    let mut rounds = 0;
    let mut dmg_taken = 0;
    let mut drug_loss = 0;
    let mut turn_loss = 0;
    let mut is_dead = false;
    let mut is_caught = false;

    // loop until resolution
    loop {
        rounds += 1;
        let is_captured = randomizer.occurs(capture_rate);

        if is_captured {
            //encounter___attack = encounter_level * 2 + turn / 3;

            // reduce attack with defense
            let def = player_defense / 10;
            let health_loss = encounter.attack.sub_capped(def, 1);

            // take dmgs
            game_store.player.health = game_store.player.health.sub_capped(health_loss, 0);
            dmg_taken += health_loss;

            // loss a 2 or 1% drug each round xd
            let loss_pct = drug_unpacked.quantity.pct(1);
            let loss = if loss_pct == 0 {
                2
            } else {
                loss_pct
            };
            drug_loss += loss;
            drug_unpacked.quantity = drug_unpacked.quantity.sub_capped(loss, 0);

            // set drugs
            game_store.drugs.set(drug_unpacked);

            // check if dead

            if game_store.player.is_dead() {
                is_dead = true;
                break;
            }
        } else {
            break;
        };

        if rounds == game_store.game.max_rounds {
            // didnt escaped -> land in random location
            game_store.player.next_location = LocationsRandomizableImpl::random(ref randomizer);
            is_caught = true;
            break;
        }
    };

    let outcome = if is_dead {
        EncounterOutcomes::Died
    } else {
        if !is_caught {
            EncounterOutcomes::Escaped
        } else {
            match encounter.encounter {
                Encounters::Cops => {
                    // Jailed for 2 days
                    turn_loss = 2;
                    game_store
                        .player
                        .turn = game_store
                        .player
                        .turn
                        .add_capped(2, game_store.game.max_turns);
                    EncounterOutcomes::Jailed
                },
                Encounters::Gang => {
                    // Hospitalized for 1 days
                    turn_loss = 1;
                    game_store
                        .player
                        .turn = game_store
                        .player
                        .turn
                        .add_capped(1, game_store.game.max_turns);
                    EncounterOutcomes::Hospitalized
                }
            }
        }
    };

    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: EncounterActions::Run,
        outcome,
        rounds,
        dmg_dealt: 0,
        dmg_taken,
        cash_earnt: 0,
        cash_loss: 0,
        drug_id,
        drug_loss,
        turn_loss,
    }
}

fn on_fight(
    ref game_store: GameStore, ref randomizer: Random, encounter: Encounter
) -> TravelEncounterResult {
    let player_attack: u8 = game_store
        .items
        .get_item(ItemSlot::Weapon)
        .tier
        .stat
        .try_into()
        .unwrap();
    let player_defense: u8 = game_store
        .items
        .get_item(ItemSlot::Clothes)
        .tier
        .stat
        .try_into()
        .unwrap();
    let atk = player_attack / 2;
    let def = player_defense / 10;

    let mut rounds = 0;
    let mut dmg_taken = 0;
    let mut dmg_dealt = 0;
    let mut is_dead = false;

    let mut encounter = encounter;

    // loop until resolution
    loop {
        rounds += 1;

        // player attack 
        encounter.health = encounter.health.sub_capped(atk, 0);
        dmg_dealt += atk;

        // check if encounter is dead
        if encounter.health == 0 {
            break;
        }

        // encounter attack 
        let encounter_atk = encounter.attack.sub_capped(def, 1);
        game_store.player.health = game_store.player.health.sub_capped(encounter_atk, 0);
        dmg_taken += encounter_atk;

        // check if player is dead
        if game_store.player.health == 0 {
            is_dead = true;
            break;
        }
    };

    let cash_earnt = if is_dead {
        0
    } else {
        encounter.payout
    };

    let outcome = if is_dead {
        EncounterOutcomes::Died
    } else {
        EncounterOutcomes::Victorious
    };

    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: EncounterActions::Fight,
        outcome,
        rounds,
        dmg_dealt,
        dmg_taken,
        cash_earnt,
        cash_loss: 0,
        drug_id: 0,
        drug_loss: 0,
        turn_loss: 0,
    }
}

