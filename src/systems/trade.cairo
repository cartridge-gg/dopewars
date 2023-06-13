#[system]
mod Buy {
    use traits::Into;
    use array::ArrayTrait;
    use debug::PrintTrait;
    use dojo_core::integer::{u250, ContractAddressIntoU250, U32IntoU250};

    use rollyourown::components::{
        game::{Game, GameTrait}, drug::Drug, market::{Market, MarketTrait}, location::Location
    };
    use rollyourown::components::{player::Cash, risks::{Risks, RisksTrait}};

    #[event]
    fn Bought(partition: u250, player_id: u250, drug_id: u250, quantity: usize, cost: u128) {}

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(ctx: Context, partition: u250, location_id: u250, drug_id: u250, quantity: usize) {
        let game = commands::<Game>::entity(partition.into());
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.caller_account.into();
        let (location, cash) = commands::<(
            Location, Cash
        )>::entity((partition, (player_id)).into_partitioned());
        let market = commands::<Market>::entity(
            (partition, (location_id, drug_id)).into_partitioned()
        );

        let cost = market.buy(quantity);
        assert(cost < cash.amount, 'not enough cash');

        // FIX: moving this to end of function for some reason causes
        // dojo-test error: #4864: Inconsistent references annotations.
        Bought(partition, player_id, drug_id, quantity, cost);

        // update market
        commands::set_entity(
            (partition, (location_id, drug_id)).into_partitioned(),
            (Market { cash: market.cash + cost, quantity: market.quantity - quantity,  })
        );

        // update player
        commands::set_entity(
            (partition, (player_id)).into_partitioned(), (Cash { amount: cash.amount - cost }, )
        );
        let maybe_drug = commands::<Drug>::try_entity(
            (partition, (player_id, drug_id)).into_partitioned()
        );
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity + quantity,
            Option::None(_) => quantity,
        };
        commands::set_entity(
            (partition, (player_id, drug_id)).into_partitioned(),
            (Drug { id: drug_id, quantity: player_quantity })
        );
    }
}

#[system]
mod Sell {
    use traits::Into;
    use array::ArrayTrait;
    use dojo_core::integer::{u250, ContractAddressIntoU250, U32IntoU250};

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
    fn Sold(partition: u250, player_id: u250, drug_id: u250, quantity: usize, payout: u128) {}

    fn execute(ctx: Context, partition: u250, location_id: u250, drug_id: u250, quantity: usize) {
        let game = commands::<Game>::entity(partition.into());
        assert(game.tick(), 'cannot progress');

        let player_id = ctx.caller_account.into();
        let (location, cash) = commands::<(
            Location, Cash
        )>::entity((partition, (player_id)).into_partitioned());

        let maybe_drug = commands::<Drug>::try_entity(
            (partition, (player_id, drug_id)).into_partitioned()
        );
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.quantity,
            Option::None(()) => 0
        };
        assert(player_quantity >= quantity, 'not enough drugs to sell');

        let market = commands::<Market>::entity(
            (partition, (location_id, drug_id)).into_partitioned()
        );
        let payout = market.sell(quantity);

        // update market
        commands::set_entity(
            (partition, (location_id, drug_id)).into_partitioned(),
            (Market { cash: market.cash - payout, quantity: market.quantity + quantity,  })
        );

        // update player
        commands::set_entity(
            (partition, (player_id)).into_partitioned(), (Cash { amount: cash.amount + payout }, )
        );
        commands::set_entity(
            (partition, (player_id, drug_id)).into_partitioned(),
            (Drug { id: drug_id, quantity: player_quantity - quantity })
        );

        Sold(partition, player_id, drug_id, quantity, payout);
    }
}
//This causes a libfunc error
// #[system]
// mod Test {
//     use traits::Into;
//     use array::ArrayTrait;
//     use option::OptionTrait;

//     #[derive(Component)]
//     struct Position {
//         x: felt252,
//         y: felt252,
//     }

//     fn execute() {
//         let maybe_pos = commands::<(Position)>::entity(0.into());
//         let pos = maybe_pos.is_some();
//         let maybe_pos_2 = commands::<(Position)>::entity(0.into());
//         let pos = maybe_pos.unwrap(); // seems like any method call errs (is_none(), is_some(), etc)
//     }
// }


