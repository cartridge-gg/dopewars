use starknet::{get_caller_address, ContractAddress};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::constants::SCALING_FACTOR;

use rollyourown::models::game::{Game, GameMode};
use rollyourown::models::player::Player;
use rollyourown::models::drug::{DrugEnum, Drug, DrugTrait};
use rollyourown::models::location::{Location, LocationTrait, LocationEnum};

use rollyourown::utils::settings::{MarketSettings, MarketSettingsImpl};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};


use rollyourown::utils::math::{MathTrait, MathImplU8};
use rollyourown::utils::bits::{Bits, BitsImpl, BitsTrait};


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

//
//
//

#[derive(Model, Copy, Drop, Serde)]
struct MarketPacked {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    packed: felt252
}

//
//
//

#[derive(Copy, Drop, Serde)]
struct DrugPriceConfig {
    base: usize,
    step: usize,
}

#[derive(Copy, Drop, Serde)]
struct DrugPrice {
    drug: DrugEnum,
    config: DrugPriceConfig,
}

//
//
//

#[generate_trait]
impl DrugPriceImpl of DrugPriceTrait {
    #[inline(always)]
    fn new(drug: DrugEnum) -> DrugPrice {
        DrugPrice { drug, config: get_drug_price_config(drug) }
    }

    #[inline(always)]
    fn get_drug_price_by_tick(self: @DrugPrice, tick: usize) -> usize {
        tick * (*self.config.step) + (*self.config.base)
    }
}


//
//
//

#[generate_trait]
impl MarketImpl of MarketTrait {
    fn new(game_id: u32, player_id: ContractAddress) -> MarketPacked {
        let packed = core::pedersen::pedersen(0, game_id.into());
        MarketPacked { game_id, player_id, packed }
    }

    fn get(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress) -> MarketPacked {
        get!(world, (game_id, player_id), (MarketPacked))
    }

    fn get_tick(ref self: MarketPacked, location: LocationEnum, drug: DrugEnum) -> usize {
        let bits = BitsImpl::from(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into();

        let size: u8 = 6; // 6 bits
        let start: u8 = (location_idx * 6 + drug_idx) * size;

        bits.extract_into::<usize>(start, size)
    }


    fn get_drug_price(ref self: MarketPacked, location: LocationEnum, drug: DrugEnum) -> usize {
        let drug_price = DrugPriceImpl::new(drug);
        let tick = self.get_tick(location, drug);

        drug_price.get_drug_price_by_tick(tick)
    }

    //
    //
    //

    fn quote_buy(
        ref self: MarketPacked, location: LocationEnum, drug: DrugEnum, quantity: usize
    ) -> usize {
        let drug_price = self.get_drug_price(location, drug);
        let cost = drug_price * quantity;
        cost
    }

    fn quote_sell(
        ref self: MarketPacked, location: LocationEnum, drug: DrugEnum, quantity: usize
    ) -> usize {
        let drug_price = self.get_drug_price(location, drug);
        let payout = drug_price * quantity;
        payout
    }

    //
    //
    //

    fn set_tick(ref self: MarketPacked, location: LocationEnum, drug: DrugEnum, value: usize) {
        let mut bits = BitsImpl::from(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into();

        let size: u8 = 6; // 6 bits
        let start: u8 = (location_idx * 6 + drug_idx) * size;

        bits.replace::<usize>(start, size, value);
        self.packed = bits.into_felt();
    }

    //
    //
    //

    fn market_variations(ref self: MarketPacked, world: IWorldDispatcher, ref randomizer: Random) {
        let mut locations = LocationTrait::all();
        let game = get!(world, self.game_id, Game);
        let player = get!(world, (self.game_id, self.player_id), Player);
        let market_settings = MarketSettingsImpl::get(game.game_mode);

        loop {
            match locations.pop_front() {
                Option::Some(location_id) => {
                    let mut drugs = DrugTrait::all();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_id) => {
                                let rand = randomizer.between::<u32>(0, 1000);

                                if rand < market_settings.price_var_chance.into() {
                                    // increase price
                                    let tick = self.get_tick(*location_id, *drug_id);
                                    let new_tick = tick.add_capped(2, 63);
                                    self.set_tick(*location_id, *drug_id, new_tick);
                                } else if rand >= (999 - market_settings.price_var_chance)
                                    .into() { 
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

                                    world
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
                                    world
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

        // update market
        set!(world, (self));
    }
}

