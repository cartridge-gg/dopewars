#[system]
mod decide {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::constants::{BASE_PAYMENT, HEALTH_IMPACT};
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::drug::{Drug, DrugTrait};

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
        Fought: (),
        Escaped: (),
        Captured: (),
        Unsupported: (),
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Decision: Decision,
        Consequence: Consequence,
        Losses: Losses
    }

    #[derive(Drop, starknet::Event)]
    struct Decision {
        game_id: u32,
        player_id: ContractAddress,
        action: Action,
        run_attempts: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct Consequence {
        game_id: u32,
        player_id: ContractAddress,
        outcome: Outcome,
    }

    #[derive(Drop, starknet::Event)]
    struct Losses {
        game_id: u32,
        player_id: ContractAddress,
        health_loss: u8,
        drug_loss: usize,
        cash_loss: u128
    }

    fn execute(ctx: Context, game_id: u32, action: Action, next_location_id: felt252) {
        let player_id = ctx.origin;
        let mut player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal, 'player response not needed');

        let (mut outcome, cash_loss, drug_loss, health_loss) = match player.status {
            PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0),
            PlayerStatus::BeingMugged => match action {
                Action::Run => run(
                    ctx,
                    game_id,
                    player_id,
                    player.status,
                    player.cash,
                    player.location_id,
                    player.run_attempts
                ),
                Action::Pay => (Outcome::Unsupported, 0, 0, 0), // can't pay muggers
                Action::Fight => fight(ctx, game_id, player_id),
            },
            PlayerStatus::BeingArrested => match action {
                Action::Run => run(
                    ctx,
                    game_id,
                    player_id,
                    player.status,
                    player.cash,
                    player.location_id,
                    player.run_attempts
                ),
                Action::Pay => pay(ctx, game_id, player_id, player.cash),
                Action::Fight => (Outcome::Unsupported, 0, 0, 0), // can't fight officers
            },
        };

        // you can only bribe cops and fight muggers, not the other way around
        assert(outcome != Outcome::Unsupported, 'unsupported action');

        // if captured, stay in captured state and faces the same decision again, can choose to run 
        // again but consequences increase each tinme (-health, +risk)
        if outcome == Outcome::Captured {
            player.run_attempts += 1;
        } else {
            player.status = PlayerStatus::Normal;
            player.turns_remaining -= 1;
            player.location_id = next_location_id;
            player.run_attempts = 0;
        }

        if health_loss >= player.health {
            player.health = 0;
            player.turns_remaining = 0;
            outcome = Outcome::Died;
        } else {
            player.health -= health_loss;
        }

        player.cash -= cash_loss;
        player.drug_count -= drug_loss;

        set!(ctx.world, (player));
        emit!(ctx.world, Consequence { game_id, player_id, outcome });

        if health_loss > 0 || cash_loss > 0 || drug_loss > 0 {
            emit!(ctx.world, Losses { game_id, player_id, health_loss, drug_loss, cash_loss});
        }
    }

    // Player will fight muggers, but it kinda hurts, taking 20hp of your health. You 
    // might also die if not enough health
    fn fight(ctx: Context, game_id: u32, player_id: ContractAddress) -> (Outcome, u128, u32, u8) {
        emit!(ctx.world, Decision { game_id, player_id, action: Action::Fight, run_attempts: 0 });
        (Outcome::Fought, 0, 0, 20)
    }

    // Player will hand over either 20% of their cash or $400, which ever is more
    fn pay(
        ctx: Context, game_id: u32, player_id: ContractAddress, player_cash: u128
    ) -> (Outcome, u128, u32, u8) {
        assert(player_cash >= BASE_PAYMENT, 'not enough cash kid');
        let cash_loss = cmp::max(player_cash / 5, BASE_PAYMENT);

        emit!(ctx.world, Decision { game_id, player_id, action: Action::Pay, run_attempts: 0 });
        (Outcome::Paid, cash_loss, 0, 0)
    }

    // Player will try to run and can escape without consequence. However, if you 
    // are caught be ready to face the consequences:
    //     - caught escaping an officer - 10hp and 20% of your drugs
    //     - caught escaping muggers - 10hp and 20% of your cash
    //
    // In this captured state, players can choose to continue to run, the stash percentage
    // you lose increments by +10% each time. (ie 20%, 30%, 40%, etc) and health continues 
    // to decrease by 10hp
    fn run(
        ctx: Context,
        game_id: u32,
        player_id: ContractAddress,
        player_status: PlayerStatus,
        player_cash: u128,
        location_id: felt252,
        run_attempts: u8,
    ) -> (Outcome, u128, u32, u8) {
        let mut risks = get!(ctx.world, (game_id, location_id).into(), Risks);
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let got_away = risks.run(seed);

        emit!(ctx.world, Decision { game_id, player_id, action: Action::Run, run_attempts });
        match got_away {
            bool::False => match player_status {
                PlayerStatus::Normal => {
                    (Outcome::Unsupported, 0, 0, 0)
                },
                PlayerStatus::BeingMugged => {
                    let additional_penalty: u128 = run_attempts.into() * 10;
                    let cash_loss = (player_cash * (20 + additional_penalty)) / 100;
                    
                    (Outcome::Captured, cash_loss, 0, HEALTH_IMPACT)
                },
                PlayerStatus::BeingArrested => {
                    let drug_count_loss = take_drugs(ctx, game_id, player_id, run_attempts);
                    (Outcome::Captured, 0, drug_count_loss, HEALTH_IMPACT)
                }
            },
            bool::True => {
                (Outcome::Escaped, 0, 0, 0)
            }
        }
    }

    fn take_drugs(ctx: Context, game_id: u32, player_id: ContractAddress, run_attempts: u8) -> usize {
        let mut drugs = DrugTrait::all();
        let mut total_drug_loss = 0;
        loop {
            match drugs.pop_front() {
                Option::Some(drug_id) => {
                    let mut drug = get!(ctx.world, (game_id, player_id, *drug_id), Drug);
                    if (drug.quantity != 0) {
                        let additional_penalty: u32 = run_attempts.into() * 10;
                        let drug_loss = (drug.quantity * (20 + additional_penalty)) / 100;
                        drug.quantity -= drug_loss;
                        total_drug_loss += drug.quantity;

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
