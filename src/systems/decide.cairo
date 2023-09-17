#[system]
mod decide {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::constants::{GANGS_PAYMENT, COPS_PAYMENT, HEALTH_IMPACT, COPS_DRUG_THRESHOLD};
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::drug::{Drug, DrugTrait};

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
        let mut player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal, 'player response not needed');

        let (mut outcome, cash_loss, drug_loss, health_loss) = match action {
            Action::Run => {
                let mut risks = get!(ctx.world, (game_id, player.location_id).into(), Risks);
                let seed = starknet::get_tx_info().unbox().transaction_hash;
                match risks.run(seed) {
                    bool::False => (Outcome::Captured, 0, 0, HEALTH_IMPACT),
                    bool::True => (Outcome::Escaped, 0, 0, 0)
                }
            },
            Action::Pay => {
                match player.status {
                    PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0),
                    PlayerStatus::BeingMugged => {
                        let drug_loss = take_drugs(ctx, game_id, player_id, GANGS_PAYMENT);
                        let cash_loss = (player.cash * GANGS_PAYMENT.into()) / 100;
                        (Outcome::Paid, cash_loss, drug_loss, 0)
                    },
                    PlayerStatus::BeingArrested => {
                        let cash_loss = cops_payment(player.drug_count);
                        assert(cash_loss <= player.cash, 'not enough cash to pay cops');
                        (Outcome::Paid, cash_loss, 0, 0)
                    }
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
            outcome = Outcome::Died;
        } else {
            player.health -= health_loss
        }

        set!(ctx.world, (player));

        emit!(ctx.world, Decision { game_id, player_id, action });
        emit!(
            ctx.world,
            Consequence { game_id, player_id, outcome, health_loss, drug_loss, cash_loss }
        );
    }

    fn cops_payment(drug_count: u32) -> u128 {
        if drug_count < COPS_DRUG_THRESHOLD + 20 {
            1000_0000 // $1000
        } else if drug_count < COPS_DRUG_THRESHOLD + 50 {
            5000_0000 // $5000
        } else if drug_count < COPS_DRUG_THRESHOLD + 80 {
            10000_0000 // $10000
        } else {
            20000_0000 // $20000
        }
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
