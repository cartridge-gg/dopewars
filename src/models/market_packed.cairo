use rollyourown::constants::SCALING_FACTOR;

use rollyourown::models::location::LocationEnum;
use rollyourown::models::drug::DrugEnum;

struct DrugPriceConfig {
    base: usize,
    step: usize,
}

fn get_drug_price_config(drug: DrugEnum) -> DrugPriceConfig {
    match drug {
        DrugEnum::Ludes => DrugPriceConfig { base: 15, step: 1 },
        DrugEnum::Speed => DrugPriceConfig { base: 85, step: 5 },
        DrugEnum::Weed => DrugPriceConfig { base: 420, step: 22 },
        DrugEnum::Acid => DrugPriceConfig { base: 1400, step: 64 },
        DrugEnum::Heroin => DrugPriceConfig { base: 5500, step: 185 },
        DrugEnum::Cocaine => DrugPriceConfig { base: 9500, step: 260 },
    }
}

fn get_drug_price_by_tick(drug: DrugEnum, tick: usize) -> usize {
    let config = get_drug_price_config(drug);
    config.base + tick * config.step
}

//
//
//




#[derive(Model, Copy, Drop, Serde)]
struct MarketPacked {
    #[key]
    game_id: u32,
    packed: felt252
}

// packed layout
// [0..5]     Location 0 | Drug 0
// [6..11]    Location 0 | Drug 1
// [12..17]   Location 0 | Drug 2
// [18..23]   Location 0 | Drug 3
// [24..29]   Location 0 | Drug 4
// [30..35]   Location 0 | Drug 5
// ...
// [203..208] Location 5 | Drug 4
// [209..215] Location 5 | Drug 5


// 6 bit mask = 2^6 - 1 = 63 = 0x3F

const MASK_6_BITS: felt252 = 0x3F;

#[generate_trait]
impl MarketPackedImpl of MarketPackedTrait {
    fn new(game_id: u32) -> MarketPacked {
        let packed = core::pedersen::pedersen(0,game_id.into());
        MarketPacked {
            game_id,
            packed
        }
    } 

    fn get_drug_price(ref self: MarketPacked, location: LocationEnum, drug: DrugEnum) -> usize {
        let location_idx :u8 = location.into();
        let drug_idx :u8 = location.into();
        0
    }

    fn get_at(ref self: MarketPacked, start_idx: u8, mask: felt252) -> felt252 {
      //  let shifted = ( self.packed >> start_idx ) && mask;
        0
    }


    fn quote_buy(ref self: MarketPacked, quantity: usize) -> u128 {
        0
    }

    fn quote_sell(ref self: MarketPacked, quantity: usize) -> u128 {
        0
    }


  
}

// #[generate_trait]
// impl MarketImpl of MarketTrait {
//     #[inline(always)]
//     fn buy(ref self: Market, quantity: usize) -> u128 {
//         assert(quantity < self.quantity, 'not enough liquidity');
//         let (amount, available, cash) = normalize(quantity, self);
//         let k = cash * available;
//         let cost = (k / (available - amount)) - cash;
//         cost
//     }

//     #[inline(always)]
//     fn sell(ref self: Market, quantity: usize) -> u128 {
//         let (amount, available, cash) = normalize(quantity, self);
//         let k = cash * available;
//         let payout = cash - (k / (available + amount));
//         payout
//     }
// }

// fn normalize(amount: usize, market: Market) -> (u128, u128, u128) {
//     let amount: u128 = amount.into() * SCALING_FACTOR;
//     let available: u128 = (market.quantity).into() * SCALING_FACTOR;
//     (amount, available, market.cash)
// }

// #[test]
// #[should_panic(expected: ('not enough liquidity',))]
// fn test_not_enough_quantity() {
//     let mut market = Market {
//         game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 1
//     }; // pool 1:1
//     let cost = market.buy(10);
// }

// #[test]
// #[available_gas(100000)]
// fn test_market_buy() {
//     let mut market = Market {
//         game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 10
//     }; // pool 1:10
//     let cost = market.buy(5);
//     assert(cost == SCALING_FACTOR * 1, 'wrong cost');
// }

// #[test]
// #[available_gas(100000)]
// fn test_market_sell() {
//     let mut market = Market {
//         game_id: 0, location_id: 0, drug_id: 0, cash: SCALING_FACTOR * 1, quantity: 10
//     }; // pool 1:10
//     let payout = market.sell(5);
//     assert(payout == 3334, 'wrong payout');
// }


