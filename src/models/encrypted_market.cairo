use core::option::OptionTrait;
use core::traits::TryInto;
use rollyourown::constants::SCALING_FACTOR;

use rollyourown::models::location::LocationEnum;
use rollyourown::models::drug::DrugEnum;
use rollyourown::models::market::Market;

use core::poseidon::PoseidonTrait;
use core::hash::{HashStateTrait, HashStateExTrait};


#[derive(Model, Copy, Drop, Serde)]
struct EncryptedMarket {
    #[key]
    game_id: u32,
    #[key]
    location_id: LocationEnum,
    #[key]
    drug_id: DrugEnum,
    cash: felt252, // fixed point
    quantity: felt252,
}

//#[generate_trait]
//impl MarketImpl of MarketTrait {
//    #[inline(always)]
//    fn buy(ref self: Market, quantity: usize) -> u128 {
//        assert(quantity < self.quantity, 'not enough liquidity');
//   
//    }
//
//    #[inline(always)]
//    fn sell(ref self: Market, quantity: usize) -> u128 {
//        let (amount, available, cash) = normalize(quantity, self);
//        let k = cash * available;
//        let payout = cash - (k / (available + amount));
//        payout
//    }
//}


 #[test]
 fn test_market_encrypted() {
     let mut market = Market {
         game_id: 0, location_id: LocationEnum::Queens , drug_id: DrugEnum::Ludes, cash: SCALING_FACTOR * 1, quantity: 10
     }; // pool 1:10

     let cash_hash = PoseidonTrait::new().update_with(SCALING_FACTOR * 1).finalize();

     let quantity_hash = PoseidonTrait::new().update_with(10).finalize();

     println!("Creating new Encrypted_Market");

     let mut encrypted_market = EncryptedMarket {
         game_id: 0, location_id: LocationEnum::Queens , drug_id: DrugEnum::Ludes, cash: cash_hash, quantity: quantity_hash
     };

    println!("encrypted_market.quantity: {}", encrypted_market.quantity);

 }
