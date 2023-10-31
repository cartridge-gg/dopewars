use starknet::ContractAddress;
use rollyourown::models::location::LocationEnum;

#[derive(Copy, Drop, Serde, PartialEq)]
enum Action {
    Run: (),
    Pay: (),
    Fight: (),
}

#[derive(Copy, Drop, Serde, PartialEq)]
enum Outcome {
    Died: (),
    Paid: (),
    Escaped: (),
    Captured: (),
    Victorious: (),
    Unsupported: (),
}

#[starknet::interface]
trait IDecide<TContractState> {
    fn decide(self: @TContractState, game_id: u32, action: Action);
}

#[dojo::contract]
mod decide {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    use rollyourown::constants::SCALING_FACTOR;
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
    use rollyourown::models::drug::{Drug, DrugEnum, DrugTrait};
    use rollyourown::models::location::{LocationEnum, LocationImpl};
    use rollyourown::models::item::{Item, ItemEnum};
    use rollyourown::models::encounter::{Encounter, EncounterType, EncounterImpl};

    use rollyourown::utils::random;
    use rollyourown::utils::settings::{
        DecideSettings, DecideSettingsImpl, RiskSettings, RiskSettingsImpl, EncounterSettings,
        EncounterSettingsImpl
    };
    use rollyourown::utils::risk::{RiskTrait, RiskImpl};
    use rollyourown::systems::travel::on_turn_end;


    use super::IDecide;
    use super::{Action, Outcome};


    #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            self.world_dispatcher.read()
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Decision: Decision,
        Consequence: Consequence,
    }

    #[derive(Drop, starknet::Event)]
    struct Decision {
        game_id: u32,
        player_id: ContractAddress,
        action: Action
    }

    #[derive(Drop, starknet::Event)]
    struct Consequence {
        game_id: u32,
        player_id: ContractAddress,
        outcome: Outcome,
        health_loss: u8,
        drug_loss: usize,
        cash_loss: u128,
        dmg_dealt: u32,
    }

    #[external(v0)]
    impl DecideImpl of IDecide<ContractState> {
        fn decide(self: @ContractState, game_id: u32, action: Action) {
            let world = self.world();
            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id), Player);
            assert(player.status != PlayerStatus::Normal, 'player response not needed');

            let game = get!(world, game_id, Game);
            let decide_settings = DecideSettingsImpl::get(game.game_mode, @player);
            let risk_settings = RiskSettingsImpl::get(game.game_mode, @player);

            let (mut outcome, cash_loss, drug_loss, health_loss, cash_earnt, dmg_dealt) =
                match action {
                Action::Run => {
                    if player.wanted + decide_settings.wanted_impact_run <= 100 {
                        player.wanted += decide_settings.wanted_impact_run;
                    } else {
                        player.wanted = 100;
                    }

                    let encounter_dmg = match player.status {
                        PlayerStatus::Normal => { 0 },
                        PlayerStatus::BeingMugged => {
                            let mut encounter = EncounterImpl::get_or_spawn(
                                world, @player, EncounterType::Gang
                            );
                            let encounter_settings = EncounterSettingsImpl::get(
                                game.game_mode, @player, encounter.level
                            );
                            encounter_settings.dmg
                        },
                        PlayerStatus::BeingArrested => {
                            let mut encounter = EncounterImpl::get_or_spawn(
                                world, @player, EncounterType::Cops
                            );
                            let encounter_settings = EncounterSettingsImpl::get(
                                game.game_mode, @player, encounter.level
                            );
                            encounter_settings.dmg
                        },
                        PlayerStatus::AtPawnshop => { 0 },
                    };

                    let seed = random::seed();
                    match risk_settings.run(world, seed, @player) {
                        bool::False => (Outcome::Escaped, 0, 0, 0, 0, 0),
                        bool::True => {
                            let random_loss: u8 = random::random(seed + 1, 0, encounter_dmg.into())
                                .try_into()
                                .unwrap();
                            let health_loss: u128 = (encounter_dmg + random_loss).into();
                            let defense_item = get!(
                                world, (game_id, player_id, ItemEnum::Defense), Item
                            );

                            // reduce dmgs by defense_item.value %
                            let health_saved: u128 = ((health_loss
                                * defense_item.value.into()
                                * SCALING_FACTOR)
                                / 100)
                                / SCALING_FACTOR;
                            let final_health_loss: u8 = (health_loss - health_saved)
                                .try_into()
                                .unwrap();

                            (Outcome::Captured, 0, 0, final_health_loss, 0, 0)
                        }
                    }
                },
                Action::Pay => {
                    match player.status {
                        PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0, 0, 0),
                        PlayerStatus::BeingMugged => {
                            // paying gangs divide wanted by 2
                            player.wanted = player.wanted / 2;

                            // using same name cash_loss makes LS crash
                            let cash_loss_ = (player.cash
                                * decide_settings.gangs_payment_cash_pct.into())
                                / 100;

                            (Outcome::Paid, cash_loss_, 0, 0, 0, 0)
                        },
                        PlayerStatus::BeingArrested => {
                            // paying cops divide wanted by 3
                            player.wanted = player.wanted / 3;

                            // using same name drug_loss makes LS crash
                            let drug_loss_ = self
                                .take_drugs(
                                    game_id, player_id, decide_settings.gangs_payment_cash_pct
                                );

                            (Outcome::Paid, 0, drug_loss_, 0, 0, 0)
                        },
                        PlayerStatus::AtPawnshop => (Outcome::Unsupported, 0, 0, 0, 0, 0),
                    }
                },
                Action::Fight => {
                    if player.wanted + decide_settings.wanted_impact_fight <= 100 {
                        player.wanted += decide_settings.wanted_impact_fight;
                    } else {
                        player.wanted = 100;
                    };

                    let seed = random::seed();

                    match player.status {
                        PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0, 0, 0),
                        PlayerStatus::BeingMugged => {
                            let mut encounter = EncounterImpl::get_or_spawn(
                                world, @player, EncounterType::Gang
                            );
                            let encounter_settings = EncounterSettingsImpl::get(
                                game.game_mode, @player, encounter.level
                            );

                            // calc player dmg
                            let mut attack = player.get_attack(world);
                            let random_attack: usize = random::random(
                                seed + 1, 0, (attack / 5).into()
                            )
                                .try_into()
                                .unwrap();

                            let random_dir = random::random(seed + 2, 0, 2);
                            if random_dir == 0 {
                                attack -= random_attack;
                            } else {
                                attack += random_attack;
                            };

                            // player deals dmg
                            if attack >= encounter.health.into() {
                                // encounter is dead
                                encounter.health = 0;
                                set!(world, (encounter));

                                // player wins payout
                                (Outcome::Victorious, 0, 0, 0, encounter.payout, attack)
                            } else {
                                // encounter lose health
                                encounter.health -= attack.try_into().unwrap();
                                set!(world, (encounter));

                                // encounter replies

                                // calc encounter dmg
                                let mut encounter_dmg = encounter_settings.dmg;
                                let random_dmg: u8 = random::random(
                                    seed + 3, 0, (encounter_dmg / 5).into()
                                )
                                    .try_into()
                                    .unwrap();

                                let random_dir = random::random(seed + 2, 0, 2);
                                if random_dir == 0 {
                                    encounter_dmg -= random_dmg;
                                } else {
                                    encounter_dmg += random_dmg;
                                };

                                let defense_item = get!(
                                    world, (game_id, player_id, ItemEnum::Defense), Item
                                );

                                // reduce dmgs by defense_item.value %
                                let health_saved: u128 = ((SCALING_FACTOR
                                    * defense_item.value.into()
                                    * encounter_dmg.into())
                                    / 100)
                                    / SCALING_FACTOR;
                                let final_health_loss: u8 = (encounter_dmg
                                    - health_saved.try_into().unwrap())
                                    .try_into()
                                    .unwrap();

                                (Outcome::Captured, 0, 0, final_health_loss, 0, attack)
                            }
                        },
                        PlayerStatus::BeingArrested => {
                            //TODO: create fn, thsi is copy pasta from BeingMugged

                            let mut encounter = EncounterImpl::get_or_spawn(
                                world, @player, EncounterType::Cops
                            );
                            let encounter_settings = EncounterSettingsImpl::get(
                                game.game_mode, @player, encounter.level
                            );

                            // calc player dmg
                            let mut attack = player.get_attack(world);
                            let random_attack: usize = random::random(
                                seed + 1, 0, (attack / 5).into()
                            )
                                .try_into()
                                .unwrap();

                            let random_dir = random::random(seed + 2, 0, 2);
                            if random_dir == 0 {
                                attack -= random_attack;
                            } else {
                                attack += random_attack;
                            };

                            // player deals dmg
                            if attack >= encounter.health.into() {
                                // encounter is dead
                                encounter.health = 0;
                                set!(world, (encounter));

                                // player wins payout
                                (Outcome::Victorious, 0, 0, 0, encounter.payout, attack)
                            } else {
                                // encounter lose health
                                encounter.health -= attack.try_into().unwrap();
                                set!(world, (encounter));

                                // encounter replies

                                // calc encounter dmg
                                let mut encounter_dmg = encounter_settings.dmg;
                                let random_dmg: u8 = random::random(
                                    seed + 3, 0, (encounter_dmg / 5).into()
                                )
                                    .try_into()
                                    .unwrap();

                                let random_dir = random::random(seed + 2, 0, 2);
                                if random_dir == 0 {
                                    encounter_dmg -= random_dmg;
                                } else {
                                    encounter_dmg += random_dmg;
                                };

                                let defense_item = get!(
                                    world, (game_id, player_id, ItemEnum::Defense), Item
                                );

                                // reduce dmgs by defense_item.value %
                                let health_saved: u128 = ((SCALING_FACTOR
                                    * defense_item.value.into()
                                    * encounter_dmg.into())
                                    / 100)
                                    / SCALING_FACTOR;
                                let final_health_loss: u8 = (encounter_dmg
                                    - health_saved.try_into().unwrap())
                                    .try_into()
                                    .unwrap();

                                (Outcome::Captured, 0, 0, final_health_loss, 0, attack)
                            }
                        },
                        PlayerStatus::AtPawnshop => (Outcome::Unsupported, 0, 0, 0, 0, 0),
                    }
                },
            };

            player.cash -= cash_loss;
            player.drug_count -= drug_loss;
            player.cash += cash_earnt;

            if health_loss >= player.health {
                player.health = 0;
                outcome = Outcome::Died;
            } else {
                player.health -= health_loss
            }

            if outcome != Outcome::Captured {
                player.status = PlayerStatus::Normal;

                on_turn_end(world, @game, ref player);

                if action == Action::Run {
                    player.location_id = LocationImpl::random();
                }
            }

            set!(world, (player));
            emit!(world, Decision { game_id, player_id, action });

            // makes LS crash if inlined in emit! ( outcome / enum issue ?)
            let consequence_event = Consequence {
                game_id, player_id, outcome, health_loss, drug_loss, cash_loss, dmg_dealt
            };
            emit!(world, consequence_event);
        }
    }


    #[generate_trait]
    impl InternalImpl of DecideInternalImpl {
        fn take_drugs(
            self: @ContractState, game_id: u32, player_id: ContractAddress, percentage: usize
        ) -> usize {
            let world = self.world();
            let mut drugs = DrugTrait::all();
            let mut total_drug_loss = 0;
            loop {
                match drugs.pop_front() {
                    Option::Some(drug_id) => {
                        let mut drug = get!(world, (game_id, player_id, *drug_id), Drug);
                        if (drug.quantity != 0) {
                            let mut drug_loss = (drug.quantity * percentage) / 100;
                            drug_loss = if drug_loss == 0 {
                                1
                            } else {
                                drug_loss
                            };
                            drug.quantity -= drug_loss;
                            total_drug_loss += drug_loss;

                            set!(world, (drug));
                        }
                    },
                    Option::None => { break; }
                };
            };
            total_drug_loss
        }
    }
}

