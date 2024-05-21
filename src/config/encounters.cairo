use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::{game::{GameConfig}, settings::{SeasonSettings, EncountersMode, EncountersOddsMode}},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl},
        bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}
    },
    packing::{game_store::{GameStore},},
    library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
};


#[derive(Model, Copy, Drop, Serde)]
struct EncounterStatsConfig {
    #[key]
    encounter: Encounters,
    #[key]
    encounters_mode: EncountersMode,
    //
    health_base: u8,
    health_step: u8,
    attack_base: u8,
    attack_step: u8,
    defense_base: u8,
    defense_step: u8,
    speed_base: u8,
    speed_step: u8,
}


fn initialize_encounter_stats_config(s: IStoreLibraryDispatcher) {
    // Chill

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Cops,
                encounters_mode: EncountersMode::Chill,
                health_base: 12 - 2,
                health_step: 8 - 2,
                attack_base: 14 - 2,
                attack_step: 8 - 2,
                defense_base: 16 - 2,
                defense_step: 9 - 2,
                speed_base: 6 - 2,
                speed_step: 8 - 2,
            }
        );

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Gang,
                encounters_mode: EncountersMode::Chill,
                health_base: 1,
                health_step: 11 - 2,
                attack_base: 5,
                attack_step: 11 - 2,
                defense_base: 7,
                defense_step: 8 - 2,
                speed_base: 2,
                speed_step: 8 - 2,
            }
        );

    // NoJokes

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Cops,
                encounters_mode: EncountersMode::NoJokes,
                health_base: 12,
                health_step: 8,
                attack_base: 14,
                attack_step: 8,
                defense_base: 16,
                defense_step: 9,
                speed_base: 6,
                speed_step: 8,
            }
        );

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Gang,
                encounters_mode: EncountersMode::NoJokes,
                health_base: 1,
                health_step: 11,
                attack_base: 5,
                attack_step: 11,
                defense_base: 7,
                defense_step: 8,
                speed_base: 2,
                speed_step: 8,
            }
        );

    // UltraViolence

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Cops,
                encounters_mode: EncountersMode::UltraViolence,
                health_base: 12 + 2,
                health_step: 8 + 2,
                attack_base: 14 + 2,
                attack_step: 8 + 2,
                defense_base: 16 + 2,
                defense_step: 9 + 2,
                speed_base: 6 + 2,
                speed_step: 8 + 2,
            }
        );

    s
        .save_encounter_stats_config(
            EncounterStatsConfig {
                encounter: Encounters::Gang,
                encounters_mode: EncountersMode::UltraViolence,
                health_base: 1 + 3,
                health_step: 11 + 3,
                attack_base: 5 + 3,
                attack_step: 11 + 3,
                defense_base: 7 + 3,
                defense_step: 8 + 3,
                speed_base: 2 + 3,
                speed_step: 8 + 3,
            }
        );
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

#[derive(Copy, Drop, Serde)]
struct EncounterConfig {
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
}


// 
//
//

#[generate_trait]
impl EncounterSpawnerImpl of EncounterSpawnerTrait {
    fn get_encounter_level(ref season_settings: SeasonSettings, reputation: u8) -> u8 {
        let level = match season_settings.encounters_odds_mode {
            EncountersOddsMode::Easy => { reputation / 20 + 1 },
            EncountersOddsMode::Normal => { reputation / 16 + 1 },
            EncountersOddsMode::Hard => { reputation / 12 + 1 },
        };

        MathImplU8::min(6, level)
    }

    fn get_encounter(
        ref game_store: GameStore, ref season_settings: SeasonSettings
    ) -> EncounterConfig {
        let level = EncounterSpawnerImpl::get_encounter_level(
            ref season_settings, game_store.player.reputation
        );

        let rand_from_game_store: u256 = pedersen::pedersen(
            game_store.markets.packed, game_store.markets.packed
        )
            .into() % 2;

        let rand_felt252: felt252 = rand_from_game_store.try_into().unwrap(); 

        let encounter_type = match rand_felt252 {
            0 => Encounters::Cops,
            _ => Encounters::Gang,
        };

        let mut encounter_stats = game_store
            .s
            .encounter_stats_config(encounter_type, season_settings.encounters_mode);

        //   let mut encounter = game_store.s.encounter_config(rand_id);

        let encounter = EncounterConfig {
            encounter: encounter_type,
            //
            level,
            health: encounter_stats.health_base + level * encounter_stats.health_step,
            attack: encounter_stats.attack_base + level * encounter_stats.attack_step,
            defense: encounter_stats.defense_base + level * encounter_stats.defense_step,
            speed: encounter_stats.speed_base + level * encounter_stats.speed_step,
            //
            rep_pay: level, // reputation modifier for paying NEGATIVE
            rep_run: level
                / 2, // reputation modifier for running POSITIVE(success) or NEGATIVE(fail)
            rep_fight: level, // reputation modifier for fighting
        };

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

