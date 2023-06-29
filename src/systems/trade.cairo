#[system]
mod Buy {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;

    use rollyourown::components::{
        game::{Game, GameTrait}, drug::Drug, market::{Market, MarketTrait}, location::Location
    };
    use rollyourown::components::{player::Cash, risks::{Risks, RisksTrait}};

    #[event]
    fn Bought(game_id: u32, player_id: felt252, drug_id: u32, quantity: usize, cost: u128) {}

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(ctx: Context, game_id: u32, location_id: u32, drug_id: u32, quantity: usize) {
        let game = get !(ctx, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.caller_account.into();
        let (location, cash) = get !(ctx, (game_id, player_id).into(), (Location, Cash));
        let market = get !(ctx, (game_id, location_id, drug_id).into(), Market);

        let cost = market.buy(quantity);
        assert(cost < cash.amount, 'not enough cash');

        // FIX: moving this to end of function for some reason causes
        // dojo-test error: #4864: Inconsistent references annotations.
        Bought(game_id, player_id, drug_id, quantity, cost);

        // update market
        set !(
            ctx,
            (game_id, location_id, drug_id).into(),
            (Market { cash: market.cash + cost, quantity: market.quantity - quantity,  })
        );

        // update player
        set !(ctx, (game_id, player_id).into(), (Cash { amount: cash.amount - cost }, ));
        let maybe_drug = try_get !(ctx, (game_id, player_id, drug_id).into(), Drug);
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity + quantity,
            Option::None(_) => quantity,
        };
        set !(
            ctx,
            (game_id, player_id, drug_id).into(),
            (Drug { id: drug_id, quantity: player_quantity })
        );
    }
}

#[system]
mod Sell {
    use traits::Into;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::Market;
    use rollyourown::components::market::MarketTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Cash;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksTrait;

    #[event]
    fn Sold(game_id: u32, player_id: felt252, drug_id: u32, quantity: usize, payout: u128) {}

    fn execute(ctx: Context, game_id: u32, location_id: u32, drug_id: u32, quantity: usize) {
        let game = get !(ctx, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.caller_account.into();
        let (location, cash) = get !(ctx, (game_id, player_id).into(), (Location, Cash));

        let maybe_drug = try_get !(ctx, (game_id, player_id, drug_id).into(), Drug);
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity,
            Option::None(()) => 0
        };
        assert(player_quantity >= quantity, 'not enough drugs to sell');

        let market = get !(ctx, (game_id, location_id, drug_id).into(), Market);
        let payout = market.sell(quantity);

        // update market
        set !(
            ctx,
            (game_id, location_id, drug_id).into(),
            (Market { cash: market.cash - payout, quantity: market.quantity + quantity,  })
        );

        // update player
        set !(ctx, (game_id, player_id).into(), (Cash { amount: cash.amount + payout }, ));
        set !(
            ctx,
            (game_id, player_id, drug_id).into(),
            (Drug { id: drug_id, quantity: player_quantity - quantity })
        );

        Sold(game_id, player_id, drug_id, quantity, payout);
    }
}

