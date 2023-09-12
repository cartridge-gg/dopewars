#[system]
mod decide {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::constants::BASE_PAYMENT;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::drug::{Drug, DrugTrait};

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Action {
        Pay: (),
        Run: (),
    }

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Outcome {
        Paid: (),
        Escaped: (),
        Captured: (),
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Decision: Decision,
        Consequence: Consequence,
        CashLoss: CashLoss,
        DrugLoss: DrugLoss,
    }

    #[derive(Drop, starknet::Event)]
    struct Decision {
        game_id: u32,
        player_id: ContractAddress,
        action: Action,
    }

    #[derive(Drop, starknet::Event)]
    struct Consequence {
        game_id: u32,
        player_id: ContractAddress,
        outcome: Outcome,
    }

    #[derive(Drop, starknet::Event)]
    struct CashLoss {
        game_id: u32,
        player_id: ContractAddress,
        amount: u128
    }

    #[derive(Drop, starknet::Event)]
    struct DrugLoss {
        game_id: u32,
        player_id: ContractAddress,
        drug_id: felt252,
        quantity: usize
    }

    fn execute(ctx: Context, game_id: u32, action: Action, next_location_id: felt252) {
        let player_id = ctx.origin;
        let mut player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal(()), 'player response not needed');

        let (outcome, cash_loss, drug_count_loss) = match action {
            Action::Pay => pay(ctx, game_id, player_id, player.cash),
            Action::Run => run(ctx, game_id, player_id, player.location_id, player.cash),
        };

        player.cash -= cash_loss;
        player.status = PlayerStatus::Normal(());
        player.location_id = next_location_id;
        player.turns_remaining -= 1;
        player.drug_count -= drug_count_loss;

        set!(ctx.world, (player));
        emit!(ctx.world, Consequence { game_id, player_id, outcome });
    }

    // Player will hand over either 20% of their cash or $400, which ever is more
    fn pay(
        ctx: Context, game_id: u32, player_id: ContractAddress, player_cash: u128
    ) -> (Outcome, u128, u32) {
        assert(player_cash >= BASE_PAYMENT, 'not enough cash kid');
        let cash_loss = cmp::max(player_cash / 5, BASE_PAYMENT);

        emit!(ctx.world, Decision { game_id, player_id, action: Action::Pay });
        emit!(ctx.world, CashLoss { game_id, player_id, amount: cash_loss });
        (Outcome::Paid(()), cash_loss, 0)
    }

    // Player will try to run and can escape. However, if they are captured they lose 50% of everything
    fn run(
        ctx: Context,
        game_id: u32,
        player_id: ContractAddress,
        location_id: felt252,
        player_cash: u128
    ) -> (Outcome, u128, u32) {
        let mut risks = get!(ctx.world, (game_id, location_id).into(), Risks);
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let got_away = risks.run(seed);

        emit!(ctx.world, Decision { game_id, player_id, action: Action::Run });
        match got_away {
            bool::False => {
                let cash_loss = player_cash / 2;
                let drug_count_loss = halve_drugs(ctx, game_id, player_id);

                emit!(ctx.world, CashLoss { game_id, player_id, amount: cash_loss });
                (Outcome::Captured(()), cash_loss, drug_count_loss)
            },
            bool::True => {
                (Outcome::Escaped(()), 0, 0)
            }
        }
    }

    // sorry fren, u jus lost half ur stash, ngmi
    fn halve_drugs(ctx: Context, game_id: u32, player_id: ContractAddress) -> u32 {
        let mut drugs = DrugTrait::all();
        let mut total_drug_loss = 0;
        loop {
            match drugs.pop_front() {
                Option::Some(drug_id) => {
                    let mut drug = get!(ctx.world, (game_id, player_id, *drug_id), Drug);
                    if (drug.quantity != 0) {
                        let quantity_before = drug.quantity;
                        drug.quantity /= 2;
                        let quantity_loss = quantity_before - drug.quantity;
                        total_drug_loss += quantity_loss;

                        emit!(
                            ctx.world,
                            DrugLoss {
                                game_id, player_id, drug_id: *drug_id, quantity: drug.quantity
                            }
                        );
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
