use rollyourown::constants::SCALING_FACTOR;

#[derive(Model, Copy, Drop, Serde)]
struct Market {
    #[key]
    game_id: u32,
    #[key]
    location_id: felt252,
    #[key]
    drug_id: felt252,
    cash: u128, // fixed point
    quantity: usize,
}


#[generate_trait]
impl MarketImpl of MarketTrait {
    #[inline(always)]
    fn buy(ref self: Market, quantity: usize) -> u128 {
        assert(quantity < self.quantity, 'not enough liquidity');
        let (amount, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let cost = (k / (available - amount)) - cash;
        cost
    }

    #[inline(always)]
    fn sell(ref self: Market, quantity: usize) -> u128 {
        let (amount, available, cash) = normalize(quantity, self);
        let k = cash * available;
        let payout = cash - (k / (available + amount));
        payout
    }
}

fn normalize(amount: usize, market: Market) -> (u128, u128, u128) {
    let amount: u128 = amount.into() * SCALING_FACTOR;
    let available: u128 = (market.quantity).into() * SCALING_FACTOR;
    (amount, available, market.cash)
}


#[test]
#[should_panic(expected: ('not enough liquidity',))]
fn test_not_enough_quantity() {
    let mut market = Market {
        game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 1
    }; // pool 1:1
    let cost = market.buy(10);
}

#[test]
#[available_gas(100000)]
fn test_market_buy() {
    let mut market = Market {
        game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 10
    }; // pool 1:10
    let cost = market.buy(5);
    assert(cost == SCALING_FACTOR * 1, 'wrong cost');
}

#[test]
#[available_gas(100000)]
fn test_market_sell() {
    let mut market = Market {
        game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 10
    }; // pool 1:10
    let payout = market.sell(5);
    assert(payout == 3334, 'wrong payout');
}
