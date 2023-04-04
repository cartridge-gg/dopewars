#[system]
mod Buy {
    use traits::Into;
    use array::ArrayTrait;
    use option::OptionTrait;
    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameLibraryDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;

    use rollyourown::components::drug::Drug;
    use rollyourown::components::drug::IDrugLibraryDispatcher;
    use rollyourown::components::drug::IDrugDispatcherTrait;

    use rollyourown::components::market::Market;
    use rollyourown::components::market::IMarketLibraryDispatcher;
    use rollyourown::components::market::IMarketDispatcherTrait;

    use rollyourown::components::market::MarketTrait;

    use rollyourown::components::location::Location;
    use rollyourown::components::location::ILocationLibraryDispatcher;
    use rollyourown::components::location::ILocationDispatcherTrait;

    use rollyourown::components::player::Name;
    use rollyourown::components::player::INameLibraryDispatcher;
    use rollyourown::components::player::INameDispatcherTrait;

    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::IInventoryLibraryDispatcher;
    use rollyourown::components::player::IInventoryDispatcherTrait;

    use rollyourown::components::player::Cash;
    use rollyourown::components::player::ICashLibraryDispatcher;
    use rollyourown::components::player::ICashDispatcherTrait;

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::get((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_some(), 'player not found');

        let market = commands::<Market>::get((game_id, (location_id, drug_id)).into());
        assert(market.is_some(), 'drug market not found');

        let cost = MarketTrait::buy(market.unwrap(), quantity);
        assert(cost < cash.unwrap().amount, 'not enough cash');

        // update market
        let _ = commands::set((game_id, (location_id, drug_id)).into(), (
            Market {
                cash: market.unwrap().cash + cost, 
                quantity: market.unwrap().quantity - quantity,
            }
        ));

        // update player
        let _ = commands::set((game_id, (player_id)).into(), (
            Cash { amount: cash.unwrap().amount - cost },
        ));
        let drug = commands::<Drug>::get((game_id, (player_id, drug_id)).into());
        let updated_quantity = match drug {
            Option::Some(x) => x.quantity + quantity,
            Option::None(_) => quantity,
        };
        let _ = commands::set((game_id, (player_id, drug_id)).into(), (
            Drug { 
                id: drug_id, 
                quantity: updated_quantity
            }
        ));

        return ();
    }
}



#[system]
mod Sell {
    use traits::Into;
    use array::ArrayTrait;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::IGameLibraryDispatcher;
    use rollyourown::components::game::IGameDispatcherTrait;

    use rollyourown::components::drug::Drug;
    use rollyourown::components::drug::IDrugLibraryDispatcher;
    use rollyourown::components::drug::IDrugDispatcherTrait;

    use rollyourown::components::market::Market;
    use rollyourown::components::market::IMarketLibraryDispatcher;
    use rollyourown::components::market::IMarketDispatcherTrait;
    use rollyourown::components::market::MarketTrait;

    use rollyourown::components::location::Location;
    use rollyourown::components::location::ILocationLibraryDispatcher;
    use rollyourown::components::location::ILocationDispatcherTrait;

    use rollyourown::components::player::Name;
    use rollyourown::components::player::INameLibraryDispatcher;
    use rollyourown::components::player::INameDispatcherTrait;

    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::IInventoryLibraryDispatcher;
    use rollyourown::components::player::IInventoryDispatcherTrait;

    use rollyourown::components::player::Cash;
    use rollyourown::components::player::ICashLibraryDispatcher;
    use rollyourown::components::player::ICashDispatcherTrait;

    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_some(), 'game not found');
        assert(!game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::get((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_some(), 'player not found');

        let market = commands::<Market>::get((game_id, (location_id, drug_id)).into());
        assert(market.is_some(), 'market not found');

        let drug = commands::<Drug>::get((game_id, (player_id, drug_id)).into());
        assert(drug.is_some(), 'player do not own this drug');
        assert(drug.unwrap().quantity >= quantity, 'not enough drugs to sell');

        let payout = MarketTrait::sell(market.unwrap(), quantity);

        // update market
        let _ = commands::set((game_id, (location_id, drug_id)).into(), (
            Market {
                cash: market.unwrap().cash - payout, 
                quantity: market.unwrap().quantity + quantity,
            }
        ));

        // update player
        let _ = commands::set((game_id, (player_id)).into(), (
            Cash { amount: cash.unwrap().amount + payout },
        ));
        let _ = commands::set((game_id, (player_id, drug_id)).into(), (
            Drug { 
                id: drug_id, 
                quantity: drug.unwrap().quantity - quantity
            }
        ));

        return ();
    }
}