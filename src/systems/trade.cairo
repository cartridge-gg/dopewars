#[system]
mod Buy {
    use traits::Into;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::Market;
    use rollyourown::components::market::MarketTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::Cash;

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::entity((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;

        let market = commands::<Market>::entity((game_id, (location_id, drug_id)).into());
        let cost = market.buy(quantity);
        assert(cost < cash.amount, 'not enough cash');

        // update market
        commands::set_entity((game_id, (location_id, drug_id)).into(), (
            Market {
                cash: market.cash + cost, 
                quantity: market.quantity - quantity,
            }
        ));

        // update player
        commands::set_entity((game_id, (player_id)).into(), (
            Cash { amount: cash.amount - cost },
        ));
        let drug = commands::<Drug>::entity((game_id, (player_id, drug_id)).into());
        let updated_quantity = drug.quantity + quantity;

        commands::set_entity((game_id, (player_id, drug_id)).into(), (
            Drug { 
                id: drug_id, 
                quantity: updated_quantity
            }
        ));

        return ();
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


#[system]
mod Sell {
    use traits::Into;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::Market;
    use rollyourown::components::market::MarketTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::Cash;

    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::entity(game_id.into());
        assert(!game.is_finished, 'game is finished');

        let (name, location, inventory, cash) = commands::<Name, Location, Inventory, Cash>::entity((game_id, (player_id)).into());

        let drug = commands::<Drug>::entity((game_id, (player_id, drug_id)).into());
        assert(drug.quantity >= quantity, 'not enough drugs to sell');

        let market = commands::<Market>::entity((game_id, (location_id, drug_id)).into());
        let payout = market.sell(quantity);

        // update market
        commands::set_entity((game_id, (location_id, drug_id)).into(), (
            Market {
                cash: market.cash - payout, 
                quantity: market.quantity + quantity,
            }
        ));

        // update player
        commands::set_entity((game_id, (player_id)).into(), (
            Cash { amount: cash.amount + payout },
        ));
        commands::set_entity((game_id, (player_id, drug_id)).into(), (
            Drug { 
                id: drug_id, 
                quantity: drug.quantity - quantity
            }
        ));

        return ();
    }
}