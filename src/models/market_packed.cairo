use starknet::{get_caller_address, ContractAddress};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::game::{Game, GameMode};
use rollyourown::models::player::Player;
use rollyourown::models::drug::{Drug};

use rollyourown::utils::settings::{MarketSettings, MarketSettingsImpl};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};

use rollyourown::utils::math::{MathTrait, MathImplU8};
use rollyourown::utils::bits::{Bits, BitsImpl, BitsTrait};

use rollyourown::config::{
    drugs::{Drugs, DrugsEnumerableImpl, DrugConfig, DrugConfigImpl},
    locations::{Locations, LocationsEnumerableImpl}
};

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

#[generate_trait]
impl MarketImpl of MarketTrait {
    #[inline(always)]
    fn new(game_id: u32, player_id: ContractAddress) -> MarketPacked {
        let packed = core::pedersen::pedersen(0, game_id.into());
        MarketPacked { game_id, player_id, packed }
    }

    #[inline(always)]
    fn get(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress) -> MarketPacked {
        get!(world, (game_id, player_id), (MarketPacked))
    }

    #[inline(always)]
    fn get_drug_config(world: IWorldDispatcher, drug: Drugs) -> DrugConfig {
        get!(world, (drug), (DrugConfig))
    }

    fn get_tick(ref self: MarketPacked, location: Locations, drug: Drugs) -> usize {
        let bits = BitsImpl::from_felt(self.packed);

        let location_idx: u8 = location.into() - 1;
        let drug_idx: u8 = drug.into();

        let size: u8 = 6; // 6 bits
        let drugs_by_location: u8 = 4;
        let start: u8 = (location_idx * drugs_by_location + drug_idx) * size;

        bits.extract_into::<usize>(start, size)
    }


    fn get_drug_price(
        ref self: MarketPacked, world: IWorldDispatcher, location: Locations, drug: Drugs
    ) -> usize {
        let drug_config = MarketTrait::get_drug_config(world, drug);
        let tick = self.get_tick(location, drug);

        tick * drug_config.step + (drug_config.base)
    }


    //
    //
    //

    fn quote_buy(
        ref self: MarketPacked,
        world: IWorldDispatcher,
        location: Locations,
        drug: Drugs,
        quantity: u8
    ) -> usize {
        let drug_price = self.get_drug_price(world, location, drug);
        let cost = drug_price * quantity.into();
        cost
    }

    fn quote_sell(
        ref self: MarketPacked,
        world: IWorldDispatcher,
        location: Locations,
        drug: Drugs,
        quantity: u8
    ) -> usize {
        let drug_price = self.get_drug_price(world, location, drug);
        let payout = drug_price * quantity.into();
        payout
    }

    //
    //
    //

    fn set_tick(ref self: MarketPacked, location: Locations, drug: Drugs, value: usize) {
        let mut bits = BitsImpl::from_felt(self.packed);

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
        let mut locations = LocationsEnumerableImpl::all();
        let game = get!(world, self.game_id, Game);
        let player = get!(world, (self.game_id, self.player_id), Player);
        let market_settings = MarketSettingsImpl::get(game.game_mode);

        loop {
            match locations.pop_front() {
                Option::Some(location_id) => {
                    let mut drugs = DrugsEnumerableImpl::all();
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

