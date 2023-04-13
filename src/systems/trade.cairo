#[system]
mod Buy {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::Market;
    use rollyourown::components::market::MarketTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Cash;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksTrait;

    #[event]
    fn Bought(game_id: felt252, player_id: felt252, drug_id: felt252, quantity: usize, cost: u128) {}

    #[event]
    fn TradeRisk(game_id: felt252, player_id: felt252, event_name: felt252) {}

    // 1. Verify the caller owns the player.
    // 2. Get current price for location for quantity.
    // 3. Ensure user can afford it.
    // 4. Perform the trade.
    // 5. Update the location's inventory.
    // 6. Update the player's inventory.
    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let block_info = starknet::get_block_info().unbox();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(block_info.block_timestamp), 'cannot progress');

        let player_id = starknet::get_caller_address().into();
        let (name, location, cash) = commands::<Name, Location, Cash>::entity((game_id, (player_id)).into());
        let (market, risks) = commands::<Market, Risks>::entity((game_id, (location_id, drug_id)).into());

        let cost = market.buy(quantity);
        assert(cost < cash.amount, 'not enough cash');

        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let (event_name, money_loss, drug_loss) = risks.trade(seed);

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
        let maybe_drug = commands::<Drug>::try_entity((game_id, (player_id, drug_id)).into());
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.unwrap().quantity + quantity,
            Option::None(_) => quantity,
        };
        commands::set_entity((game_id, (player_id, drug_id)).into(), (
            Drug { 
                id: drug_id, 
                quantity: player_quantity
            }
        ));

        if event_name != 'none' { TradeRisk(game_id, player_id, event_name) }
        Bought(game_id, player_id, drug_id, quantity, cost);
        ();
    }
}

#[system]
mod Sell {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;

    use rollyourown::components::game::Game;
    use rollyourown::components::game::GameTrait;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::market::Market;
    use rollyourown::components::market::MarketTrait;
    use rollyourown::components::location::Location;
    use rollyourown::components::player::Name;
    use rollyourown::components::player::Cash;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::risks::RisksTrait;

    #[event]
    fn Sold(game_id: felt252, player_id: felt252, drug_id: felt252, quantity: usize, payout: u128) {}

    #[event]
    fn TradeRisk(game_id: felt252, player_id: felt252, event_name: felt252) {}

    fn execute(game_id: felt252, location_id: felt252, drug_id: felt252, quantity: usize) {
        let block_info = starknet::get_block_info().unbox();

        let game = commands::<Game>::entity(game_id.into());
        assert(game.tick(block_info.block_timestamp), 'cannot progress');

        let player_id = starknet::get_caller_address().into();
        let (name, location, cash)  = commands::<Name, Location, Cash>::entity((game_id, (player_id)).into());

        let maybe_drug = commands::<Drug>::try_entity((game_id, (player_id, drug_id)).into());
        let player_quantity = match maybe_drug {
            Option::Some(drug) => drug.unwrap().quantity,
            Option::None(()) => 0_u32
        };
        assert(player_quantity >= quantity, 'not enough drugs to sell');

        let (market, risks) = commands::<Market, Risks>::entity((game_id, (location_id, drug_id)).into());
        let payout = market.sell(quantity);

        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let (event_name, money_loss, drug_loss) = risks.trade(seed);

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
                quantity: player_quantity - quantity
            }
        ));

        if event_name != 'none' { TradeRisk(game_id, player_id, event_name) }
        Sold(game_id, player_id, drug_id, quantity, payout);
        ();
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
