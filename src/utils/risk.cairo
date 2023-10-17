use debug::PrintTrait;

use rollyourown::utils::random::random;
use rollyourown::utils::settings::RiskSettings;
use rollyourown::models::player::{Player, PlayerStatus};

trait RiskTrait<T> {
    fn travel( self: T,seed: felt252, player: @Player) -> PlayerStatus;
    fn run( self: T, seed: felt252, player: @Player) -> bool;
}

impl RiskImpl of RiskTrait<RiskSettings> {
    #[inline(always)]
    fn travel( self: RiskSettings, seed: felt252, player: @Player) -> PlayerStatus {
        let travel_threshold = self.travel + ( (*player).wanted / 2 );
        
        if occurs(seed, travel_threshold) {
            let seed = pedersen::pedersen(seed, seed);
            let result: u128 = random(seed, 0, 100);

            return match result <= self.encounter_bias_gangs {
                bool::False => {
                    if (*player).drug_count < self.cops_drug_threshold {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingArrested
                },
                bool::True => {
                    if (*player).cash <= self.gangs_cash_threshold {
                        return PlayerStatus::Normal;
                    }

                    PlayerStatus::BeingMugged
                }
            };
        }

        return PlayerStatus::Normal;
    }

    #[inline(always)]
    fn run( self: RiskSettings, seed: felt252, player: @Player ) -> bool {
        let capture_threshold = self.capture + ( (*player).wanted / 5 );
        occurs(seed, capture_threshold)
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    if likelihood == 0 {
        return false;
    }

    let result: u128 = random(seed, 0, 100);
    (result <= likelihood.into())
}