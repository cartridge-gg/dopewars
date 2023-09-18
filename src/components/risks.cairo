use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::{SCALING_FACTOR, TRAVEL_RISK_POLICE};
use rollyourown::PlayerStatus;

#[derive(Component, Copy, Drop, Serde)]
struct Risks {
    #[key]
    game_id: u32,
    #[key]
    location_id: felt252,
    travel: u8,
    run: u8,
}

#[generate_trait]
impl RisksImpl of RisksTrait {
    #[inline(always)]
    fn travel(self: @Risks, seed: felt252) -> PlayerStatus {
        if occurs(seed, *self.travel) {
            let seed = pedersen::pedersen(seed, seed);
            let entropy: u256 = seed.into();
            let result: u128 = entropy.low % 100;

            // more bias towards gang encounter
            return match result <= TRAVEL_RISK_POLICE.into() {
                bool::False => PlayerStatus::BeingMugged(()),
                bool::True => PlayerStatus::BeingArrested(()),
            };
        }

        return PlayerStatus::Normal(());
    }

    #[inline(always)]
    fn run(self: @Risks, seed: felt252) -> bool {
        occurs(seed, *self.run)
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
    let mut risks = Risks { game_id: 0, location_id: 0, travel: 0, run: 0 };
    let player_status = risks.travel(seed);

    assert(player_status == PlayerStatus::Normal(()), 'event occured');
}

#[test]
#[available_gas(1000000)]
fn test_always_occurs() {
    let seed = pedersen::pedersen(1, 1);
    let mut risks = Risks { game_id: 0, location_id: 0, travel: 100, run: 0 };
    let player_status = risks.travel(seed);

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

