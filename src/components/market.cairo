use traits::Into;
use traits::TryInto;
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Component)]
struct Market {
    cash: u128, // fixed point
    quantity: usize,
}

trait MarketTrait {
    fn buy(self: @Market, quantity: usize) -> u128;
    fn sell(self: @Market, quantity: usize) -> u128;
}

impl MarketImpl of MarketTrait {
    fn buy(self: @Market, amount: usize) -> u128 {
        assert(amount < *self.quantity, 'not enough liquidity');
        let (amount, available, cash) = normalize(amount, self);
        let k = cash * available;
        let cost = (k / (available - amount)) - cash;
        cost
    }

    fn sell(self: @Market, amount: usize) -> u128 {
        let (amount, available, cash) = normalize(amount, self);
        let k = cash * available;
        let payout = cash - (k / (available + amount));
        payout
    }
}

fn normalize(amount: usize, market: @Market) -> (u128, u128, u128) {
    let amount: u128 = amount.into().try_into().unwrap() * SCALING_FACTOR;
    let available: u128 = (*market.quantity).into().try_into().unwrap() * SCALING_FACTOR;
    (amount, available, *market.cash)
}


#[test]
#[should_panic]
fn test_not_enough_quantity() {
    let market = Market { cash: SCALING_FACTOR * 1_u128, quantity: 1_usize }; // pool 1:1
    let cost = market.buy(10_usize);
}

#[test]
#[available_gas(100000)]
fn test_market_buy() {
    let market = Market { cash: SCALING_FACTOR * 1_u128, quantity: 10_usize }; // pool 1:10
    let cost = market.buy(5_usize);
    assert(cost == SCALING_FACTOR * 1_u128, 'wrong cost');
}

#[test]
#[available_gas(100000)]
fn test_market_sell() {
    let market = Market { cash: SCALING_FACTOR * 1_u128, quantity: 10_usize }; // pool 1:10
    let payout = market.sell(5_usize);
    assert(payout == 3334_u128, 'wrong payout');
}

