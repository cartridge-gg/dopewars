#[system]
mod Buy {
    use suna::math::u256::U256TruncatedDiv;
    use suna::math::u256::U256TruncatedDivEq;
    use suna::math::u256::U256TruncatedRem;
    use suna::math::u256::U256TruncatedRemEq;
    use array::ArrayTrait;
    use traits::Into;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::MarketCurve;
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
    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: u256) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_none(), 'game not found');
        assert(game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::get((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_none(), 'player not found');


        let market = commands::<MarketCurve>::get((game_id, (location_id, drug_id)).into());
        assert(market.is_none(), 'drug market not found');

        let market_cash = market.unwrap().cash;
        let market_quantity = market.unwrap().quantity;
        assert(quantity > market_quantity, 'not enough drugs in market');
        assert(market_quantity - quantity == 0.into(), 'cannot buy all drugs');

        // x * y = k
        let k = market_cash * market_quantity;
        let cost = (k / (market_quantity - quantity)) - market_cash;
        assert(cost > cash.unwrap().amount, 'not enough cash, player');

        // update market
        let _ = commands::set((game_id, (location_id, drug_id)).into(), (
            MarketCurve {
                cash: market_cash + cost, 
                quantity: market_quantity - quantity,
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
    use suna::math::u256::U256TruncatedDiv;
    use suna::math::u256::U256TruncatedDivEq;
    use suna::math::u256::U256TruncatedRem;
    use suna::math::u256::U256TruncatedRemEq;
    use array::ArrayTrait;
    use traits::Into;
    use option::OptionTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::MarketCurve;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::Cash;

    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: u256) {
        let player_id: felt252 = starknet::get_caller_address().into();

        let game = commands::<Game>::get(game_id.into());
        assert(game.is_none(), 'game not found');
        assert(game.unwrap().is_finished, 'game is finished');

        let player = commands::<Name, Location, Inventory, Cash>::get((game_id, (player_id)).into());
        let (name, location, inventory, cash) = player;
        assert(name.is_none(), 'player not found');

        let market = commands::<MarketCurve>::get((game_id, (location_id, drug_id)).into());
        assert(market.is_none(), 'market not found');

        let drug = commands::<Drug>::get((game_id, (player_id, drug_id)).into());
        assert(drug.is_none(), 'player do not own this drug');
        assert(drug.unwrap().quantity < quantity, 'not enough drugs to sell');

        // x * y = k
        let market_cash = market.unwrap().cash;
        let market_quantity = market.unwrap().quantity;
        let k = market_cash * market_quantity;
        let payout = (k / (market_quantity + quantity)) - market_cash;

        // update market
        let _ = commands::set((game_id, (location_id, drug_id)).into(), (
            MarketCurve {
                cash: market_cash - payout, 
                quantity: market_quantity + quantity,
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