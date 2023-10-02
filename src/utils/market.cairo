use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::market::Market;
use rollyourown::models::game::{GameMode};
use rollyourown::models::drug::{Drug, DrugTrait};
use rollyourown::models::location::{Location, LocationTrait};
use rollyourown::utils::random;
use rollyourown::utils::settings::{PriceSettings, PriceSettingsImpl};
use rollyourown::systems::travel::travel::MarketEvent;

use rollyourown::constants::{
    PRICE_VAR_CHANCE, PRICE_VAR_MIN, PRICE_VAR_MAX, MARKET_EVENT_CHANCE, MARKET_EVENT_MIN,
    MARKET_EVENT_MAX
};

fn initialize_markets(
    world: IWorldDispatcher,
    ref seed: felt252,
    game_id: u32,
    game_mode: GameMode,
    location_id: felt252
) {
    let mut drugs = DrugTrait::all();
    loop {
        match drugs.pop_front() {
            Option::Some(drug_id) => {
                seed = pedersen::pedersen(seed, *drug_id);
                let price_settings = PriceSettingsImpl::new(game_mode, *drug_id);
                let market_price = random::random(
                    seed, price_settings.min_price, price_settings.max_price
                );
                let market_quantity: usize = random::random(
                    seed, price_settings.min_qty, price_settings.max_qty
                )
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
            Option::None(()) => {
                break ();
            }
        };
    };
}


fn market_variations(world: IWorldDispatcher, game_id: u32) -> Span<MarketEvent> {
    let mut market_events: Array<MarketEvent> = array![];
    let mut locations = LocationTrait::all();
    loop {
        match locations.pop_front() {
            Option::Some(location_id) => {
                let mut seed = random::seed();
                seed = pedersen::pedersen(seed, *location_id);

                let mut drugs = DrugTrait::all();
                loop {
                    match drugs.pop_front() {
                        Option::Some(drug_id) => {
                            seed = pedersen::pedersen(seed, *drug_id);
                            let rand = random::random(seed, 0, 1000);

                            if rand < PRICE_VAR_CHANCE.into() {
                                // increase price
                                price_variation_with_cash(
                                    world, game_id, *location_id, *drug_id, ref seed, true
                                );
                            } else if rand >= (999 - PRICE_VAR_CHANCE).into() {
                                // decrease price
                                price_variation_with_cash(
                                    world, game_id, *location_id, *drug_id, ref seed, false
                                );
                            } else if rand > 500 && rand <= 500 + MARKET_EVENT_CHANCE.into() {
                                // big move up
                                price_variation_with_drug(
                                    world, game_id, *location_id, *drug_id, ref seed, true
                                );
                                market_events
                                    .append(
                                        MarketEvent {
                                            game_id,
                                            location_id: *location_id,
                                            drug_id: *drug_id,
                                            increase: true
                                        }
                                    );
                            } else if rand < 500 && rand >= 500 - MARKET_EVENT_CHANCE.into() {
                                // big move down
                                price_variation_with_drug(
                                    world, game_id, *location_id, *drug_id, ref seed, false
                                );
                                market_events
                                    .append(
                                        MarketEvent {
                                            game_id,
                                            location_id: *location_id,
                                            drug_id: *drug_id,
                                            increase: false
                                        }
                                    );
                            }
                        },
                        Option::None(()) => {
                            break;
                        }
                    };
                };
            },
            Option::None(_) => {
                break;
            }
        };
    };
    market_events.span()
}


fn price_variation_with_cash(
    world: IWorldDispatcher,
    game_id: u32,
    location_id: felt252,
    drug_id: felt252,
    ref seed: felt252,
    increase: bool
) {
    let market = get!(world, (game_id, location_id, drug_id), (Market));
    let percent = random::random(seed + 1, PRICE_VAR_MIN.into(), PRICE_VAR_MAX.into());

    let market_price = market.cash / Into::<usize, u128>::into(market.quantity);
    let target_price = if increase {
        market_price * (100 + percent) / 100
    } else {
        market_price * (100 - percent) / 100
    };

    let target_cash = Into::<usize, u128>::into(market.quantity) * target_price;

    // update cash in market
    set!(
        world,
        (Market {
            game_id,
            location_id: location_id,
            drug_id: drug_id,
            cash: target_cash,
            quantity: market.quantity
        })
    );
}


fn price_variation_with_drug(
    world: IWorldDispatcher,
    game_id: u32,
    location_id: felt252,
    drug_id: felt252,
    ref seed: felt252,
    increase: bool
) {
    let market = get!(world, (game_id, location_id, drug_id), (Market));
    let percent = random::random(seed + 1, MARKET_EVENT_MIN.into(), MARKET_EVENT_MAX.into());

    let market_price = market.cash / Into::<usize, u128>::into(market.quantity);
    let target_price = if increase {
        market_price * (100 + percent) / 100
    } else {
        market_price * (100 - (percent / 2)) / 100
    };

    let target_qty = market.cash / target_price;

    // update quantity in market
    set!(
        world,
        (Market {
            game_id,
            location_id: location_id,
            drug_id: drug_id,
            cash: market.cash,
            quantity: target_qty.try_into().unwrap()
        })
    );
}

