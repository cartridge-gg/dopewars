use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Component, Copy, Drop, Serde)]
struct Market {
    cash: u128, // fixed point
    quantity: usize,
}

trait MarketTrait {
    fn buy(self: @Market, quantity: usize) -> u128;
    fn sell(self: @Market, quantity: usize) -> u128;
}

impl MarketImpl of MarketTrait {
    fn buy(self: @Market, quantity: usize) -> u128 {
        assert(quantity < *self.quantity, 'not enough liquidity');
        let (amount, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let cost = (k / (available - amount)) - cash;
        cost
    }

    fn sell(self: @Market, quantity: usize) -> u128 {
        let (amount, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let payout = cash - (k / (available + amount));
        payout
    }
}

fn normalize(amount: usize, market: @Market) -> (u128, u128, u128) {
    let amount: u128 = amount.into() * SCALING_FACTOR;
    let available: u128 = (*market.quantity).into() * SCALING_FACTOR;
    (amount, available, *market.cash)
}


#[test]
#[should_panic(expected: ('not enough liquidity', ))]
fn test_not_enough_quantity() {
    let market = Market { cash: SCALING_FACTOR * 1, quantity: 1 }; // pool 1:1
    let cost = market.buy(10);
}

#[test]
#[available_gas(100000)]
fn test_market_buy() {
    let market = Market { cash: SCALING_FACTOR * 1, quantity: 10 }; // pool 1:10
    let cost = market.buy(5);
    assert(cost == SCALING_FACTOR * 1, 'wrong cost');
}

#[test]
#[available_gas(100000)]
fn test_market_sell() {
    let market = Market { cash: SCALING_FACTOR * 1, quantity: 10 }; // pool 1:10
    let payout = market.sell(5);
    assert(payout == 3334, 'wrong payout');
}

