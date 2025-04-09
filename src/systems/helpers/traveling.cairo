use achievement::store::{Store as BushidoStore, StoreTrait as BushidoStoreTrait};
use dojo::event::EventStorage;
use dojo::meta::introspect::Introspect;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::elements::quests::{types::{Quest, QuestTrait}};

use rollyourown::{
    models::game::{Game, GameMode, GameTrait},
    utils::{
        random::{Random, RandomImpl, RandomTrait}, math::{MathTrait, MathImpl, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{
        hustlers::{HustlerItemConfig, HustlerItemTiersConfig, ItemSlot},
        locations::{Locations, LocationsRandomizableImpl},
        encounters::{Encounters, EncounterSpawnerImpl, EncounterConfig, EncounterImpl},
        game::{GameConfig}, settings::{SeasonSettings}
    },
    packing::{
        game_store::{GameStore, GameStoreImpl, GameStoreTrait}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl},
        items_packed::{ItemsPackedImpl, ItemsPackedTrait},
        drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsUnpacked, DrugsPackedTrait}
    },
    systems::game::{EncounterActions,}, store::{Store, StoreImpl, StoreTrait},
    events::{TravelEncounter, TravelEncounterResult}
};


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum EncounterOutcomes {
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

//
//
//

// -> (is_dead, has_encounter)
fn on_travel(
    ref game_store: GameStore, ref season_settings: SeasonSettings, ref randomizer: Random
) -> (bool, bool) {
    let has_encounter = match game_store.game.game_mode {
        GameMode::Ranked |
        GameMode::Noob => {
            // get wanted level at destination 0-7
            let wanted_risk = game_store.get_wanted_risk(game_store.player.next_location);
            randomizer.occurs(wanted_risk)
        },
        GameMode::Warrior => { true }
    };

    if has_encounter {
        // get encounter
        let encounter = EncounterSpawnerImpl::get_encounter(ref game_store, ref season_settings);

        // update player status
        game_store.player.status = match encounter.encounter {
            Encounters::Cops => PlayerStatus::BeingArrested,
            Encounters::Gang => PlayerStatus::BeingMugged,
        };

        game_store
            .store
            .world
            .emit_event(
                @TravelEncounter {
                    game_id: game_store.game.game_id,
                    player_id: game_store.game.player_id,
                    turn: game_store.player.turn,
                    encounter: encounter.encounter.into(),
                    level: encounter.level,
                    health: encounter.health,
                    attack: encounter.attack,
                    defense: encounter.defense,
                    speed: encounter.speed,
                    demand_pct: encounter.get_demand_pct(ref game_store),
                    payout: encounter.get_payout(ref game_store),
                }
            );

        (game_store.player.is_dead(), true)
    } else {
        (false, false)
    }
}

//
//  DECIDE
//

fn decide(
    ref game_store: GameStore,
    ref season_settings: SeasonSettings,
    ref randomizer: Random,
    action: EncounterActions
) -> bool {
    // get encounter
    let mut encounter = EncounterSpawnerImpl::get_encounter(ref game_store, ref season_settings);

    // run action
    let mut result: TravelEncounterResult = match action {
        EncounterActions::Run => { on_run(ref game_store, ref randomizer, ref encounter) },
        EncounterActions::Pay => { on_pay(ref game_store, ref randomizer, ref encounter) },
        EncounterActions::Fight => { on_fight(ref game_store, ref randomizer, ref encounter) },
    };

    if game_store.game.game_mode == GameMode::Warrior {
        result.rep_pos = result.rep_pos * 2;
        result.rep_neg = result.rep_neg * 2;
    };

    // update reputation
    game_store.player.reputation = game_store.player.reputation.add_capped(result.rep_pos, 100);
    game_store.player.reputation = game_store.player.reputation.sub_capped(result.rep_neg, 0);

    // update turns with turn_loss
    game_store
        .player
        .turn = game_store
        .player
        .turn
        .add_capped(result.turn_loss, game_store.game_config().max_turns);

    // emit TravelEncounterResult
    game_store.store.world.emit_event(@result);

    if game_store.game.is_ranked() {
        let bushido_store = BushidoStoreTrait::new(game_store.store.world);
        let player_id: felt252 = game_store.game.player_id.into();

        if result.outcome == EncounterOutcomes::Jailed {
            let quest_id = Quest::Jailbird.identifier(0);
            bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());
        } else if result.outcome == EncounterOutcomes::Died {
            let quest_id = Quest::Rip.identifier(0);
            bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());
        } else if result.outcome == EncounterOutcomes::Escaped {
            let quest_id = Quest::Escape.identifier(0);
            bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());
        } else if result.outcome == EncounterOutcomes::Victorious {
            if encounter.encounter == Encounters::Cops {
                let quest_id = Quest::Cops.identifier(0);
                bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());

                if encounter.level == 6 {
                    let quest_id = Quest::BrawlerC.identifier(0);
                    bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());
                }
            }

            if encounter.encounter == Encounters::Gang {
                let quest_id = Quest::Gangs.identifier(0);
                bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());

                if encounter.level == 6 {
                    let quest_id = Quest::BrawlerG.identifier(0);
                    bushido_store.progress(player_id, quest_id, 1, starknet::get_block_timestamp());
                }
            }
        }
    }

    if !game_store.player.is_dead() {
        // update player status
        game_store.player.status = PlayerStatus::Normal;
    }

    game_store.player.is_dead()
    // game_store
}

//
//
//

fn create_travel_encounter_result(
    ref game_store: GameStore, action: EncounterActions
) -> TravelEncounterResult {
    TravelEncounterResult {
        game_id: game_store.game.game_id,
        player_id: game_store.game.player_id,
        turn: game_store.player.turn,
        action: action,
        outcome: EncounterOutcomes::Paid, // must be overrided after
        rounds: 0,
        dmg_dealt: array![], // Array<(u8,u8)> ?
        dmg_taken: array![], // Array<(u8,u8)>
        cash_earnt: 0,
        cash_loss: 0,
        drug_id: 0,
        drug_loss: array![], // Array<u32>
        turn_loss: 0,
        rep_pos: 0,
        rep_neg: 0,
    }
}


//
//  ON PAY
//

fn on_pay(
    ref game_store: GameStore, ref randomizer: Random, ref encounter: EncounterConfig
) -> TravelEncounterResult {
    let mut result: TravelEncounterResult = create_travel_encounter_result(
        ref game_store, EncounterActions::Pay
    );

    result.outcome = EncounterOutcomes::Paid;
    result.rep_neg = encounter.rep_pay;

    match encounter.encounter {
        Encounters::Cops => {
            // pay demand_pct drugs
            let mut drug_unpacked = game_store.drugs.get();
            let quantity_lost = drug_unpacked
                .quantity
                .pct(encounter.get_demand_pct(ref game_store).into());

            // can't pay
            assert(quantity_lost > 0, 'you cant pay!');

            result.drug_id = drug_unpacked.drug.into();
            result.drug_loss.append(quantity_lost);
            drug_unpacked.quantity -= quantity_lost;

            // set drugs
            game_store.drugs.set(drug_unpacked);
        },
        Encounters::Gang => {
            // calc cash_loss
            result
                .cash_loss = game_store
                .player
                .cash
                .pct(encounter.get_demand_pct(ref game_store).into());

            // can't pay
            assert(result.cash_loss > 0, 'you cant pay!');

            // gang make u lose 1 extra hp (but can't die)
            if game_store.player.health > 1 {
                // update player health
                game_store.player.health -= 1;
                result.dmg_taken.append((1, 0));
            }

            // update player cash
            game_store.player.cash -= result.cash_loss;
        },
    };

    result
}

//
//  ON RUN
//

fn on_run(
    ref game_store: GameStore, ref randomizer: Random, ref encounter: EncounterConfig
) -> TravelEncounterResult {
    let mut result = create_travel_encounter_result(ref game_store, EncounterActions::Run);

    let mut drug_unpacked = game_store.drugs.get();
    result.drug_id = drug_unpacked.drug.into();

    let mut is_caught = false;

    // loop until resolution
    loop {
        result.rounds += 1;

        let is_captured =
            match ResolutionImpl::race(ref game_store, ref encounter, ref randomizer).winner {
            Fighters::Hustler => { false },
            Fighters::Encounter => { true },
        };

        if is_captured {
            let encounter_win_result = ResolutionImpl::encounter_race_win(
                ref game_store, ref encounter, ref randomizer, ref drug_unpacked
            );

            result
                .dmg_taken
                .append((encounter_win_result.dmg_dealt, encounter_win_result.dmg_shield));
            result.drug_loss.append(encounter_win_result.drug_loss);

            // check if dead
            if encounter_win_result.killed {
                break;
            }
        } else {
            break;
        };

        if result.rounds == game_store.game_config().max_rounds {
            // didnt escaped -> land in random location
            game_store.player.next_location = LocationsRandomizableImpl::random(ref randomizer);
            is_caught = true;
            break;
        }
    };

    let game_config = game_store.game_config();

    result
        .outcome =
            if game_store.player.is_dead() {
                EncounterOutcomes::Died
            } else {
                if !is_caught {
                    result.rep_pos += encounter.rep_run;
                    EncounterOutcomes::Escaped
                } else {
                    match encounter.encounter {
                        Encounters::Cops => {
                            // Jailed for 2 days
                            result.turn_loss = 2;

                            // REP +2
                            result.rep_pos += game_config.rep_jailed;
                            result.rep_neg += encounter.rep_run;

                            EncounterOutcomes::Jailed
                        },
                        Encounters::Gang => {
                            // Hospitalized for 1 days
                            result.turn_loss = 1;

                            // REP +2
                            result.rep_pos += game_config.rep_hospitalized;
                            result.rep_neg += encounter.rep_run;

                            EncounterOutcomes::Hospitalized
                        }
                    }
                }
            };

    result
}

//
//  ON FIGHT
//

fn on_fight(
    ref game_store: GameStore, ref randomizer: Random, ref encounter: EncounterConfig
) -> TravelEncounterResult {
    let mut result = create_travel_encounter_result(ref game_store, EncounterActions::Fight);

    let initiator = ResolutionImpl::race(ref game_store, ref encounter, ref randomizer).winner;

    // loop until resolution
    loop {
        result.rounds += 1;

        match initiator {
            Fighters::Hustler => {
                let hustler_result = ResolutionImpl::hustler_attack(
                    ref game_store, ref encounter, ref randomizer
                );
                result.dmg_dealt.append((hustler_result.dmg_dealt, hustler_result.dmg_shield));
                if hustler_result.killed {
                    break;
                }

                let encounter_result = ResolutionImpl::encounter_attack(
                    ref game_store, ref encounter, ref randomizer
                );
                result.dmg_taken.append((encounter_result.dmg_dealt, encounter_result.dmg_shield));
                if encounter_result.killed {
                    break;
                }
            },
            Fighters::Encounter => {
                let encounter_result = ResolutionImpl::encounter_attack(
                    ref game_store, ref encounter, ref randomizer
                );
                result.dmg_taken.append((encounter_result.dmg_dealt, encounter_result.dmg_shield));
                if encounter_result.killed {
                    break;
                }

                let hustler_result = ResolutionImpl::hustler_attack(
                    ref game_store, ref encounter, ref randomizer
                );
                result.dmg_dealt.append((hustler_result.dmg_dealt, hustler_result.dmg_shield));
                if hustler_result.killed {
                    break;
                }
            },
        };
    };

    result
        .cash_earnt =
            if game_store.player.is_dead() {
                0
            } else {
                encounter.get_payout(ref game_store)
            };

    // player get money
    game_store.player.cash += result.cash_earnt;

    result
        .outcome =
            if game_store.player.is_dead() {
                EncounterOutcomes::Died
            } else {
                EncounterOutcomes::Victorious
            };

    // reputation
    result.rep_pos = encounter.rep_fight;

    result
}


//
//
//

#[derive(Copy, Drop, Serde, PartialEq)]
enum Fighters {
    Hustler,
    Encounter,
}

#[derive(Copy, Drop)]
struct RaceResult {
    winner: Fighters,
}

#[derive(Copy, Drop)]
struct AttackResult {
    dmg_dealt: u8,
    dmg_shield: u8,
    killed: bool,
}

#[derive(Copy, Drop)]
struct EncounterRaceWinResult {
    dmg_dealt: u8,
    dmg_shield: u8,
    killed: bool,
    drug_loss: u32,
}


#[generate_trait]
impl ResolutionImpl of ResolutionTrait {
    fn plus_or_less_random_pct(value: u8, pct: u8, ref randomizer: Random) -> u8 {
        let value_pct = value.pct(pct.into());
        let rand = randomizer.between::<u8>(0, value_pct * 2);

        value + rand - value_pct
    }

    fn race(
        ref game_store: GameStore, ref encounter: EncounterConfig, ref randomizer: Random
    ) -> RaceResult {
        let rand_player = randomizer.between::<u8>(0, game_store.items.speed());
        let rand_encounter = randomizer.between::<u8>(0, encounter.speed);

        match rand_player <= rand_encounter {
            true => { RaceResult { winner: Fighters::Encounter } },
            false => { RaceResult { winner: Fighters::Hustler } },
        }
    }

    fn hustler_attack(
        ref game_store: GameStore, ref encounter: EncounterConfig, ref randomizer: Random
    ) -> AttackResult {
        let hustler_attack: u8 = Self::plus_or_less_random_pct(
            game_store.items.attack(), 20, ref randomizer
        );

        let dmg_shield = hustler_attack.pct(encounter.defense.into());
        let dmg_dealt = hustler_attack - dmg_shield;

        // encounter lose HP
        encounter.health_loss(dmg_dealt);

        AttackResult { dmg_dealt, dmg_shield, killed: encounter.is_dead() }
    }

    fn encounter_attack(
        ref game_store: GameStore, ref encounter: EncounterConfig, ref randomizer: Random
    ) -> AttackResult {
        let mut encounter_attack = Self::plus_or_less_random_pct(
            encounter.attack, 20, ref randomizer
        );

        encounter_attack = encounter.attack / 3; // TODO: config ***
        let hustler_defense = game_store.items.defense();

        let dmg_shield = encounter_attack.pct(hustler_defense.into());
        let dmg_dealt = encounter_attack - dmg_shield;

        // player lose HP
        game_store.player.health_loss(dmg_dealt);

        AttackResult { dmg_dealt, dmg_shield, killed: game_store.player.is_dead() }
    }

    fn encounter_race_win(
        ref game_store: GameStore,
        ref encounter: EncounterConfig,
        ref randomizer: Random,
        ref drug_unpacked: DrugsUnpacked
    ) -> EncounterRaceWinResult {
        let mut encounter_attack = Self::plus_or_less_random_pct(
            encounter.attack, 20, ref randomizer
        );

        encounter_attack = encounter.attack / 5; // TODO: config ***
        let hustler_defense = game_store.items.defense();

        let dmg_shield = encounter_attack.pct(hustler_defense.into());
        let dmg_dealt = encounter_attack - dmg_shield;

        // player lose HP
        game_store.player.health_loss(dmg_dealt);

        // loss a 2 or 1% drug each round xd
        let loss_pct = drug_unpacked.quantity.pct(1);
        let possible_drug_loss = MathImpl::max(loss_pct, 2);
        let mut drug_loss = 0;

        if possible_drug_loss <= drug_unpacked.quantity {
            drug_unpacked.quantity -= possible_drug_loss;
            drug_loss = possible_drug_loss;
        };

        // set drugs
        game_store.drugs.set(drug_unpacked);

        EncounterRaceWinResult {
            dmg_dealt, dmg_shield, killed: game_store.player.is_dead(), drug_loss,
        }
    }
}
