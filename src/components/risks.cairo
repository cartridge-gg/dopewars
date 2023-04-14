use traits::Into;
use traits::TryInto;
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Drop)]
struct TravelResult {
    arrested: bool,
    killed: bool,
    money_loss: u128,
    health_loss: u8,
    respect_loss: u8,
}

#[derive(Drop)]
struct TradeResult {
    money_loss: u128,
    drug_loss: usize,
}

#[derive(Component)]
struct Risks {
    // travel risk probabilities
    travel_occurance_rate: u8,
    hurt: u8,
    killed: u8,
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
    fn travel(self: Risks, seed: felt252) -> (bool, TravelResult);
    fn trade(self: Risks, seed: felt252) -> (bool, TradeResult);
}

impl RisksImpl of RisksTrait {
    fn travel(self: Risks, seed: felt252) -> (bool, TravelResult) {
        let mut seed = seed;
        let mut health_loss = 0_u8;
        let mut money_loss = 0_u128;
        let mut respect_loss = 0_u8;
        let mut killed = false;
        let mut arrested = false;
        let mut event_occured = false;

        if occurs(
            seed, self.travel_occurance_rate
        ) {
            seed = pedersen(seed, seed);
            if occurs(seed, self.hurt) {
                health_loss = 5_u8;
                event_occured = true;
            }

            seed = pedersen(seed, seed);
            if occurs(
                seed, self.mugged
            ) {
                money_loss = 20_u128 * SCALING_FACTOR;
                event_occured = true;
            }

            seed = pedersen(seed, seed);
            if occurs(seed, self.arrested) {
                arrested = true;
                event_occured = true;
            }

            seed = pedersen(seed, seed);
            if occurs(seed, self.killed) {
                killed = true;
                event_occured = true;
            }
        }

        (event_occured, TravelResult { money_loss, health_loss, respect_loss, arrested, killed })
    }

    fn trade(self: Risks, seed: felt252) -> (bool, TradeResult) {
        let mut money_loss = 0_u128;
        let mut drug_loss = 0_usize;

        // TODO: trade risk effects 

        (false, TradeResult { money_loss, drug_loss })
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    let seed: u128 = seed.into().low;
    let likelihood: u128 = likelihood.into().into().low;
    let result: u128 = seed % 100_u128;
    (result <= likelihood)
}

#[test]
#[available_gas(1000000)]
fn test_never_occurs() {
    let seed = pedersen(1, 1);
    let risks = Risks {
        travel_occurance_rate: 0_u8, hurt: 0_u8, mugged: 0_u8, killed: 0_u8, arrested: 0_u8, 
    };
    let (event_occured, result) = risks.travel(seed);

    assert(!event_occured, 'event occured');
    assert(result.health_loss == 0_u8, 'health_loss occured');
    assert(result.money_loss == 0_u128, 'money_loss ocurred');
    assert(!result.killed, 'was killed');
    assert(!result.arrested, 'was arrested');
}

#[test]
#[available_gas(1000000)]
fn test_always_occurs() {
    let seed = pedersen(1, 1);
    let risks = Risks {
        travel_occurance_rate: 100_u8,
        hurt: 100_u8,
        mugged: 100_u8,
        killed: 100_u8,
        arrested: 100_u8,
    };
    let (event_occured, result) = risks.travel(seed);

    assert(event_occured, 'event did not occur');
    assert(result.health_loss > 0_u8, 'health_loss did not occur');
    assert(result.money_loss > 0_u128, 'money_loss did not occur');
    assert(result.killed, 'was not killed');
    assert(result.arrested, 'was not arrested');
}

#[test]
#[available_gas(1000000)]
fn test_occurs() {
    let seed = pedersen(1, 1);
    let event = occurs(seed, 10_u8);
    assert(!event, 'should not occur');
}

#[test]
#[available_gas(1000000)]
fn test_not_occurs() {
    let seed = pedersen(1, 1);
    let event = occurs(seed, 28_u8);
    assert(event, 'should occur');
}

