use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game, GameMode}, systems::game::game::HighVolatility,
    utils::{
        events::{RawEventEmitterTrait, RawEventEmitterImpl},
        random::{Random, RandomImpl, RandomTrait}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl},
    },
    config::{
        drugs::{Drugs, DrugsEnumerableImpl, DrugConfig, DrugConfigImpl},
        locations::{Locations, LocationsEnumerableImpl},
    },
    packing::game_store_layout::{GameStoreLayout, GameStoreLayoutPackableImpl},
};


#[derive(Copy, Drop)]
struct MarketsPacked {
    world: IWorldDispatcher,
    game: Game,
    //
    packed: felt252
}

#[generate_trait]
impl MarketsPackedImpl of MarketsPackedTrait {
    #[inline(always)]
    fn new(world: IWorldDispatcher, game: Game) -> MarketsPacked {
        let packed: u256 = core::pedersen::pedersen(game.game_id.into(), game.player_id.into())
            .into();
        let mask = BitsMathImpl::mask::<u256>(GameStoreLayout::Markets.bits());
        let safe_packed: felt252 = (packed & mask).try_into().unwrap();
        MarketsPacked { world, game, packed: safe_packed }
    }

    #[inline(always)]
    fn get_drugs_by_location(self: MarketsPacked) -> u8 {
        4
    }

    #[inline(always)]
    fn get_slot_size(self: MarketsPacked) -> u8 {
        6
    }

    #[inline(always)]
    fn get_drug_config(ref self: MarketsPacked, drug: Drugs) -> DrugConfig {
        get!(self.world, (drug), DrugConfig)
    }

    fn get_tick(ref self: MarketsPacked, location: Locations, drug: Drugs) -> usize {
        let bits = BitsImpl::from_felt(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into() % self.get_drugs_by_location();

        let size: u8 = self.get_slot_size();
        let start: u8 = (location_idx * self.get_drugs_by_location() + drug_idx) * size;

        bits.extract_into::<usize>(start, size)
    }


    fn get_drug_price(ref self: MarketsPacked, location: Locations, drug: Drugs) -> usize {
        let drug_config = self.get_drug_config(drug);
        let tick = self.get_tick(location, drug);

        tick * drug_config.step.into() + drug_config.base.into()
    }

    //
    //
    //

    fn set_tick(ref self: MarketsPacked, location: Locations, drug: Drugs, value: usize) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into() % self.get_drugs_by_location();

        let size: u8 = self.get_slot_size();
        let start: u8 = (location_idx * self.get_drugs_by_location() + drug_idx) * size;

        bits.replace::<usize>(start, size, value);
        self.packed = bits.into_felt();
    }

    //
    //
    //

    fn market_variations(ref self: MarketsPacked, ref randomizer: Random) {
        let mut locations = LocationsEnumerableImpl::all();

        loop {
            match locations.pop_front() {
                Option::Some(location) => {
                    
                    // limit to 4 drugs slots == [0,1,2,3]
                    let mut drugs = array![
                        Drugs::Ludes,
                        Drugs::Speed,
                        Drugs::Weed,
                        Drugs::Shrooms,
                    ].span();
                  
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug) => {
                                let rand: u16 = randomizer.between::<u16>(1, 1000).into();
                                let tick = self.get_tick(*location, *drug);
                                let direction = rand > 500;

                                // kind of dopessian distribution
                                let variation = if rand <= 200 || rand >= 799 {
                                    1_u32
                                } else if rand <= 350 || rand >= 649 {
                                    2_u32
                                } else if rand <= 475 || rand >= 524 {
                                    4_u32
                                } else if rand <= 495 || rand >= 504 {
                                    6_u32
                                } else {
                                    12_u32
                                };

                                let new_tick = if direction {
                                    tick.add_capped(variation, 63)
                                } else {
                                    tick.sub_capped(variation, 0)
                                };

                                self.set_tick(*location, *drug, new_tick);

                                if variation == 12_u32 {
                                    // emit HighVolatility
                                    self
                                        .world
                                        .emit_raw(
                                            array![
                                                selector!("HighVolatility"),
                                                Into::<u32, felt252>::into(self.game.game_id),
                                                Into::<
                                                    ContractAddress, felt252
                                                >::into(self.game.player_id),
                                            ],
                                            array![
                                                Into::<Locations, u8>::into(*location).into(),
                                                Into::<Drugs, u8>::into(*drug).into(),
                                                Into::<bool, felt252>::into(direction),
                                            ],
                                        );
                                }
                            },
                            Option::None => { break; }
                        };
                    };
                },
                Option::None(_) => { break; }
            };
        };
    }

     //
    //
    //

    fn shuffle_drug_prices(ref self: MarketsPacked, ref randomizer: Random, drug_level: u8) {
        let mut locations = LocationsEnumerableImpl::all();

        let drug = drug_level.sub_capped(1,0);

        loop {
            match locations.pop_front() {
                Option::Some(location) => {
                    let rand_tick = randomizer.between::<usize>(0, 63).into();
                    self.set_tick(*location, drug.into(), rand_tick);
                },
                Option::None(_) => { break; }
            };
        };
    }
}

//
//
//

#[cfg(test)]
mod tests {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::{MarketsPacked, MarketsPackedImpl, RandomImpl};
// #[test]
// #[available_gas(100000000)]
// fn test_markets_variations_v1() {
//     let world = dojo::test_utils::spawn_test_world(array![]);

//     let mut market_packed = MarketsPackedImpl::new(world, 0, 0.try_into().unwrap());
//     let mut randomizer = RandomImpl::new(world);
//     market_packed.market_variations(ref randomizer);
// }
}
