use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Drop)]
struct TravelResult {
    arrested: bool,
    money_loss: u128,
    health_loss: u8,
    respect_loss: u8,
}

#[derive(Drop)]
struct TradeResult {
    money_loss: u128,
    drug_loss: usize,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Risks {
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
        let mut money_loss = 0;
        let mut respect_loss = 0;
        let mut arrested = false;
        let mut event_occured = false;

        if occurs(seed, *self.travel) {
            seed = pedersen(seed, seed);
            if occurs(seed, *self.hurt) {
                health_loss = 5;
                event_occured = true;
            }

            seed = pedersen(seed, seed);
            if occurs(seed, *self.mugged) {
                money_loss = 20 * SCALING_FACTOR;
                event_occured = true;
            }

            seed = pedersen(seed, seed);
            if occurs(seed, *self.arrested) {
                arrested = true;
                event_occured = true;
            }
        }

        (event_occured, TravelResult { money_loss, health_loss, respect_loss, arrested })
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
    let risks = Risks { travel: 0, hurt: 0, mugged: 0, arrested: 0,  };
    let (event_occured, result) = risks.travel(seed);

    assert(!event_occured, 'event occured');
    assert(result.health_loss == 0, 'health_loss occured');
    assert(result.money_loss == 0, 'money_loss ocurred');
    assert(!result.arrested, 'was arrested');
}

#[test]
#[available_gas(1000000)]
fn test_always_occurs() {
    let seed = pedersen(1, 1);
    let risks = Risks { travel: 100, hurt: 100, mugged: 100, arrested: 100,  };
    let (event_occured, result) = risks.travel(seed);

    assert(event_occured, 'event did not occur');
    assert(result.health_loss > 0, 'health_loss did not occur');
    assert(result.money_loss > 0, 'money_loss did not occur');
    assert(result.arrested, 'was not arrested');
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

