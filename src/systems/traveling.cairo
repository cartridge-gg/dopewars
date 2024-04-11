use core::traits::TryInto;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game, GameMode},
    utils::{
        random::{Random, RandomImpl, RandomTrait}, math::{MathTrait, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{
        hustlers::{HustlerItemConfig,HustlerItemTiersConfig, ItemSlot}, locations::{Locations, LocationsRandomizableImpl},
        encounters::{Encounters, EncounterImpl, EncounterConfig},
        game::{GameConfig, GameConfigImpl}, 
    },
    packing::{
        game_store::{GameStore}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl, ItemsPackedTrait},
        drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsUnpacked, DrugsPackedTrait}
    },
    systems::game::{EncounterActions, game::TravelEncounter, game::TravelEncounterResult}
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


// #[generate_trait]
// impl EncounterImpl of EncounterTrait {
//     fn get_first_strike_dmg(self: Encounter) -> u8 {
//         if self.attack < 3 {
//             1
//         } else {
//             self.attack / 3
//         }
//     }
// }

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

fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> (bool, bool) {
    let has_encounter = match game_store.game.game_mode {
        GameMode::Dealer => {
            // get wanted level at destination 0-7
            let wanted_risk = game_store.wanted.get_wanted_risk(game_store.player.next_location);
            randomizer.occurs(wanted_risk)
        },
        GameMode::Warrior => {
            true
        }
    };

    if has_encounter {
        // get encounter
        let encounter = EncounterImpl::get_encounter(ref game_store);

        // update player status
        game_store.player.status = match encounter.encounter {
            Encounters::Cops => PlayerStatus::BeingArrested,
            Encounters::Gang => PlayerStatus::BeingMugged,
        };

        // // player lose health
        // let health_loss = encounter.get_first_strike_dmg();
        // game_store.player.health = game_store.player.health.sub_capped(health_loss, 0);

        emit!(game_store.world, (rollyourown::systems::game::game::Event::TravelEncounter(
            TravelEncounter {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                encounter_id: encounter.id,
                health_loss: 0,
                }
        )));

        (game_store.player.is_dead(), true)
    } else {
        (false, false)
    }
}


fn decide(ref game_store: GameStore, ref randomizer: Random, action: EncounterActions) -> bool {
    // get encounter
    let encounter = EncounterImpl::get_encounter(ref game_store);

    // run action
    let result = match action {
        EncounterActions::Run => { on_run(ref game_store, ref randomizer, encounter) },
        EncounterActions::Pay => { on_pay(ref game_store, ref randomizer, encounter) },
        EncounterActions::Fight => { on_fight(ref game_store, ref randomizer, encounter) },
    };

    // calc reputation
    let mut rep_pos = result.rep_pos;
    let mut rep_neg = result.rep_neg;

    if game_store.game.game_mode == GameMode::Warrior {
        rep_pos = rep_pos * 2;
        rep_neg = rep_neg * 2;
    };

    // update reputation
    game_store.player.reputation = game_store.player.reputation.add_capped(rep_pos,100);
    game_store.player.reputation = game_store.player.reputation.sub_capped(rep_neg,0);


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
        rep_pos: rep_pos,
        rep_neg: rep_neg,
    };

    emit!(game_store.world, (rollyourown::systems::game::game::Event::TravelEncounterResult(result_event)));
    
    if !game_store.player.is_dead() {
        // update player status
        game_store.player.status = PlayerStatus::Normal;
    }

    game_store.player.is_dead()
}

fn on_pay(
    ref game_store: GameStore, ref randomizer: Random, encounter: EncounterConfig
) -> TravelEncounterResult {
    let mut drug_id: u8 = 0;
    let mut drug_loss: Array<u32> = array![];
    let mut cash_loss: u32 = 0;
    let mut dmg_taken: Array<(u8,u8)> = array![];

    match encounter.encounter {
        Encounters::Cops => {
            // pay demand_pct drugs
            let mut drug_unpacked = game_store.drugs.get();
            let quantity_lost = drug_unpacked.quantity.pct(encounter.demand_pct.into());
           
            // can't pay
            assert(quantity_lost > 0, 'you cant pay!');
           
            drug_id = drug_unpacked.drug.into();
            drug_loss.append(quantity_lost);
            drug_unpacked.quantity -= quantity_lost;

            // set drugs
            game_store.drugs.set(drug_unpacked);
        },
        Encounters::Gang => {
            // calc cash_loss
            cash_loss = game_store.player.cash.pct(encounter.demand_pct.into());

            // can't pay
            assert(cash_loss > 0, 'you cant pay!');
           
            // gang make u lose 1 extra hp (but can't die)
            if game_store.player.health > 1 {
                // update player health
                game_store.player.health -= 1;
                dmg_taken.append((1,0));
            }

            // update player cash
            game_store.player.cash -= cash_loss;
        },
    };

    // loss rep
    let mut rep_neg = encounter.rep_pay;
  
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
        rep_pos: 0,
        rep_neg,
    }
}


fn on_run(
    ref game_store: GameStore, ref randomizer: Random, encounter: EncounterConfig
) -> TravelEncounterResult {
    let player_defense: u8 = game_store
        .items
        .get_item(ItemSlot::Clothes)
        .tier
        .stat
        .try_into()
        .unwrap();

    let player_speed: u8 = game_store.items.get_item(ItemSlot::Feet).tier.stat.try_into().unwrap();
    let encounter_speed = encounter.speed;

    let mut drug_unpacked = game_store.drugs.get();
    let drug_id: u8 = drug_unpacked.drug.into();

    let mut rounds = 0;
    let mut dmg_taken = array![];
    let mut drug_loss: Array<u32> = array![];
    let mut turn_loss = 0;
    let mut is_caught = false;
    
    let initial_tier_defense: u8 = (get!(game_store.world, (ItemSlot::Clothes, 1), (HustlerItemTiersConfig)).stat / 10).try_into().unwrap();
    let def = player_defense / 10;

    // loop until resolution
    loop {
        rounds += 1;

        let rand_player = randomizer.between::<u8>(0,player_speed);
        let rand_encounter = randomizer.between::<u8>(0,encounter_speed);

        let is_captured = rand_player <= rand_encounter;

        if is_captured {

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

    let game_config = GameConfigImpl::get(game_store.world);
    let mut rep_pos = 0;
    let mut rep_neg = 0;

    let outcome = if game_store.player.is_dead() {
        EncounterOutcomes::Died
    } else {
        if !is_caught {
            rep_pos += encounter.rep_run;
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

                    // REP +2
                    rep_pos += game_config.rep_jailed;
                    rep_neg += encounter.rep_run;

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
                    
                    // REP +2
                    rep_pos += game_config.rep_hospitalized;
                    rep_neg += encounter.rep_run;

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
        dmg_dealt: array![],
        dmg_taken,
        cash_earnt: 0,
        cash_loss: 0,
        drug_id,
        drug_loss,
        turn_loss,
        rep_pos,
        rep_neg,
    }
}

fn on_fight(
    ref game_store: GameStore, ref randomizer: Random, encounter: EncounterConfig
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
        if game_store.player.is_dead() {
            break;
        }
    };

    let cash_earnt = if game_store.player.is_dead() {
        0
    } else {
        encounter.payout
    };

    // player get money
    game_store.player.cash += cash_earnt;

    let outcome = if game_store.player.is_dead() {
        EncounterOutcomes::Died
    } else {
        EncounterOutcomes::Victorious
    };

    let mut rep_pos = encounter.rep_fight;

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
        rep_pos,
        rep_neg: 0,
    }
}

