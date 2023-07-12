#[system]
mod buy {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;

    use dojo::world::Context;

    use rollyourown::components::name::Name;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::Location;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::market::{Market, MarketTrait};

    #[event]
    fn Bought(game_id: u32, player_id: felt252, drug_name: felt252, quantity: usize, cost: u128) {}

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(
        ctx: Context, game_id: u32, location_name: felt252, drug_name: felt252, quantity: usize
    ) {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.origin.into();
        let (location, player) = get !(ctx.world, (game_id, player_id).into(), (Location, Player));
        assert(location.name == location_name, 'player is not at location');

        let market = get !(ctx.world, (game_id, location_name, drug_name).into(), Market);

        let cost = market.buy(quantity);
        assert(cost < player.cash, 'not enough cash');

        // update market
        set !(
            ctx.world,
            (game_id, location_name, drug_name).into(),
            (Market { cash: market.cash + cost, quantity: market.quantity - quantity,  })
        );

        // update player
        set !(
            ctx.world,
            (game_id, player_id).into(),
            (Player {
                cash: player.cash - cost,
                health: player.health,
                turns_remaining: player.turns_remaining,
            })
        );
        let maybe_drug = try_get !(ctx.world, (game_id, player_id, drug_name).into(), Drug);
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity + quantity,
            Option::None(_) => quantity,
        };
        set !(
            ctx.world,
            (game_id, player_id, drug_name).into(),
            (Name { short_string: drug_name }, Drug { quantity: player_quantity })
        );

        Bought(game_id, player_id, drug_name, quantity, cost);
    }
}

#[system]
mod sell {
    use traits::Into;
    use array::ArrayTrait;

    use dojo::world::Context;

    use rollyourown::components::name::Name;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::player::Player;
    use rollyourown::components::location::Location;
    use rollyourown::components::game::{Game, GameTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};
    use rollyourown::components::market::{Market, MarketTrait};

    #[event]
    fn Sold(game_id: u32, player_id: felt252, drug_name: felt252, quantity: usize, payout: u128) {}

    fn execute(
        ctx: Context, game_id: u32, location_name: felt252, drug_name: felt252, quantity: usize
    ) {
        let game = get !(ctx.world, game_id.into(), Game);
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.origin.into();
        let (location, player) = get !(ctx.world, (game_id, player_id).into(), (Location, Player));
        assert(location.name == location_name, 'player is not at location');

        let maybe_drug = try_get !(ctx.world, (game_id, player_id, drug_name).into(), Drug);
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity,
            Option::None(()) => 0
        };
        assert(player_quantity >= quantity, 'not enough drugs to sell');

        let market = get !(ctx.world, (game_id, location_name, drug_name).into(), Market);
        let payout = market.sell(quantity);

        // update market
        set !(
            ctx.world,
            (game_id, location_name, drug_name).into(),
            (Market { cash: market.cash - payout, quantity: market.quantity + quantity,  })
        );

        // update player
        set !(
            ctx.world,
            (game_id, player_id).into(),
            (Player {
                cash: player.cash + payout,
                health: player.health,
                turns_remaining: player.turns_remaining,
            })
        );
        set !(
            ctx.world,
            (game_id, player_id, drug_name).into(),
            (Name { short_string: drug_name }, Drug { quantity: player_quantity - quantity })
        );

        Sold(game_id, player_id, drug_name, quantity, payout);
    }
}

