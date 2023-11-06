use debug::PrintTrait;

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::utils::settings::RiskSettings;
use rollyourown::models::player::{Player, PlayerStatus, PlayerTrait, PlayerImpl};
use rollyourown::models::encounter::{Encounter, EncounterType, EncounterImpl};
use rollyourown::utils::math::{MathTrait, MathImplU8};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};

trait RiskTrait<T> {
    fn update_wanted(self: T, ref player: Player);
    fn travel(
        self: T, world: IWorldDispatcher, ref randomizer: Random, player: @Player
    ) -> Option<Encounter>;
    fn run(self: T, world: IWorldDispatcher, ref randomizer: Random, player: @Player) -> bool;
}

impl RiskImpl of RiskTrait<RiskSettings> {
    #[inline(always)]
    fn travel(
        self: RiskSettings, world: IWorldDispatcher, ref randomizer: Random, player: @Player
    ) -> Option<Encounter> {
        let travel_threshold = self.travel;

        if randomizer.occurs(travel_threshold) {
            let result = randomizer.between::<u128>(0, 100);

            return match result <= self.encounter_bias_gangs {
                bool::False => {
                    if (*player).drug_count < self.cops_drug_threshold {
                        Option::None
                    } else {
                        Option::Some(
                            EncounterImpl::get_or_spawn(world, player, EncounterType::Cops)
                        )
                    }
                },
                bool::True => {
                    if (*player).cash <= self.gangs_cash_threshold {
                        Option::None
                    } else {
                        Option::Some(
                            EncounterImpl::get_or_spawn(world, player, EncounterType::Gang)
                        )
                    }
                }
            };
        }
        Option::None
    }

    #[inline(always)]
    fn run(
        self: RiskSettings, world: IWorldDispatcher, ref randomizer: Random, player: @Player
    ) -> bool {
        let capture_threshold = self.capture - (*player).get_speed(world).try_into().unwrap();
        randomizer.occurs(capture_threshold)
    }

    fn update_wanted(self: RiskSettings, ref player: Player) {
        if player.wanted > self.wanted_decrease_by_turn {
            player.wanted -= self.wanted_decrease_by_turn
        }

        if player.drug_count == 0 && player.wanted > self.wanted_decrease_zero_drug {
            player.wanted -= self.wanted_decrease_zero_drug
        } else {
            player.wanted = player.wanted.add_capped(self.wanted_increase_by_drug, 100);
        }
    }
}
// fn occurs(ref randomizer: Random, likelihood: u8) -> bool {
//     if likelihood == 0 {
//         return false;
//     }

//     let result: u128 = randomizer.between::<u128>(0, 100);
//     (result <= likelihood.into())
// }


