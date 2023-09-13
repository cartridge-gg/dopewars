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
        let mut player = get !(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal, 'player response not needed');

        let (mut outcome, cash_loss, drug_count_loss, health_loss) = match player.status {
            PlayerStatus::Normal => (Outcome::Unsupported, 0, 0, 0),
            PlayerStatus::BeingMugged => match action {
                Action::Run => run(
                    ctx, game_id, player_id, player.status, player.cash, player.location_id
                ),
                Action::Pay => (Outcome::Unsupported, 0, 0, 0), // can't pay muggers
                Action::Fight => fight(ctx, game_id, player_id),
            },
            PlayerStatus::BeingArrested => match action {
                Action::Run => run(
                    ctx, game_id, player_id, player.status, player.cash, player.location_id
                ),
                Action::Pay => pay(ctx, game_id, player_id, player.cash),
                Action::Fight => (Outcome::Unsupported, 0, 0, 0), // can't fight officers
            },
        };

        // you can only bribe cops and fight muggers, not the other way around
        assert(outcome != Outcome::Unsupported, 'unsupported action');

        // update player data
        player.status = PlayerStatus::Normal;
        player.cash -= cash_loss;
        player.drug_count -= drug_count_loss;

        if health_loss >= player.health {
            player.health = 0;
            player.turns_remaining = 0;
            outcome = Outcome::Died;
        } else {
            player.health -= health_loss;
            player.turns_remaining -= 1;
            player.location_id = next_location_id;
        }

        set!(ctx.world, (player));
        emit!(ctx.world, Consequence { game_id, player_id, outcome });
    }

    // Player will fight muggers, but it kinda hurts, taking 10hp of your health. You 
    // might also die if not enough health
    fn fight(ctx: Context, game_id: u32, player_id: ContractAddress) -> (Outcome, u128,u32, u8) {
        (Outcome::Fought, 0, 0, 10)
    }

    // Player will hand over either 20% of their cash or $400, which ever is more
    fn pay(
        ctx: Context, game_id: u32, player_id: ContractAddress, player_cash: u128
    ) -> (Outcome, u128,u32, u8) {
        assert(player_cash >= BASE_PAYMENT, 'not enough cash kid');
        let cash_loss = cmp::max(player_cash / 5, BASE_PAYMENT);

        emit !(ctx.world, Decision { game_id, player_id, action: Action::Pay });
        emit !(ctx.world, CashLoss { game_id, player_id, amount: cash_loss });
        (Outcome::Paid, cash_loss,0, 0)
    }

    // Player will try to run and can escape without consequence. However, if you 
    // are caught be ready to face the consequences:
    //     - caught escaping an officer - lose ALL your drugs
    //     - caught escaping muggers - lose half your cash and 20HP
    fn run(
        ctx: Context,
        game_id: u32,
        player_id: ContractAddress,
        player_status: PlayerStatus,
        player_cash: u128,
        location_id: felt252
    ) -> (Outcome, u128,u32, u8) {
        let mut risks = get !(ctx.world, (game_id, location_id).into(), Risks);
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let got_away = risks.run(seed);

        emit!(ctx.world, Decision { game_id, player_id, action: Action::Run });
        match got_away {
            bool::False => match player_status {
                PlayerStatus::Normal => {
                    (Outcome::Unsupported, 0, 0,0)
                },
                PlayerStatus::BeingMugged => {
                    let cash_loss = player_cash / 2;

                    emit !(ctx.world, CashLoss { game_id, player_id, amount: cash_loss });
                    (Outcome::Captured, cash_loss,0, 20)
                },
                PlayerStatus::BeingArrested => {
                    let drug_count_loss = take_drugs(ctx, game_id, player_id);
                    (Outcome::Captured, 0, drug_count_loss, 0)
                }
            },
            bool::True => {
                (Outcome::Escaped, 0, 0, 0)
            }
        }
    }

    // lost all ur stash, ngmi
    fn take_drugs(ctx: Context, game_id: u32, player_id: ContractAddress)->u32 {
        let mut drugs = DrugTrait::all();
        let mut total_drug_loss = 0;
        loop {
            match drugs.pop_front() {
                Option::Some(drug_id) => {
                    let mut drug = get!(ctx.world, (game_id, player_id, *drug_id), Drug);
                    if (drug.quantity != 0) {
                        total_drug_loss = drug.quantity;
                        drug.quantity = 0;

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
