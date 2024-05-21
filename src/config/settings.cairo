use rollyourown::{
    config::{game::{GameConfig}}, utils::random::{Random, RandomImpl,},
    traits::{Enumerable, RandomizableImpl}
};

#[derive(Model, Copy, Drop, Serde)]
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
}


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum CashMode {
    Broke,
    Average,
    Rich,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum HealthMode {
    Junkie,
    Hustler,
    Streetboss,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum TurnsMode {
    OnSpeed,
    OnWeed,
    OnMush
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum EncountersMode {
    Chill,
    NoJokes,
    UltraViolence,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum EncountersOddsMode {
    Easy,
    Normal,
    Hard,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum DrugsMode {
    Cheap,
    Normal,
    Expensive,
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
        }
    }


    fn build_game_config(self: SeasonSettings) -> GameConfig {
        GameConfig {
            season_version: self.season_version,
            cash: self.get_initial_cash(),
            health: self.get_initial_health(),
            max_turns: self.get_turns_mode(),
            //
            max_wanted_shopping: 5,
            max_rounds: 3,
            //
            rep_drug_step: 20,
            rep_buy_item: 1,
            rep_carry_drugs: 2,
            rep_hospitalized: 3,
            rep_jailed: 4,
        }
    }

    //
    //
    //

    fn get_initial_cash(self: SeasonSettings) -> u32 {
        match self.cash_mode {
            CashMode::Broke => { 420 },
            CashMode::Average => { 1000 },
            CashMode::Rich => { 1690 },
        }
    }

    fn get_initial_health(self: SeasonSettings) -> u8 {
        match self.health_mode {
            HealthMode::Junkie => { 80 },
            HealthMode::Hustler => { 100 },
            HealthMode::Streetboss => { 111 },
        }
    }

    fn get_turns_mode(self: SeasonSettings) -> u8 {
        match self.turns_mode {
            TurnsMode::OnSpeed => { 24 },
            TurnsMode::OnWeed => { 30 },
            TurnsMode::OnMush => { 36 },
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


#[derive(Copy, Drop, Serde)]
struct SeasonSettingsModes {
    cash_modes: Span<CashMode>,
    health_modes: Span<HealthMode>,
    turns_modes: Span<TurnsMode>,
    //
    encounters_modes: Span<EncountersMode>,
    encounters_odds_modes: Span<EncountersOddsMode>,
    drugs_modes: Span<DrugsMode>,
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
        }
    }
}
