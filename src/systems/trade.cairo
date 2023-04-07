#[system]
mod Buy {
    use traits::Into;
    use array::ArrayTrait;
    use option::OptionTrait;
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
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::entity((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_some(), 'player not found');

        let maybe_market = commands::<Market>::entity((game_id, (location_id, drug_id)).into());
        assert(maybe_market.is_some(), 'drug market not found');

        let market = maybe_market.unwrap();
        let cost = market.buy(quantity);
        assert(cost < cash.unwrap().amount, 'not enough cash');

        // update market
        commands::set_entity((game_id, (location_id, drug_id)).into(), (
            Market {
                cash: market.cash + cost, 
                quantity: market.quantity - quantity,
            }
        ));

        // update player
        commands::set_entity((game_id, (player_id)).into(), (
            Cash { amount: cash.unwrap().amount - cost },
        ));
        let drug = commands::<Drug>::entity((game_id, (player_id, drug_id)).into());
        let updated_quantity = match drug {
            Option::Some(x) => x.quantity + quantity,
            Option::None(_) => quantity,
        };
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
    use option::OptionTrait;

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

        let maybe_game = commands::<Game>::entity(game_id.into());
        let game = maybe_game.expect('game not found');
        assert(!game.is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::entity((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_some(), 'player not found');

        let maybe_drug = commands::<Drug>::entity((game_id, (player_id, drug_id)).into());
        let drug = maybe_drug.expect('player do not own this drug');
        assert(drug.quantity >= quantity, 'not enough drugs to sell');

        let maybe_market = commands::<Market>::entity((game_id, (location_id, drug_id)).into());
        let market = maybe_market.expect('market not found');
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
            Cash { amount: cash.unwrap().amount + payout },
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