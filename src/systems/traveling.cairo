use core::traits::TryInto;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random, RandomImpl, RandomTrait}, math::{MathTrait, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{
        hustlers::{HustlerItemConfig,HustlerItemTiersConfig, ItemSlot}, locations::{Locations, LocationsRandomizableImpl},
        game::{GameConfig, GameConfigImpl}
    },
    packing::{
        game_store::{GameStore}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl, ItemsPackedTrait},
        encounters_packed::{Encounters, EncountersPackedImpl, EncountersPackedTrait},
        drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsUnpacked, DrugsPackedTrait}
    },
    systems::game::{EncounterActions, game::TravelEncounterResult, game::Event}
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

    // temp: lvl based on reputation    
    let encounter_level = game_store.player.reputation / 15 + 1;
    
    let health = encounter_level * 5 + turn;
    let attack = encounter_level * 2 + turn / 3;
    
    let payout: u32 = (encounter_level.into() * encounter_level.into() * 4_000)
        + (turn.into() * 1_000);
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

        let mut too_poor_to_get_rekt = false;

        // check min cash if Gang
        if encounter_slot == Encounters::Gang && game_store.player.cash < 100 {
            too_poor_to_get_rekt = true;
        };

        // check min drug if Cops
        if encounter_slot == Encounters::Cops {
            let drugs = game_store.drugs.get();
            if drugs.quantity < 5 {
                too_poor_to_get_rekt = true;
            };
        };

        if (too_poor_to_get_rekt) {
            (false, false)
        } else {
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

            (game_store.player.is_dead(), true)
        }
    } else {
        (false, false)
    }
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


    let result_event = TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: result.action,
        outcome: result.outcome,
        rounds: result.rounds,
        dmg_dealt: result.dmg_dealt,
        dmg_taken: result.dmg_taken,
        cash_earnt: result.cash_earnt,
        cash_loss: result.cash_loss,
        drug_id: result.drug_id,
        drug_loss: result.drug_loss,
        turn_loss: result.turn_loss,
        escaped_with_item: result.escaped_with_item,
        rep_pos: result.rep_pos,
        rep_neg: result.rep_neg,
    };

    emit!(game_store.world, (Event::TravelEncounterResult(result_event)));
    
    let is_dead = game_store.player.is_dead();
    if !is_dead {
        // update encounter level
        // game_store.encounters.increase_encounter_level(encounter_slot);

        // update player status
        game_store.player.status = PlayerStatus::Normal;
    }

    is_dead
}

fn on_pay(
    ref game_store: GameStore, ref randomizer: Random, encounter: Encounter
) -> TravelEncounterResult {
    let mut drug_id: u8 = 0;
    let mut drug_loss: Array<u32> = array![];
    let mut cash_loss: u32 = 0;
    let mut dmg_taken: Array<(u8,u8)> = array![];
    let mut rep_neg: u8 = 0;

    let game_config = GameConfigImpl::get(game_store.world);

    match encounter.encounter {
        Encounters::Cops => {
            // pay demand_pct drugs
            let mut drug_unpacked = game_store.drugs.get();
            let quantity_lost = drug_unpacked.quantity.pct(encounter.demand_pct.into());
            drug_id = drug_unpacked.drug.into();
            drug_loss.append(quantity_lost);
            drug_unpacked.quantity -= quantity_lost;

            // set drugs
            game_store.drugs.set(drug_unpacked);

            // loss rep
            rep_neg = game_config.rep_pay_cops;
        
        },
        Encounters::Gang => {
            // calc cash_loss
            cash_loss = game_store.player.cash.pct(encounter.demand_pct.into());
           
            // gang make u lose 1 extra hp (but can't die)
            if game_store.player.health > 1 {
                // update player health
                game_store.player.health -= 1;
                dmg_taken.append((1,0));
            }

            // update player cash
            game_store.player.cash -= cash_loss;

            // loss rep
            rep_neg = game_config.rep_pay_gang;
        },
    };

    // apply rep_neg
    game_store.player.reputation = game_store.player.reputation.sub_capped(rep_neg,0);

    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: EncounterActions::Pay,
        outcome: EncounterOutcomes::Paid,
        rounds: 0,
        dmg_dealt: array![],
        dmg_taken,
        cash_earnt: 0,
        cash_loss,
        drug_id,
        drug_loss,
        turn_loss: 0,
        escaped_with_item: false,
        rep_pos: 0,
        rep_neg,
    }
}


fn on_run(
    ref game_store: GameStore, ref randomizer: Random, encounter: Encounter
) -> TravelEncounterResult {
    // TODO: make configurable
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
    let mut dmg_taken = array![];
    let mut drug_loss: Array<u32> = array![];
    let mut turn_loss = 0;
    let mut is_dead = false;
    let mut is_caught = false;
    let mut escaped_with_item = false;
    
    let initial_tier_defense: u8 = (get!(game_store.world, (ItemSlot::Clothes, 1), (HustlerItemTiersConfig)).stat / 10).try_into().unwrap();
    let def = player_defense / 10;

    // loop until resolution
    loop {
        rounds += 1;

        let rand_0_99 = randomizer.between::<u8>(0,100);
        let is_captured = rand_0_99 < capture_rate;

        if is_captured {
            //encounter___attack = encounter_level * 2 + turn / 3;

            // reduce attack with defense
            let health_loss = encounter.attack.sub_capped(def, 1);
            let health_saved = def - initial_tier_defense;

            // take dmgs
            game_store.player.health = game_store.player.health.sub_capped(health_loss, 0);
            //dmg_taken += health_loss;
            dmg_taken.append((health_loss, health_saved));

            // loss a 2 or 1% drug each round xd
            let loss_pct = drug_unpacked.quantity.pct(1);
            let loss = if loss_pct == 0 {
                2
            } else {
                loss_pct
            };
            drug_loss.append(loss);
            drug_unpacked.quantity = drug_unpacked.quantity.sub_capped(loss, 0);

            // set drugs
            game_store.drugs.set(drug_unpacked);

            // check if dead

            if game_store.player.is_dead() {
                is_dead = true;
                break;
            }
        } else {
            escaped_with_item = rand_0_99 <= player_speed;
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

    // reputation
    let game_config = GameConfigImpl::get(game_store.world);
    let rep_pos = match encounter.encounter {
        Encounters::Cops => { game_config.rep_run_cops },
        Encounters::Gang => { game_config.rep_run_gang },
    };

    game_store.player.reputation = game_store.player.reputation.add_capped(rep_pos,100);

    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        action: EncounterActions::Run,
        outcome,
        rounds,
        dmg_dealt: array![],
        dmg_taken,
        cash_earnt: 0,
        cash_loss: 0,
        drug_id,
        drug_loss,
        turn_loss,
        escaped_with_item,
        rep_pos,
        rep_neg: 0,
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

    let initial_tier_attack: u8 = (get!(game_store.world, (ItemSlot::Weapon, 1), (HustlerItemTiersConfig)).stat / 2).try_into().unwrap();
    let initial_tier_defense: u8 = (get!(game_store.world, (ItemSlot::Clothes, 1), (HustlerItemTiersConfig)).stat / 10).try_into().unwrap();

    let atk = player_attack / 2;
    let def = player_defense / 10;

    let mut rounds = 0;
    let mut dmg_taken: Array<(u8,u8)> = array![];
    let mut dmg_dealt: Array<(u8,u8)> = array![];
    let mut is_dead = false;
  
    let mut encounter = encounter;

    // loop until resolution
    loop {
        rounds += 1;

        // player attack 
        encounter.health = encounter.health.sub_capped(atk, 0);
        dmg_dealt.append((atk, atk - initial_tier_attack));

        // check if encounter is dead
        if encounter.health == 0 {
            break;
        }

        // encounter attack 
        let encounter_atk = encounter.attack.sub_capped(def, 1);
        game_store.player.health = game_store.player.health.sub_capped(encounter_atk, 0);
        dmg_taken.append((encounter_atk, def - initial_tier_defense));

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

    // player get money
    game_store.player.cash += cash_earnt;

    let outcome = if is_dead {
        EncounterOutcomes::Died
    } else {
        EncounterOutcomes::Victorious
    };

    // reputation
    let game_config = GameConfigImpl::get(game_store.world);
    let rep_pos = match encounter.encounter {
        Encounters::Cops => { game_config.rep_fight_cops },
        Encounters::Gang => { game_config.rep_fight_gang },
    };

    game_store.player.reputation = game_store.player.reputation.add_capped(rep_pos,100);

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
        drug_loss: array![],
        turn_loss: 0,
        escaped_with_item: false,
        rep_pos,
        rep_neg: 0,
    }
}

