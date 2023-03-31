use traits::Into;
use suna::math::u256::U256TruncatedDiv;
use suna::math::u256::U256TruncatedDivEq;
use suna::math::u256::U256TruncatedRem;
use suna::math::u256::U256TruncatedRemEq;
use suna::math::u60f18::U60F18;

#[derive(Component)]
struct Market {
    cash: u256,
    quantity: u256,
}

trait MarketTrait {
    fn buy(self: Market, quantity: u256) -> u256;
    fn sell(self: Market, quantity: u256) ->  u256;
}

impl MarketImpl of MarketTrait {
    fn buy(self: Market, quantity: u256) -> u256 {
        assert(quantity < self.quantity, 'not enough liquidity');
        let k = self.cash * self.quantity;
        let cost = (k / (self.quantity - quantity)) - self.cash;
        cost
    }

    fn sell(self: Market, quantity: u256) ->  u256 {
        let k = self.cash * self.quantity;
        let payout = self.cash - (k / (self.quantity + quantity));
        assert(payout < self.cash, 'not enough liquidity');
        payout
    }
}

#[test]
#[should_panic]
fn test_not_enough_quantity() {
    let market = Market { cash: 1.into(), quantity: 1.into() };
    let cost = MarketTrait::buy(market, 10.into());
}

#[test]
#[should_panic]
fn test_not_enough_cash() {
    let market = Market { cash: 1.into(), quantity: 1.into() };
    let cost = MarketTrait::sell(market, 10.into());
}

#[test]
#[avaiable_gas(100000)]
fn test_market_buy() {
    let market = Market { cash: 10.into(), quantity: 10.into() };
    let cost = MarketTrait::buy(market, 5.into());
    assert(cost == 10.into(), 'wrong cost');
}

#[test]
#[avaiable_gas(100000)]
fn test_market_sell() {
    let market = Market { cash: 10.into(), quantity: 10.into() };
    let payout = MarketTrait::sell(market, 5.into());
    assert(payout == 4.into(), 'wrong payout');
}

