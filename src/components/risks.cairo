use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Drop, Copy)]
struct TravelResult {
    arrested: bool,
    mugged: bool,
    health_loss: u8,
}

#[derive(Drop, Copy)]
struct TradeResult {
    money_loss: u128,
    drug_loss: usize,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Risks {
    #[key]
    game_id: u32,
    #[key]
    location_id: felt252,
    // travel risk probabilities
    travel: u8,
    hurt: u8,
    mugged: u8,
    arrested: u8,
// trade risk probabilities
// trade_occurance_rate: u8,
// hacked: u8,
// rugged: u8,
// slippage: u8,
// chain_halted: u8,
}

trait RisksTrait {
    fn travel(self: @Risks, seed: felt252) -> (bool, TravelResult);
    fn trade(self: @Risks, seed: felt252) -> (bool, TradeResult);
}

impl RisksImpl of RisksTrait {
    fn travel(self: @Risks, seed: felt252) -> (bool, TravelResult) {
        let mut seed = seed;
        let mut health_loss = 0;
        let mut arrested = false;
        let mut mugged = false;
        let mut event_occured = false;

        if occurs(seed, *self.travel) {
            seed = pedersen(seed, seed);
            event_occured = true;

            // TEMP: for testing, mugging is only risk
            mugged = true;
        }

        (event_occured, TravelResult { arrested, mugged, health_loss })
    }

    fn trade(self: @Risks, seed: felt252) -> (bool, TradeResult) {
        let mut money_loss = 0;
        let mut drug_loss = 0;

        // TODO: trade risk effects 

        (false, TradeResult { money_loss, drug_loss })
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    let seed: u256 = seed.into();
    let result: u128 = seed.low % 100;
    (result <= likelihood.into())
}

#[test]
#[available_gas(1000000)]
fn test_never_occurs() {
    let seed = pedersen(1, 1);
    let risks = Risks { game_id: 0, location_id: 0, travel: 0, hurt: 0, mugged: 0, arrested: 0,  };
    let (event_occured, result) = risks.travel(seed);

    assert(!event_occured, 'event occured');
    assert(result.health_loss == 0, 'health_loss occured');
    assert(!result.mugged, 'was mugged');
    assert(!result.arrested, 'was arrested');
}

#[test]
#[available_gas(1000000)]
fn test_always_occurs() {
    let seed = pedersen(1, 1);
    let risks = Risks { game_id: 0, location_id: 0, travel: 100, hurt: 100, mugged: 100, arrested: 100,  };
    let (event_occured, result) = risks.travel(seed);

    assert(event_occured, 'event did not occur');
}

#[test]
#[available_gas(1000000)]
fn test_occurs() {
    let seed = pedersen(1, 1);
    let event = occurs(seed, 10);
    assert(!event, 'should not occur');
}

#[test]
#[available_gas(1000000)]
fn test_not_occurs() {
    let seed = pedersen(1, 1);
    let event = occurs(seed, 28);
    assert(event, 'should occur');
}

