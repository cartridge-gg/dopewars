use achievement::store::StoreTrait as BushidoStoreTrait;
use dojo::event::EventStorage;
use rollyourown::achievements::achievements_v1::Tasks;
use rollyourown::config::drugs::Drugs;
use rollyourown::events::TradeDrug;
use rollyourown::models::game::{GameMode, GameTrait};
use rollyourown::packing::drugs_packed::DrugsPackedImpl;
use rollyourown::packing::game_store::{GameStore, GameStoreTrait};
use rollyourown::packing::items_packed::ItemsPackedImpl;
use rollyourown::packing::markets_packed::MarketsPackedImpl;
use rollyourown::packing::player::PlayerImpl;
use rollyourown::store::{StoreImpl, StoreTrait};
use rollyourown::utils::math::MathImplU8;
use starknet::ContractAddress;


#[derive(Copy, Drop, Serde, PartialEq)]
pub enum TradeDirection {
    Sell,
    Buy,
}

#[derive(Copy, Drop, Serde)]
pub struct Trade {
    pub direction: TradeDirection,
    pub drug: Drugs,
    pub quantity: u32,
}

//
//
//

const MIN_TICK: usize = 0;
const MAX_TICK: usize = 63;


pub fn execute_trade(
    ref game_store: GameStore,
    trade: Trade,
    is_first_sell: bool,
    is_first_buy: bool,
    owner: ContractAddress,
) {
    // check if can trade
    assert(game_store.can_trade(), 'player cannot trade');

    // check not warrior mode
    assert(game_store.game.game_mode != GameMode::Warrior, 'warriors dont trade');

    match trade.direction {
        TradeDirection::Sell => sell(ref game_store, trade, is_first_sell, owner),
        TradeDirection::Buy => buy(ref game_store, trade, is_first_buy, owner),
    };
}

pub fn buy(ref game_store: GameStore, trade: Trade, is_first_buy: bool, owner: ContractAddress) {
    // check drug validity given player drug_level
    assert(game_store.player.can_trade_drug(trade.drug), 'u cant trade this drug');

    // get drugs
    let mut drugs = game_store.drugs.get();

    // must have no drug, or same drug
    assert(drugs.quantity == 0 || drugs.drug == trade.drug, 'one kind of drug');

    // get transport
    let transport = game_store.items.transport();
    let season_settings = game_store.season_settings();
    let drug_config = game_store.store.drug_config(season_settings.drugs_mode, trade.drug);

    // check quantity
    let max_transport = transport - (drugs.quantity * drug_config.weight.into());
    assert(trade.quantity <= max_transport, 'not enought space');

    // check cash
    let (tick, market_price) = game_store
        .get_tick_and_drug_price(game_store.player.location, trade.drug);
    let total_cost = market_price * trade.quantity;
    assert(game_store.player.cash >= total_cost, 'not enought ca$h');

    // update drug
    drugs.drug = trade.drug;
    drugs.quantity += trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash -= total_cost;

    // emit TradeDrug
    let mut store = game_store.store;
    store
        .world
        .emit_event(
            @TradeDrug {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                turn: game_store.player.turn,
                drug_id: Into::<Drugs, u8>::into(trade.drug).into(),
                quantity: trade.quantity,
                price: market_price,
                is_buy: true,
            },
        );

    if game_store.game.is_ranked() {
        let bushido_store = BushidoStoreTrait::new(store.world);

        if is_first_buy {
            if tick == MIN_TICK {
                bushido_store
                    .progress(owner.into(), Tasks::BUY_LOW, 1, starknet::get_block_timestamp());
            };
        };
    }
}


pub fn sell(
    ref game_store: GameStore,
    trade: Trade,
    is_first_sell: bool,
    owner: ContractAddress,
) {
    // check drug validity given player drug_level
    assert(game_store.player.can_trade_drug(trade.drug), 'u cant trade this drug');

    // get drugs
    let mut drugs = game_store.drugs.get();

    // must carry right drug
    assert(drugs.drug == trade.drug, 'invalid drug');

    // must have enought to sell
    assert(drugs.quantity >= trade.quantity, 'not enought drug');

    let (tick, market_price) = game_store
        .get_tick_and_drug_price(game_store.player.location, trade.drug);
    let total = market_price * trade.quantity;

    // update drug
    drugs.quantity -= trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash += total;

    // emit TradeDrug
    let mut store = game_store.store;
    store
        .world
        .emit_event(
            @TradeDrug {
                game_id: game_store.game.game_id,
                player_id: game_store.game.player_id,
                turn: game_store.player.turn,
                drug_id: Into::<Drugs, u8>::into(trade.drug).into(),
                quantity: trade.quantity,
                price: market_price,
                is_buy: false,
            },
        );

    if game_store.game.is_ranked() {
        let bushido_store = BushidoStoreTrait::new(store.world);

        if is_first_sell {
            bushido_store
                .progress(
                    owner.into(), Tasks::VOLUME, total.into(), starknet::get_block_timestamp(),
                );

            if tick == MAX_TICK {
                bushido_store
                    .progress(owner.into(), Tasks::SELL_HIGH, 1, starknet::get_block_timestamp());
            };
        };
    }
}
