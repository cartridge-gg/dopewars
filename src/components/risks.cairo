use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::{
    SCALING_FACTOR, COPS_DRUG_THRESHOLD, GANGS_CASH_THRESHOLD, ENCOUNTER_BIAS_GANGS
};
use rollyourown::PlayerStatus;

#[derive(Component, Copy, Drop, Serde)]
struct Risks {
    #[key]
    game_id: u32,
    #[key]
    location_id: felt252,
    travel: u8,
    capture: u8,
}

#[generate_trait]
impl RisksImpl of RisksTrait {
    #[inline(always)]
    fn travel(self: @Risks, seed: felt252, cash: u128, drug_count: usize) -> PlayerStatus {
        if occurs(seed, *self.travel) {
            let seed = pedersen::pedersen(seed, seed);
            let entropy: u256 = seed.into();
            let result: u128 = entropy.low % 100;

            // more bias towards gang encounter
            return match result <= ENCOUNTER_BIAS_GANGS {
                bool::False => {
                    if drug_count < COPS_DRUG_THRESHOLD {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingArrested
                },
                bool::True => {
                    if cash <= GANGS_CASH_THRESHOLD {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingMugged
                }
            };
        }

        return PlayerStatus::Normal;
    }

    #[inline(always)]
    fn run(self: @Risks, seed: felt252) -> bool {
        occurs(seed, *self.capture)
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    if likelihood == 0 {
        return false;
    }

    let seed: u256 = seed.into();
    let result: u128 = seed.low % 100;

    (result <= likelihood.into())
}

#[test]
#[available_gas(1000000)]
fn test_never_occurs() {
    let seed = pedersen::pedersen(1, 1);
    let mut risks = Risks { game_id: 0, location_id: 0, travel: 0, capture: 0 };
    let player_status = risks.travel(seed, 0, 0);

    assert(player_status == PlayerStatus::Normal(()), 'event occured');
}

#[test]
#[available_gas(1000000)]
fn test_always_occurs() {
    let seed = pedersen::pedersen(1, 1);
    let mut risks = Risks { game_id: 0, location_id: 0, travel: 100, capture: 0 };
    let player_status = risks.travel(seed, 1, COPS_DRUG_THRESHOLD);

    assert(player_status != PlayerStatus::Normal(()), 'event did not occur');
}

#[test]
#[available_gas(1000000)]
fn test_occurs() {
    let seed = pedersen::pedersen(1, 1);
    let event = occurs(seed, 10);
    assert(!event, 'should not occur');
}

#[test]
#[available_gas(1000000)]
fn test_not_occurs() {
    let seed = pedersen::pedersen(1, 1);
    let event = occurs(seed, 28);
    assert(event, 'should occur');
}

