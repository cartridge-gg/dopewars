#[system]
mod decide {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::constants::{GANGS_PAYMENT, COPS_PAYMENT, HEALTH_IMPACT, COPS_DRUG_THRESHOLD};
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::drug::{Drug, DrugTrait};
    use rollyourown::utils::random;

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Action {
        Run: (),
        Pay: (),
    }

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Outcome {
        Died: (),
        Paid: (),
        Escaped: (),
        Captured: (),
        Unsupported: (),
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
        cash_loss: u128
    }


    fn execute(ctx: Context, game_id: u32, action: Action, next_location_id: felt252) {
        let player_id = ctx.origin;
        let mut player: Player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal, 'player response not needed');

        let (mut outcome, cash_loss, drug_loss, health_loss) = match action {
            Action::Run => {
                let mut risks = get!(ctx.world, (game_id, player.location_id).into(), Risks);
                let seed = starknet::get_tx_info().unbox().transaction_hash;
                match risks.run(seed) {
                    bool::False => (Outcome::Escaped, 0, 0, 0),
                    bool::True => {
                        let random_loss: u8 = random(seed, 0, HEALTH_IMPACT.into())
                            .try_into()
                            .unwrap();
                        let health_loss: u8 = HEALTH_IMPACT + random_loss;
                        (Outcome::Captured, 0, 0, health_loss)
                    }
                }
            },
            Action::Pay => {
                match player.status {
                    PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0),
                    PlayerStatus::BeingMugged => {
                        // using same name cash_loss makes LS crash
                        let cash_loss_ = (player.cash * GANGS_PAYMENT.into()) / 100;
                        (Outcome::Paid, cash_loss_, 0, 0)
                    },
                    PlayerStatus::BeingArrested => {
                        // using same name drug_loss makes LS crash
                        let drug_loss_ = take_drugs(ctx, game_id, player_id, COPS_PAYMENT);
                        (Outcome::Paid, 0, drug_loss_, 0)
                    },
                }
            },
        };

        if outcome == Outcome::Captured {
            player.run_attempts += 1;
        } else {
            player.status = PlayerStatus::Normal;
            player.turns_remaining -= 1;
            player.location_id = next_location_id;
            player.run_attempts = 0;
        }

        player.cash -= cash_loss;
        player.drug_count -= drug_loss;
        if health_loss >= player.health {
            player.health = 0;
            player.turns_remaining = 0;
            player.turns_remaining_on_death = player.turns_remaining;
            outcome = Outcome::Died;
        } else {
            player.health -= health_loss
        }

        set!(ctx.world, (player));
        emit!(ctx.world, Decision { game_id, player_id, action });

        // makes LS crash if inlined in emit! ( outcome / enum issue ?)
        let consequence_event = Consequence {
            game_id, player_id, outcome, health_loss, drug_loss, cash_loss
        };
        emit!(ctx.world, consequence_event);
        
    }

    fn take_drugs(
        ctx: Context, game_id: u32, player_id: ContractAddress, percentage: usize
    ) -> usize {
        let mut drugs = DrugTrait::all();
        let mut total_drug_loss = 0;
        loop {
            match drugs.pop_front() {
                Option::Some(drug_id) => {
                    let mut drug = get!(ctx.world, (game_id, player_id, *drug_id), Drug);
                    if (drug.quantity != 0) {
                        let mut drug_loss = (drug.quantity * percentage) / 100;
                        drug_loss = if drug_loss == 0 {
                            1
                        } else {
                            drug_loss
                        };
                        drug.quantity -= drug_loss;
                        total_drug_loss += drug_loss;

                        set!(ctx.world, (drug));
                    }
                },
                Option::None => {
                    break;
                }
            };
        };
        total_drug_loss
    }
}

