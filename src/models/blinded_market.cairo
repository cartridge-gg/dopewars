use core::option::OptionTrait;
use core::traits::TryInto;
use rollyourown::constants::SCALING_FACTOR;

use rollyourown::models::location::LocationEnum;
use rollyourown::models::drug::DrugEnum;
use rollyourown::models::market::Market;

use core::poseidon::PoseidonTrait;
use core::hash::{HashStateTrait, HashStateExTrait};


#[derive(Model, Copy, Drop, Serde)]
struct BlindedMarket {
    #[key]
    game_id: u32,
    #[key]
    location_id: LocationEnum,
    #[key]
    drug_id: DrugEnum,
    cash: felt252, // fixed point
    quantity: felt252,
}


 #[test]
 fn test_market_blinded() {
     let mut market = Market {
         game_id: 0, location_id: LocationEnum::Queens , drug_id: DrugEnum::Ludes, cash: SCALING_FACTOR * 1, quantity: 10
     }; // pool 1:10

     let cash_hash = PoseidonTrait::new().update_with(SCALING_FACTOR * 1).finalize();

     let quantity_hash = PoseidonTrait::new().update_with(10).finalize();

     println!("Creating new blinded_market");

     let mut blinded_market = BlindedMarket {
         game_id: 0, location_id: LocationEnum::Queens , drug_id: DrugEnum::Ludes, cash: cash_hash, quantity: quantity_hash
     };

    println!("blinded_market.quantity: {}", blinded_market.quantity);

 }
