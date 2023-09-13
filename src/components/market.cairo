use traits::{Into, TryInto};
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::constants::SCALING_FACTOR;

#[derive(Component, Copy, Drop, Serde)]
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

#[derive(Copy, Drop)]
struct PricingInfos {
    min_price: u128,
    max_price: u128,
    min_qty: u128,
    max_qty: u128,
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

    #[inline(always)]
    fn get_pricing_info(drug_id: felt252) -> PricingInfos {
        if drug_id == 'Acid' {
            PricingInfos {
                min_price: 700 * SCALING_FACTOR,
                max_price: 4400 * SCALING_FACTOR,
                min_qty: 400,
                max_qty: 900,
            }
        } else if drug_id == 'Weed' {
            PricingInfos {
                min_price: 260 * SCALING_FACTOR,
                max_price: 720 * SCALING_FACTOR,
                min_qty: 500,
                max_qty: 1000,
            }
        } else if drug_id == 'Ludes' {
            PricingInfos {
                min_price: 20 * SCALING_FACTOR,
                max_price: 70 * SCALING_FACTOR,
                min_qty: 800,
                max_qty: 2000,
            }
        } else if drug_id == 'Speed' {
            PricingInfos {
                min_price: 70 * SCALING_FACTOR,
                max_price: 260 * SCALING_FACTOR,
                min_qty: 600,
                max_qty: 1500,
            }
        } else if drug_id == 'Heroin' {
            PricingInfos {
                min_price: 6900 * SCALING_FACTOR,
                max_price: 22000 * SCALING_FACTOR,
                min_qty: 300,
                max_qty: 700,
            }
        } else if drug_id == 'Cocaine' {
            PricingInfos {
                min_price: 14800 * SCALING_FACTOR,
                max_price: 36000 * SCALING_FACTOR,
                min_qty: 250,
                max_qty: 600,
            }
        } else {
            panic(array!['invalid drug_id']);
            PricingInfos { min_price: 0, max_price: 0, min_qty: 0, max_qty: 0, }
        }
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
