use rollyourown::{
    config::{game::{GameConfig}}, traits::{Enumerable, RandomizableImpl},
    utils::random::{Random, RandomImpl},
};

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct SeasonSettings {
    #[key]
    pub season_version: u16,
    pub cash_mode: CashMode,
    pub health_mode: HealthMode,
    pub turns_mode: TurnsMode,
    //
    pub encounters_mode: EncountersMode,
    pub encounters_odds_mode: EncountersOddsMode,
    pub drugs_mode: DrugsMode,
    pub wanted_mode: WantedMode,
}


#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum CashMode {
    Broke,
    Average,
    Rich,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum HealthMode {
    Junkie,
    Hustler,
    Streetboss,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum TurnsMode {
    OnSpeed,
    OnWeed,
    OnMush,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum EncountersMode {
    Chill,
    NoJokes,
    UltraViolence,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum EncountersOddsMode {
    Easy,
    Normal,
    Hard,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum DrugsMode {
    Cheap,
    Normal,
    Expensive,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum WantedMode {
    KoolAndTheGang,
    ThugLife,
    MostWanted,
}


#[generate_trait]
pub impl SeasonSettingsImpl of SeasonSettingsTrait {
    fn random(ref randomizer: Random, season_version: u16) -> SeasonSettings {
        SeasonSettings {
            season_version,
            cash_mode: RandomizableImpl::<CashMode>::random(ref randomizer),
            health_mode: RandomizableImpl::<HealthMode>::random(ref randomizer),
            turns_mode: RandomizableImpl::<TurnsMode>::random(ref randomizer),
            encounters_mode: RandomizableImpl::<EncountersMode>::random(ref randomizer),
            encounters_odds_mode: RandomizableImpl::<EncountersOddsMode>::random(ref randomizer),
            drugs_mode: RandomizableImpl::<DrugsMode>::random(ref randomizer),
            wanted_mode: RandomizableImpl::<WantedMode>::random(ref randomizer),
        }
    }


    fn build_game_config(self: SeasonSettings) -> GameConfig {
        GameConfig {
            season_version: self.season_version,
            cash: self.get_initial_cash(),
            health: self.get_initial_health(),
            max_turns: self.get_max_turns(),
            //
            max_wanted_shopping: 5,
            max_rounds: 3,
            //
            rep_drug_step: 20,
            rep_buy_item: 3,
            rep_carry_drugs: 2,
            rep_hospitalized: 4,
            rep_jailed: 6,
        }
    }

    //
    // Game params
    //

    fn get_initial_cash(self: SeasonSettings) -> u32 {
        // 42_000
        match self.cash_mode {
            CashMode::Broke => { 420 },
            CashMode::Average => { 1000 },
            CashMode::Rich => { 2600 },
        }
    }

    fn get_initial_health(self: SeasonSettings) -> u8 {
        5
        // match self.health_mode {
        //     HealthMode::Junkie => { 70 },
        //     HealthMode::Hustler => { 90 },
        //     HealthMode::Streetboss => { 110 },
        // }
    }

    fn get_max_turns(self: SeasonSettings) -> u8 {
        6
    //     match self.turns_mode {
    //     TurnsMode::OnSpeed => { 15 },
    //     TurnsMode::OnWeed => { 18 },
    //     TurnsMode::OnMush => { 21 },
    // }
    }

    //
    // Wanted Params
    //

    fn get_wanted_risk_modifier(self: SeasonSettings) -> u8 {
        match self.wanted_mode {
            WantedMode::KoolAndTheGang => { 20 },
            WantedMode::ThugLife => { 15 },
            WantedMode::MostWanted => { 10 },
        }
    }

    fn get_wanted_travel_back_modifier(self: SeasonSettings) -> u8 {
        match self.wanted_mode {
            WantedMode::KoolAndTheGang => { 2 },
            WantedMode::ThugLife => { 3 },
            WantedMode::MostWanted => { 4 },
        }
    }

    fn get_wanted_leave_with_drug_modifier(self: SeasonSettings) -> u8 {
        match self.wanted_mode {
            WantedMode::KoolAndTheGang => { 5 },
            WantedMode::ThugLife => { 5 },
            WantedMode::MostWanted => { 6 },
        }
    }
}


//
//
//

pub impl CashModeEnumerableImpl of Enumerable<CashMode> {
    fn all() -> Span<CashMode> {
        array![CashMode::Broke, CashMode::Average, CashMode::Rich].span()
    }
}

pub impl HealthModeEnumerableImpl of Enumerable<HealthMode> {
    fn all() -> Span<HealthMode> {
        array![HealthMode::Junkie, HealthMode::Hustler, HealthMode::Streetboss].span()
    }
}

pub impl TurnsModeEnumerableImpl of Enumerable<TurnsMode> {
    fn all() -> Span<TurnsMode> {
        array![TurnsMode::OnSpeed, TurnsMode::OnWeed, TurnsMode::OnMush].span()
    }
}

pub impl EncountersModeEnumerableImpl of Enumerable<EncountersMode> {
    fn all() -> Span<EncountersMode> {
        array![EncountersMode::Chill, EncountersMode::NoJokes, EncountersMode::UltraViolence].span()
    }
}

pub impl EncountersOddsModeEnumerableImpl of Enumerable<EncountersOddsMode> {
    fn all() -> Span<EncountersOddsMode> {
        array![EncountersOddsMode::Easy, EncountersOddsMode::Normal, EncountersOddsMode::Hard]
            .span()
    }
}

pub impl DrugsModeEnumerableImpl of Enumerable<DrugsMode> {
    fn all() -> Span<DrugsMode> {
        array![DrugsMode::Cheap, DrugsMode::Normal, DrugsMode::Expensive].span()
    }
}

pub impl WantedModeEnumerableImpl of Enumerable<WantedMode> {
    fn all() -> Span<WantedMode> {
        array![WantedMode::KoolAndTheGang, WantedMode::ThugLife, WantedMode::MostWanted].span()
    }
}


#[derive(Copy, Drop, Serde)]
pub struct SeasonSettingsModes {
    pub cash_modes: Span<CashMode>,
    pub health_modes: Span<HealthMode>,
    pub turns_modes: Span<TurnsMode>,
    //
    pub encounters_modes: Span<EncountersMode>,
    pub encounters_odds_modes: Span<EncountersOddsMode>,
    pub drugs_modes: Span<DrugsMode>,
    pub wanted_modes: Span<WantedMode>,
}

#[generate_trait]
pub impl SeasonSettingsModesImpl of SeasonSettingsModesTrait {
    fn all() -> SeasonSettingsModes {
        SeasonSettingsModes {
            cash_modes: CashModeEnumerableImpl::all(),
            health_modes: HealthModeEnumerableImpl::all(),
            turns_modes: TurnsModeEnumerableImpl::all(),
            //
            encounters_modes: EncountersModeEnumerableImpl::all(),
            encounters_odds_modes: EncountersOddsModeEnumerableImpl::all(),
            drugs_modes: DrugsModeEnumerableImpl::all(),
            wanted_modes: WantedModeEnumerableImpl::all(),
        }
    }
}
