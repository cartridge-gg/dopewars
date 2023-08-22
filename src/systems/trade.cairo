#[system]
mod buy {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;

    use dojo::world::Context;

    use rollyourown::events::Bought;
    use rollyourown::components::name::Name;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::Location;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::market::{Market, MarketTrait};

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(
        ctx: Context, game_id: u32, location_id: felt252, drug_id: felt252, quantity: usize
    ) {
        let player_id = ctx.origin;
        let game = get !(ctx.world, game_id, (Game));
        assert(game.tick(), 'cannot progress');

        let mut player = get !(ctx.world, (game_id, player_id).into(), Player);
        assert(player.location_id == location_id, 'player is not at location');

        let mut market = get !(ctx.world, (game_id, location_id, drug_id).into(), Market);

        let cost = market.buy(quantity);
        assert(cost < player.cash, 'not enough cash');

        // update market
        market.cash += cost;
        market.quantity -= quantity;
        set !(ctx.world, (market));

        // update player
        player.cash -= cost;
        set !(ctx.world, (player));

        let mut player_drug = get !(ctx.world, (game_id, player_id, drug_id).into(), Drug);
        player_drug.game_id = game_id;
        player_drug.player_id = player_id;
        player_drug.drug_id = drug_id;
        player_drug.quantity += quantity;
        set !(ctx.world, (player_drug));

        emit!(ctx.world, Bought { game_id, player_id, drug_id, quantity, cost});
    }
}

#[system]
mod sell {
    use traits::Into;
    use array::ArrayTrait;

    use dojo::world::Context;

    use rollyourown::events::Sold;
    use rollyourown::components::name::Name;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::Location;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::market::{Market, MarketTrait};

    fn execute(
        ctx: Context, game_id: u32, location_id: felt252, drug_id: felt252, quantity: usize
    ) {
        let player_id = ctx.origin;
        let game = get !(ctx.world, game_id, Game);
        assert(game.tick(), 'cannot progress');

        let mut player = get !(ctx.world, (game_id, player_id).into(), Player);
        assert(player.location_id == location_id, 'player is not at location');

        let mut drug = get !(ctx.world, (game_id, player_id, drug_id).into(), Drug);
        assert(drug.quantity >= quantity, 'not enough drugs to sell');

        let mut market = get !(ctx.world, (game_id, location_id, drug_id).into(), Market);
        let payout = market.sell(quantity);

        // update market
        market.quantity += quantity;
        market.cash -= payout;
        set !(ctx.world, (market));

        // update player
        player.cash += payout;
        set !(ctx.world, (player));

        drug.quantity -= quantity;
        set !(ctx.world, (drug));

        emit!(ctx.world, Sold { game_id, player_id, drug_id, quantity, payout });
    }
}

