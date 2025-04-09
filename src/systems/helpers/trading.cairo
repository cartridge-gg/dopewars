use achievement::store::{Store as BushidoStore, StoreTrait as BushidoStoreTrait};
use dojo::event::EventStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::elements::quests::{types::{Quest, QuestTrait}};
use rollyourown::{
    models::{game::{GameMode, GameTrait}},
    config::{locations::{Locations}, drugs::{Drugs, DrugConfig},},
    packing::{
        game_store::{GameStore, GameStoreTrait}, player::{PlayerImpl},
        drugs_packed::{DrugsPackedImpl, DrugsUnpacked}, items_packed::{ItemsPackedImpl},
        markets_packed::{MarketsPackedImpl, MarketsPackedTrait}
    },
    store::{Store, StoreImpl, StoreTrait},
    utils::{events::{RawEventEmitterTrait, RawEventEmitterImpl}, math::{MathTrait, MathImplU8}},
    events::{TradeDrug}
};
use starknet::ContractAddress;


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

fn execute_trade(ref game_store: GameStore, trade: Trade) {
    // check if can trade
    assert(game_store.can_trade(), 'player cannot trade');

    // check not warrior mode
    assert(game_store.game.game_mode != GameMode::Warrior, 'warriors dont trade');

    match trade.direction {
        TradeDirection::Sell => sell(ref game_store, trade),
        TradeDirection::Buy => buy(ref game_store, trade),
    };
}

fn buy(ref game_store: GameStore, trade: Trade,) {
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
    let market_price = game_store.get_drug_price(game_store.player.location, trade.drug);
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
            }
        );
}


fn sell(ref game_store: GameStore, trade: Trade) {
    // check drug validity given player drug_level
    assert(game_store.player.can_trade_drug(trade.drug), 'u cant trade this drug');

    // get drugs
    let mut drugs = game_store.drugs.get();

    // must carry right drug
    assert(drugs.drug == trade.drug, 'invalid drug');

    // must have enought to sell
    assert(drugs.quantity >= trade.quantity, 'not enought drug');

    let market_price = game_store.get_drug_price(game_store.player.location, trade.drug);
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
            }
        );

    if game_store.game.is_ranked() && total > 999_999 && !game_store.player.traded_million {
        game_store.player.traded_million = true;

        let bushido_store = BushidoStoreTrait::new(store.world);
        let quest_id = Quest::Dealer.identifier(0);
        bushido_store
            .progress(
                game_store.game.player_id.into(), quest_id, 1, starknet::get_block_timestamp()
            );
    }
}
