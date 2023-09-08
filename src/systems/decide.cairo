#[system]
mod decide {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::world::Context;
    use rollyourown::PlayerStatus;
    use rollyourown::constants::{RUN_PENALTY, PAY_PENALTY};
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::player::{Player, PlayerTrait};

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Action {
        Pay: (),
        Run: (),
    }

    #[derive(Copy, Drop, Serde, PartialEq)]
    enum Result {
        Paid: (),
        GotAway: (),
        Mugged: (),
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
        action: Action,
    }

    #[derive(Drop, starknet::Event)]
    struct Consequence {
        game_id: u32,
        player_id: ContractAddress,
        result: Result
    }

    fn execute(ctx: Context, game_id: u32, action: Action, next_location_id: felt252) {
        let game = get !(ctx.world, game_id, Game);
        assert(game.tick(), 'game cannot progress');

        let player_id = ctx.origin;
        let mut player = get !(ctx.world, (game_id, player_id).into(), Player);
        assert(player.status != PlayerStatus::Normal(()), 'player response not needed');

        let result = match action {
            Action::Pay => {
                emit !(ctx.world, Decision { game_id, player_id, action: Action::Pay });

                player.cash -= 1;
                Result::Paid(())
            },
            Action::Run => {
                emit !(ctx.world, Decision { game_id, player_id, action: Action::Run });

                let mut risks = get !(ctx.world, (game_id, player.location_id).into(), Risks);
                let seed = starknet::get_tx_info().unbox().transaction_hash;
                let got_away = risks.run(seed);

                match got_away {
                    bool::False => {
                        player.cash -= 1;
                        Result::Mugged(())
                    },
                    bool::True => {
                        Result::GotAway(())
                    }
                }
            },
        };

        player.status = PlayerStatus::Normal(());
        player.location_id = next_location_id;
        player.turns_remaining -= 1;
        set !(ctx.world, (player));

        emit !(ctx.world, Consequence { game_id, player_id, result });
    }
}
