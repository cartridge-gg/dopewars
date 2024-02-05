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
    fn get_drug_config(ref self: MarketsPacked, drug: Drugs) -> DrugConfig {
        get!(self.world, (drug), DrugConfig)
    }

    #[inline(always)]
    fn get_drugs_by_location(ref self: MarketsPacked) -> u8 {
        4
    }

    fn get_tick(ref self: MarketsPacked, location: Locations, drug: Drugs) -> usize {
        let bits = BitsImpl::from_felt(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into();

        let size: u8 = 6; // 6 bits
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

        let size: u8 = 6; // 6 bits
        let start: u8 = (location_idx * self.get_drugs_by_location() + drug_idx) * size;

        bits.replace::<usize>(start, size, value);
        self.packed = bits.into_felt();
    }

    //
    //
    //

    fn market_variations(ref self: MarketsPacked, ref randomizer: Random) {
        let mut locations = LocationsEnumerableImpl::all();
        // TODO: clean up
        let game = get!(self.world, self.game_id, Game);
        let market_settings = MarketSettingsImpl::get(game.game_mode);

        loop {
            match locations.pop_front() {
                Option::Some(location_id) => {
                    let mut drugs = DrugsEnumerableImpl::all();
                    // TODO : limit to 4 drugs !!!
                    let _ = drugs.pop_back();
                    let _ = drugs.pop_back();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_id) => {
                                let rand = randomizer.between::<u32>(0, 1000);

                                if rand < market_settings.price_var_chance.into() {
                                    // increase price
                                    let tick = self.get_tick(*location_id, *drug_id);
                                    let new_tick = tick.add_capped(2, 63);
                                    self.set_tick(*location_id, *drug_id, new_tick);
                                } else if rand >= (999 - market_settings.price_var_chance).into() {
                                    // decrease price
                                    let tick = self.get_tick(*location_id, *drug_id);
                                    let new_tick = tick.sub_capped(2, 63);
                                    self.set_tick(*location_id, *drug_id, new_tick);
                                } else if rand > 500 && rand <= 500
                                    + market_settings.market_event_chance.into() {
                                    // big move up
                                    let tick = self.get_tick(*location_id, *drug_id);
                                    let new_tick = tick.add_capped(7, 63);
                                    self.set_tick(*location_id, *drug_id, new_tick);

                                    // emit raw event
                                    let location_id_u8: u8 = (*location_id).into();
                                    let drug_id_u8: u8 = (*drug_id).into();

                                    self
                                        .world
                                        .emit_raw(
                                            array![selector!("MarketEvent")],
                                            array![
                                                self.game_id.into(),
                                                location_id_u8.into(),
                                                drug_id_u8.into(),
                                                true.into()
                                            ]
                                        );
                                } else if rand < 500 && rand >= 500
                                    - market_settings.market_event_chance.into() {
                                    // big move down

                                    let tick = self.get_tick(*location_id, *drug_id);
                                    let new_tick = tick.sub_capped(7, 63);
                                    self.set_tick(*location_id, *drug_id, new_tick);

                                    // emit raw event
                                    let location_id_u8: u8 = (*location_id).into();
                                    let drug_id_u8: u8 = (*drug_id).into();
                                    self
                                        .world
                                        .emit_raw(
                                            array![selector!("MarketEvent")],
                                            array![
                                                self.game_id.into(),
                                                location_id_u8.into(),
                                                drug_id_u8.into(),
                                                false.into()
                                            ]
                                        );
                                }
                            },
                            Option::None(()) => { break; }
                        };
                    };
                },
                Option::None(_) => { break; }
            };
        };
    }
}
