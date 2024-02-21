use rollyourown::packing::markets_packed::MarketsPackedTrait;
use starknet::ContractAddress;
use rollyourown::{
    config::{
        locations::{Locations}, drugs::{Drugs, DrugConfig, DrugConfigImpl},
        hustlers::{HustlerItemConfig, HustlerImpl, ItemSlot}
    },
    packing::{
        game_store::{GameStore}, player::{PlayerImpl},
        drugs_packed::{DrugsPackedImpl, DrugsUnpacked}, items_packed::{ItemsPackedImpl},
        markets_packed::{MarketsPackedImpl}
    },
    utils::{events::{RawEventEmitterTrait, RawEventEmitterImpl}, math::{MathTrait, MathImplU8}}
};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Copy, Drop, Serde)]
enum TradeDirection {
    Sell,
    Buy,
}

#[derive(Copy, Drop, Serde)]
struct Trade {
    direction: TradeDirection,
    drug: Drugs,
    quantity: u32,
}

//
//
//

fn execute_price_impact(ref game_store: GameStore, trade: Trade) {
    let tick = game_store.markets.get_tick(game_store.player.location, trade.drug);

    let new_tick = match trade.direction {
        TradeDirection::Sell => { tick.sub_capped(2, 0) },
        TradeDirection::Buy => { tick.add_capped(2, 63) },
    };

    game_store.markets.set_tick(game_store.player.location, trade.drug, new_tick);
}

//
//
//

fn execute_trade(ref game_store: GameStore, trade: Trade) {
    // check if can trade 
    assert(game_store.player.can_trade(), 'player cannot trade');

    match trade.direction {
        TradeDirection::Sell => sell(ref game_store, trade),
        TradeDirection::Buy => buy(ref game_store, trade),
    };
}

fn buy(ref game_store: GameStore, trade: Trade) {
    // get drugs
    let mut drugs = game_store.drugs.get();

    // must have no drug, or same drug
    assert(drugs.quantity == 0 || drugs.drug == trade.drug, 'one kind of drug');

    // get transport
    let transport = game_store.items.get_item(ItemSlot::Transport);
    let drug_config = DrugConfigImpl::get(game_store.world, trade.drug);

    // check quantity
    let max_transport = transport.tier.stat - (drugs.quantity * drug_config.weight);
    assert(trade.quantity <= max_transport, 'not enought space');

    // check cash 
    let market_price = game_store.markets.get_drug_price(game_store.player.location, trade.drug);
    let total_cost = market_price * trade.quantity;
    assert(game_store.player.cash >= total_cost, 'not enought ca$h');

    // update drug
    drugs.drug = trade.drug;
    drugs.quantity += trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash -= total_cost;

    // emit event
    game_store
        .world
        .emit_raw(
            array![
                selector!("TradeDrug"),
                Into::<u32, felt252>::into(game_store.game.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into()
            ],
            array![
                Into::<Drugs, u8>::into(trade.drug).into(),
                Into::<u32, felt252>::into(trade.quantity),
                Into::<u32, felt252>::into(market_price),
                true.into()
            ]
        );
}


fn sell(ref game_store: GameStore, trade: Trade) {
    // get drugs
    let mut drugs = game_store.drugs.get();

    // must carry right drug
    assert(drugs.drug == trade.drug, 'invalid drug');

    // must have enought to sell
    assert(drugs.quantity >= trade.quantity, 'not enought drug');

    let market_price = game_store.markets.get_drug_price(game_store.player.location, trade.drug);
    let total = market_price * trade.quantity;

    // update drug
    drugs.quantity -= trade.quantity;
    game_store.drugs.set(drugs);

    // update cash
    game_store.player.cash += total;

    // emit event
    game_store
        .world
        .emit_raw(
            array![
                selector!("TradeDrug"),
                Into::<u32, felt252>::into(game_store.game.game_id),
                Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into()
            ],
            array![
                Into::<Drugs, u8>::into(trade.drug).into(),
                Into::<u32, felt252>::into(trade.quantity),
                Into::<u32, felt252>::into(market_price),
                false.into()
            ]
        );
}
