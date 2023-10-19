use debug::PrintTrait;

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::utils::random::random;
use rollyourown::utils::settings::RiskSettings;
use rollyourown::models::player::{Player, PlayerStatus, PlayerTrait, PlayerImpl};

trait RiskTrait<T> {
    fn update_wanted(self: T, ref player: Player);
    fn travel(self: T, seed: felt252, player: @Player) -> PlayerStatus;
    fn run(self: T, world: IWorldDispatcher, seed: felt252, player: @Player) -> bool;
}

impl RiskImpl of RiskTrait<RiskSettings> {
    #[inline(always)]
    fn travel(self: RiskSettings, seed: felt252, player: @Player) -> PlayerStatus {
        let travel_threshold = self.travel;

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
    fn run(self: RiskSettings, world: IWorldDispatcher, seed: felt252, player: @Player) -> bool {
        let capture_threshold = self.capture - (*player).get_speed(world).try_into().unwrap();
        occurs(seed, capture_threshold)
    }

    fn update_wanted(self: RiskSettings, ref player: Player) {
        if player.wanted > self.wanted_decrease_by_turn {
            player.wanted -= self.wanted_decrease_by_turn
        }

        if player.drug_count == 0 && player.wanted > self.wanted_decrease_zero_drug {
            player.wanted -= self.wanted_decrease_zero_drug
        } else {
            if player.wanted + self.wanted_increase_by_drug > 100 {
                player.wanted = 100;
            } else {
                player.wanted += self.wanted_increase_by_drug
            }
        }
    }
}

fn occurs(seed: felt252, likelihood: u8) -> bool {
    if likelihood == 0 {
        return false;
    }

    let result: u128 = random(seed, 0, 100);
    (result <= likelihood.into())
}
