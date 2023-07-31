#[system]
mod bank_deposit {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;
    use serde::Serde;

    use dojo::world::Context;

    use rollyourown::components::name::Name;
    use rollyourown::components::player::Player;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::bank::{Bank};
    use rollyourown::events::{emit, BankDeposit};


    // 1. Verify the caller owns the player.
    // 2. Ensure user have enough money
    // 3. Update player's cash
    // 4. Update bank cash
    fn execute(ctx: Context, game_id: u32, quantity: u128) {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.origin.into();
        let player_key = (game_id, player_id).into();
        let (player, bank) = get !(ctx.world, player_key, (Player, Bank));

        assert(quantity <= player.cash, 'not enough cash');

        // update bank
        set !(ctx.world, player_key, (Bank { amount: bank.amount + quantity }));

        // update player
        set !(
            ctx.world,
            player_key,
            (Player {
                cash: player.cash - quantity,
                health: player.health,
                turns_remaining: player.turns_remaining,
            })
        );

        //  event
        let mut event_values = ArrayTrait::new();
        Serde::serialize(@BankDeposit { game_id, player_id, quantity: quantity }, ref event_values);
        emit(ctx, 'BankDeposit', event_values.span());
    }
}


#[system]
mod bank_withdraw {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;
    use serde::Serde;

    use dojo::world::Context;

    use rollyourown::components::name::Name;
    use rollyourown::components::player::Player;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::bank::{Bank};
    use rollyourown::events::{emit, BankWithdraw};


    // 1. Verify the caller owns the player.
    // 2. Ensure can withdraw money
    // 3. Update player's cash
    // 4. Update bank cash
    fn execute(ctx: Context, game_id: u32, quantity: u128) {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.origin.into();
        let player_key = (game_id, player_id).into();
        let (player, bank) = get !(ctx.world, player_key, (Player, Bank));

        assert(bank.amount >= quantity, 'not enough cash');

        // update bank
        set !(ctx.world, player_key, (Bank { amount: bank.amount - quantity }));

        // update player
        set !(
            ctx.world,
            player_key,
            (Player {
                cash: player.cash + quantity,
                health: player.health,
                turns_remaining: player.turns_remaining,
            })
        );

        //  event
        let mut event_values = ArrayTrait::new();
        Serde::serialize(
            @BankWithdraw { game_id, player_id, quantity: quantity }, ref event_values
        );
        emit(ctx, 'BankWithdraw', event_values.span());
    }
}
