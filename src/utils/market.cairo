use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::market::Market;
use rollyourown::models::game::{Game, GameMode};
use rollyourown::models::drug::{Drug, DrugTrait};
use rollyourown::models::player::{Player};
use rollyourown::models::location::{Location, LocationTrait, LocationEnum};

use rollyourown::systems::travel::travel::MarketEvent;

use rollyourown::utils::settings::{PriceSettings, PriceSettingsImpl};
use rollyourown::utils::settings::{MarketSettings, MarketSettingsImpl};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};
use rollyourown::utils::math::{MathTrait, MathImplU128};

use rollyourown::constants::SCALING_FACTOR;

use debug::PrintTrait;

fn initialize_markets(
    world: IWorldDispatcher,
    ref randomizer: Random,
    game_id: u32,
    game_mode: GameMode,
    location_id: LocationEnum
) {
    let mut drugs = DrugTrait::all();

    loop {
        match drugs.pop_front() {
            Option::Some(drug_id) => {
                let price_settings = PriceSettingsImpl::get(game_mode, *drug_id);
                let market_price = randomizer
                    .between::<u128>(price_settings.min_price, price_settings.max_price)
                    .try_into()
                    .unwrap();
                let market_quantity: usize = randomizer
                    .between::<u128>(price_settings.min_qty, price_settings.max_qty)
                    .try_into()
                    .unwrap();

                let market_cash = market_quantity.into() * market_price;

                //set market entity
                set!(
                    world,
                    (Market {
                        game_id,
                        location_id: location_id,
                        drug_id: *drug_id,
                        cash: market_cash,
                        quantity: market_quantity
                    })
                );
            },
            Option::None(()) => { break (); }
        };
    };
}


fn market_variations(
    world: IWorldDispatcher, ref randomizer: Random, game_id: u32, player_id: ContractAddress
) {
    let mut locations = LocationTrait::all();
    let game = get!(world, game_id, Game);
    let player = get!(world, (game_id, player_id), Player);
    let market_settings = MarketSettingsImpl::get(game.game_mode);
    let scaling_factor = get_liquidity_scaling_factor(market_settings, player.turn);

    loop {
        match locations.pop_front() {
            Option::Some(location_id) => {
                let mut drugs = DrugTrait::all();
                loop {
                    match drugs.pop_front() {
                        Option::Some(drug_id) => {
                            let rand = randomizer.between::<u32>(0, 1000);

                            let mut market = get!(
                                world, (game_id, *location_id, *drug_id).into(), Market
                            );

                            // flat 2%
                            scale_market(ref market, market_settings.liq_scaling_flat.into());
                            //scale_market(ref market, scaling_factor);

                            if rand < market_settings.price_var_chance.into() {
                                // increase price
                                price_variation_with_cash(
                                    ref randomizer, ref market, market_settings, true
                                );
                            } else if rand >= (999 - market_settings.price_var_chance).into() {
                                // decrease price
                                price_variation_with_cash(
                                    ref randomizer, ref market, market_settings, false
                                );
                            } else if rand > 500 && rand <= 500
                                + market_settings.market_event_chance.into() {
                                // big move up
                                price_variation_with_drug(
                                    ref randomizer, ref market, market_settings, true
                                );

                                // emit raw event
                                let location_id_u8: u8 = (*location_id).into();
                                let drug_id_u8: u8 = (*drug_id).into();

                                world
                                    .emit_raw(
                                        array![selector!("MarketEvent")],
                                        array![
                                            game_id.into(),
                                            location_id_u8.into(),
                                            drug_id_u8.into(),
                                            true.into()
                                        ]
                                    );
                            } else if rand < 500 && rand >= 500
                                - market_settings.market_event_chance.into() {
                                // big move down
                                price_variation_with_drug(
                                    ref randomizer, ref market, market_settings, false
                                );

                                // emit raw event
                                let location_id_u8: u8 = (*location_id).into();
                                let drug_id_u8: u8 = (*drug_id).into();
                                world
                                    .emit_raw(
                                        array![selector!("MarketEvent")],
                                        array![
                                            game_id.into(),
                                            location_id_u8.into(),
                                            drug_id_u8.into(),
                                            false.into()
                                        ]
                                    );
                            }

                            // update market
                            set!(world, (market));
                        },
                        Option::None(()) => { break; }
                    };
                };
            },
            Option::None(_) => { break; }
        };
    };
}


fn price_variation_with_cash(
    ref randomizer: Random, ref market: Market, market_settings: MarketSettings, increase: bool
) {
    let percent = randomizer
        .between::<
            u128
        >(market_settings.price_var_min.into(), market_settings.price_var_max.into());

    let market_price = market.cash / Into::<usize, u128>::into(market.quantity);
    let target_price = if increase {
        market_price + market_price.pct(percent)
    } else {
        market_price - market_price.pct(percent)
    };

    let target_cash = Into::<usize, u128>::into(market.quantity) * target_price;

    // update cash in market
    market.cash = target_cash;
}


fn price_variation_with_drug(
    ref randomizer: Random, ref market: Market, market_settings: MarketSettings, increase: bool
) {
    let percent = randomizer
        .between::<
            u128
        >(market_settings.market_event_min.into(), market_settings.market_event_max.into());

    let market_price = market.cash / Into::<usize, u128>::into(market.quantity);
    let target_price = if increase {
        market_price + market_price.pct(percent)
    } else {
        market_price - market_price.pct(percent / 2)
    };

    let target_qty = market.cash / target_price;

    // update quantity in market
    market.quantity = target_qty.try_into().unwrap();
}


use cubit::f128::types::fixed::{Fixed, FixedTrait};

// formula : 1 + ( initial_rate - (sqrt(x/100) / fading_rate ) )
// initial_rate : 0.009
// fading_rate : 350
// result is x10_000
fn get_liquidity_scaling_factor(market_settings: MarketSettings, turn: usize) -> u128 {
    let initial_rate = FixedTrait::from_unscaled_felt(
        market_settings.liq_scaling_initial_rate.into()
    )
        / FixedTrait::from_unscaled_felt(10000);
    let fading_rate = FixedTrait::from_unscaled_felt(
        market_settings.liq_scaling_fading_rate.into()
    );
    let x_div_100 = FixedTrait::from_unscaled_felt(turn.into())
        / FixedTrait::from_unscaled_felt(100);

    let factor = FixedTrait::ONE() + (initial_rate - (FixedTrait::sqrt(x_div_100) / fading_rate));
    let scaled = factor * FixedTrait::from_unscaled_felt(10000);

    scaled.try_into().unwrap()
}


fn scale_market(ref market: Market, scaling_factor: u128) {
    market.quantity = market.quantity * scaling_factor.try_into().unwrap() / 10000;
    market.cash = market.cash * scaling_factor.into() / 10000;
}
//
//
//

// #[test]
// #[available_gas(2000000)]
// fn test_liquidity_scaling_lp() {
//     let factor_1 = get_liquidity_scaling_factor(GameMode::Limited, 1); // 10087

//     let qty = 1000;
//     let cash = 200 * 1000 * SCALING_FACTOR;
//     let price = 200;

//     let new_cash = cash * factor_1 / 10000;
//     let new_qty = qty * factor_1 / 10000;

//     'new_cash'.print();
//     new_cash.print(); // 201740 0000

//     'new_qty'.print();
//     new_qty.print(); // 1008
// }

// #[test]
// #[available_gas(2000000)]
// fn test_liquidity_scaling_factor() {
//     let factor_1 = get_liquidity_scaling_factor(GameMode::Limited, 1); // 10087
//     let factor_10 = get_liquidity_scaling_factor(GameMode::Limited, 10); // 10080
//     let factor_100 = get_liquidity_scaling_factor(GameMode::Limited, 100); // 10061
//     let factor_500 = get_liquidity_scaling_factor(GameMode::Limited, 500); // 10026
//     let factor_950 = get_liquidity_scaling_factor(GameMode::Limited, 950); // 10001
//     let factor_1000 = get_liquidity_scaling_factor(GameMode::Limited, 1000); // 9999

//     'factor_1'.print();
//     factor_1.print();

//     'factor_10'.print();
//     factor_10.print();

//     'factor_100'.print();
//     factor_100.print();

//     'factor_500'.print();
//     factor_500.print();

//     'factor_950'.print();
//     factor_950.print();

//     'factor_1000'.print();
//     factor_1000.print();
// }


