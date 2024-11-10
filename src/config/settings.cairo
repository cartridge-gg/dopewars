use rollyourown::{
    config::{game::{GameConfig}}, utils::random::{Random, RandomImpl,},
    traits::{Enumerable, RandomizableImpl}
};

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct SeasonSettings {
    #[key]
    season_version: u16,
    cash_mode: CashMode,
    health_mode: HealthMode,
    turns_mode: TurnsMode,
    //
    encounters_mode: EncountersMode,
    encounters_odds_mode: EncountersOddsMode,
    drugs_mode: DrugsMode,
    wanted_mode: WantedMode,
}


#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum CashMode {
    Broke,
    Average,
    Rich,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum HealthMode {
    Junkie,
    Hustler,
    Streetboss,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum TurnsMode {
    OnSpeed,
    OnWeed,
    OnMush
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum EncountersMode {
    Chill,
    NoJokes,
    UltraViolence,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum EncountersOddsMode {
    Easy,
    Normal,
    Hard,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum DrugsMode {
    Cheap,
    Normal,
    Expensive,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum WantedMode {
    KoolAndTheGang,
    ThugLife,
    MostWanted,
}


#[generate_trait]
impl SeasonSettingsImpl of SeasonSettingsTrait {
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
            rep_buy_item: 2,
            rep_carry_drugs: 2,
            rep_hospitalized: 4,
            rep_jailed: 6,
        }
    }

    //
    // Game params
    //

    fn get_initial_cash(self: SeasonSettings) -> u32 {
        match self.cash_mode {
            CashMode::Broke => { 420 },
            CashMode::Average => { 1000 },
            CashMode::Rich => { 2600 },
        }
    }

    fn get_initial_health(self: SeasonSettings) -> u8 {
        match self.health_mode {
            HealthMode::Junkie => { 70 },
            HealthMode::Hustler => { 90 },
            HealthMode::Streetboss => { 110 },
        }
    }

    fn get_max_turns(self: SeasonSettings) -> u8 {
        match self.turns_mode {
            TurnsMode::OnSpeed => { 16 },
            TurnsMode::OnWeed => { 18 },
            TurnsMode::OnMush => { 20 },
        }
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

impl CashModeEnumerableImpl of Enumerable<CashMode> {
    fn all() -> Span<CashMode> {
        array![CashMode::Broke, CashMode::Average, CashMode::Rich,].span()
    }
}

impl HealthModeEnumerableImpl of Enumerable<HealthMode> {
    fn all() -> Span<HealthMode> {
        array![HealthMode::Junkie, HealthMode::Hustler, HealthMode::Streetboss].span()
    }
}

impl TurnsModeEnumerableImpl of Enumerable<TurnsMode> {
    fn all() -> Span<TurnsMode> {
        array![TurnsMode::OnSpeed, TurnsMode::OnWeed, TurnsMode::OnMush,].span()
    }
}

impl EncountersModeEnumerableImpl of Enumerable<EncountersMode> {
    fn all() -> Span<EncountersMode> {
        array![EncountersMode::Chill, EncountersMode::NoJokes, EncountersMode::UltraViolence,]
            .span()
    }
}

impl EncountersOddsModeEnumerableImpl of Enumerable<EncountersOddsMode> {
    fn all() -> Span<EncountersOddsMode> {
        array![EncountersOddsMode::Easy, EncountersOddsMode::Normal, EncountersOddsMode::Hard,]
            .span()
    }
}

impl DrugsModeEnumerableImpl of Enumerable<DrugsMode> {
    fn all() -> Span<DrugsMode> {
        array![DrugsMode::Cheap, DrugsMode::Normal, DrugsMode::Expensive,].span()
    }
}

impl WantedModeEnumerableImpl of Enumerable<WantedMode> {
    fn all() -> Span<WantedMode> {
        array![WantedMode::KoolAndTheGang, WantedMode::ThugLife, WantedMode::MostWanted,].span()
    }
}


#[derive(Copy, Drop, Serde)]
struct SeasonSettingsModes {
    cash_modes: Span<CashMode>,
    health_modes: Span<HealthMode>,
    turns_modes: Span<TurnsMode>,
    //
    encounters_modes: Span<EncountersMode>,
    encounters_odds_modes: Span<EncountersOddsMode>,
    drugs_modes: Span<DrugsMode>,
    wanted_modes: Span<WantedMode>,
}

#[generate_trait]
impl SeasonSettingsModesImpl of SeasonSettingsModesTrait {
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
