use debug::PrintTrait;

use rollyourown::utils::random::random;
use rollyourown::utils::settings::RiskSettings;
use rollyourown::models::player::PlayerStatus;


trait RiskTrait<T> {
    fn travel( self: T,seed: felt252, cash: u128, drug_count: usize) -> PlayerStatus;
    fn run( self: T, seed: felt252) -> bool;
}

impl RiskImpl of RiskTrait<RiskSettings> {
    #[inline(always)]
    fn travel( self: RiskSettings, seed: felt252,  cash: u128, drug_count: usize
    ) -> PlayerStatus {
        if occurs(seed, self.travel) {
            let seed = pedersen::pedersen(seed, seed);
            let result: u128 = random(seed, 0, 100);

            return match result <= self.encounter_bias_gangs {
                bool::False => {
                    if drug_count < self.cops_drug_threshold {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingArrested
                },
                bool::True => {
                    if cash <= self.gangs_cash_threshold {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingMugged
                }
            };
        }

        return PlayerStatus::Normal;
    }

    #[inline(always)]
    fn run( self: RiskSettings, seed: felt252) -> bool {
        occurs(seed, self.capture)
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    if likelihood == 0 {
        return false;
    }

    let result: u128 = random(seed, 0, 100);
    (result <= likelihood.into())
}