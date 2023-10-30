use debug::PrintTrait;

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::utils::random::random;
use rollyourown::utils::settings::RiskSettings;
use rollyourown::models::player::{Player, PlayerStatus, PlayerTrait, PlayerImpl};
use rollyourown::models::encounter::{Encounter, EncounterType, EncounterImpl};

trait RiskTrait<T> {
    fn update_wanted(self: T, ref player: Player);
    fn travel(
        self: T, world: IWorldDispatcher, seed: felt252, player: @Player
    ) -> Option<Encounter>;
    fn run(self: T, world: IWorldDispatcher, seed: felt252, player: @Player) -> bool;
}

impl RiskImpl of RiskTrait<RiskSettings> {
    #[inline(always)]
    fn travel(
        self: RiskSettings, world: IWorldDispatcher, seed: felt252, player: @Player
    ) -> Option<Encounter> {
        let travel_threshold = self.travel;

        if occurs(seed, travel_threshold) {
            let seed = pedersen::pedersen(seed, seed);
            let result: u128 = random(seed, 0, 100);

            return match result <= self.encounter_bias_gangs {
                bool::False => {
                    // if (*player).drug_count < self.cops_drug_threshold {
                    //     return PlayerStatus::Normal;
                    // }
                    //
                    Option::Some(EncounterImpl::get_or_spawn(world, player, EncounterType::Cops))
                //PlayerStatus::BeingArrested
                },
                bool::True => {
                    // if (*player).cash <= self.gangs_cash_threshold {
                    //     return PlayerStatus::Normal;
                    // }
                    Option::Some(EncounterImpl::get_or_spawn(world, player, EncounterType::Gang))
                //PlayerStatus::BeingMugged
                }
            };
        }

        Option::None
    //return PlayerStatus::Normal;
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
