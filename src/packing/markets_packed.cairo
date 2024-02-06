use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::game::{Game, GameMode};

use rollyourown::utils::settings::{MarketSettings, MarketSettingsImpl};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};

use rollyourown::utils::math::{MathTrait, MathImplU8};
use rollyourown::utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl};

use rollyourown::config::{
    drugs::{Drugs, DrugsEnumerableImpl, DrugConfig, DrugConfigImpl},
    locations::{Locations, LocationsEnumerableImpl}
};

use rollyourown::packing::game_store_layout::{GameStoreLayout, GameStoreLayoutPackableImpl};

#[derive(Copy, Drop)]
struct MarketsPacked {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    packed: felt252
}

impl MarketsPackedDefaultImpl of Default<MarketsPacked> {
    fn default() -> MarketsPacked {
        MarketsPacked {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            packed: 0
        }
    }
}


#[generate_trait]
impl MarketsPackedImpl of MarketsPackedTrait {
    #[inline(always)]
    fn new(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress) -> MarketsPacked {
        let packed: u256 = core::pedersen::pedersen(game_id.into(), player_id.into()).into();
        let mask = BitsMathImpl::mask::<u256>(GameStoreLayout::Markets.bits());
        let safe_packed: felt252 = (packed & mask).try_into().unwrap();
        MarketsPacked { world, game_id, player_id, packed: safe_packed }
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
        let drug_idx: u8 = drug.into();

        let size: u8 = self.get_slot_size();
        let start: u8 = (location_idx * self.get_drugs_by_location() + drug_idx) * size;

        bits.extract_into::<usize>(start, size)
    }


    fn get_drug_price(ref self: MarketsPacked, location: Locations, drug: Drugs) -> usize {
        let drug_config = self.get_drug_config(drug);
        let tick = self.get_tick(location, drug);

        tick * drug_config.step + (drug_config.base)
    }

    //
    //
    //

    fn set_tick(ref self: MarketsPacked, location: Locations, drug: Drugs, value: usize) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into();

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
                Option::Some(location_id) => {
                    let mut drugs = DrugsEnumerableImpl::all();
                    // limit to 4 drugs slots
                    let _ = drugs.pop_back();
                    let _ = drugs.pop_back();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_id) => {
                                let rand: u16 = randomizer.between::<u16>(1, 1000).into();
                                let tick = self.get_tick(*location_id, *drug_id);
                                let direction = rand > 500;

                                // kind of dopessian distribution
                                let variation = if rand <= 200 || rand >= 799 {
                                    1_u32
                                } else if rand <= 350 || rand >= 649 {
                                    2_u32
                                } else if rand <= 475 || rand >= 524 {
                                    4_u32
                                } else if rand <= 496 || rand >= 503 {
                                    6_u32
                                } else {
                                    12_u32
                                };

                                let new_tick = if direction {
                                    tick.add_capped(variation, 63)
                                } else {
                                    tick.sub_capped(variation, 0)
                                };

                                self.set_tick(*location_id, *drug_id, new_tick);

                                if variation == 12_u32 {
                                    // emit raw event
                                    let location_id_u8: u8 = (*location_id).into();
                                    let drug_id_u8: u8 = (*drug_id).into();

                                    self
                                        .world
                                        .emit_raw(
                                            array![selector!("HighVolatility")],
                                            array![
                                                self.game_id.into(),
                                                location_id_u8.into(),
                                                drug_id_u8.into(),
                                                direction.into()
                                            ]
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
}

//
//
//

#[cfg(test)]
mod tests {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::{MarketsPacked, MarketsPackedImpl, RandomImpl};

    #[test]
    #[available_gas(100000000)]
    fn test_markets_variations_v1() {
        let world = dojo::test_utils::spawn_test_world(array![]);

        let mut market_packed = MarketsPackedImpl::new(world, 0, 0.try_into().unwrap());
        let mut randomizer = RandomImpl::new(world);
        market_packed.market_variations(ref randomizer);
    }
}
