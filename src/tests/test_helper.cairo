// use crate::utils::randomness_helper;
use dojo::model::ModelStorageTest;
use dojo::world::{WorldStorage, WorldStorageTrait};
use dojo_cairo_test::{NamespaceDef, TestResource, spawn_test_world};
use game_components_minigame::interface::IMinigameDispatcher;
use rollyourown::config::game::{GameConfig, m_GameConfig};
use rollyourown::config::randomness::{RandomnessConfig, m_RandomnessConfig};
use rollyourown::config::ryo::{RyoConfigTrait, m_RyoConfig};
use rollyourown::config::ryo_address::m_RyoAddress;
use rollyourown::config::settings::{
    CashMode, DrugsMode, EncountersMode, EncountersOddsMode, HealthMode, SeasonSettings, TurnsMode,
    WantedMode, m_SeasonSettings,
};
use rollyourown::events::{
    // GameCreated, Traveled, GameOver, TradeDrug, HighVolatility, UpgradeItem,
    // TravelEncounter, TravelEncounterResult, NewSeason, NewHighScore, Claimed,
    e_GameCreated, e_Traveled, e_GameOver, e_TradeDrug, e_HighVolatility, e_UpgradeItem,
    e_TravelEncounter, e_TravelEncounterResult, e_NewSeason, e_NewHighScore, e_Claimed,
};
use rollyourown::models::game::m_Game;
use rollyourown::models::game_store_packed::m_GameStorePacked;
use rollyourown::models::game_token::m_GameToken;
use rollyourown::models::season::{Season, m_Season};
use rollyourown::store::{StoreImpl, StoreTrait};
use rollyourown::systems::game::{IGameActionsDispatcher, game as game_systems};
use rollyourown::tests::mocks::denshokan::FullTokenContract;
use rollyourown::utils::sorted_list::{m_SortedList, m_SortedListItem};
use starknet::ContractAddress;


fn ZERO() -> ContractAddress {
    0.try_into().unwrap()
}

fn PLAYER() -> ContractAddress {
    'PLAYER'.try_into().unwrap()
}

#[derive(Copy, Drop)]
pub struct SystemDispatchers {
    pub game: IGameActionsDispatcher,
    pub game_token: IMinigameDispatcher,
}

pub fn setup_game_world() -> (WorldStorage, SystemDispatchers) {
    let dopewars_namespace = NamespaceDef {
        namespace: "dopewars",
        resources: [
            // Core models
            TestResource::Model(m_Game::TEST_CLASS_HASH.into()),
            TestResource::Model(m_GameStorePacked::TEST_CLASS_HASH.into()),
            TestResource::Model(m_GameToken::TEST_CLASS_HASH.into()),
            TestResource::Model(m_Season::TEST_CLASS_HASH.into()),
            TestResource::Model(m_SortedList::TEST_CLASS_HASH.into()),
            TestResource::Model(m_SortedListItem::TEST_CLASS_HASH.into()),
            // Config models
            TestResource::Model(m_RyoConfig::TEST_CLASS_HASH.into()),
            TestResource::Model(m_RyoAddress::TEST_CLASS_HASH.into()),
            TestResource::Model(m_RandomnessConfig::TEST_CLASS_HASH.into()),
            TestResource::Model(m_GameConfig::TEST_CLASS_HASH.into()),
            TestResource::Model(m_SeasonSettings::TEST_CLASS_HASH.into()),
            // Events
            TestResource::Event(e_GameCreated::TEST_CLASS_HASH.into()),
            TestResource::Event(e_Traveled::TEST_CLASS_HASH.into()),
            TestResource::Event(e_GameOver::TEST_CLASS_HASH.into()),
            TestResource::Event(e_TradeDrug::TEST_CLASS_HASH.into()),
            TestResource::Event(e_HighVolatility::TEST_CLASS_HASH.into()),
            TestResource::Event(e_UpgradeItem::TEST_CLASS_HASH.into()),
            TestResource::Event(e_TravelEncounter::TEST_CLASS_HASH.into()),
            TestResource::Event(e_TravelEncounterResult::TEST_CLASS_HASH.into()),
            TestResource::Event(e_NewSeason::TEST_CLASS_HASH.into()),
            TestResource::Event(e_NewHighScore::TEST_CLASS_HASH.into()),
            TestResource::Event(e_Claimed::TEST_CLASS_HASH.into()),
            // Contracts
            TestResource::Contract(game_systems::TEST_CLASS_HASH.into()),
        ]
            .span(),
    };

    let dope_namespace = NamespaceDef { namespace: "dope", resources: [].span() };

    let mut world = spawn_test_world([dopewars_namespace, dope_namespace].span());

    // Get the game contract address from the deployed namespace
    let (game_contract_address, _) = world.dns(@"game").unwrap();
    let game_dispatcher = IGameActionsDispatcher { contract_address: game_contract_address };

    // Deploy mock denshokan contract for game token functionality
    // TODO: Deploy FullTokenContract when deployment API is available
    let game_token_contract = 0x1234.try_into().unwrap();
    let game_token_dispatcher = IMinigameDispatcher { contract_address: game_token_contract };

    // Initialize configuration
    let mut store = StoreImpl::new(world);

    // Initialize RyoConfig
    let ryo_config = RyoConfigTrait::build_initial_ryo_config();
    store.save_ryo_config(@ryo_config);

    let randomness_config = RandomnessConfig {
        key: 0, use_vrf: false, vrf_provider: 0.try_into().unwrap(),
    };
    world.write_model_test(@randomness_config);

    // Initialize GameConfig for season version 1
    let game_config = GameConfig {
        season_version: 1,
        cash: 420,
        health: 100,
        max_turns: 6,
        max_wanted_shopping: 3,
        max_rounds: 3,
        rep_drug_step: 20,
        rep_buy_item: 3,
        rep_carry_drugs: 2,
        rep_hospitalized: 4,
        rep_jailed: 6,
    };
    world.write_model_test(@game_config);

    // Initialize Season for version 1
    let season = Season {
        version: 1,
        season_duration: 86400, // 1 day
        season_time_limit: 120, // 2 minutes
        paper_fee: 1000,
        treasury_fee_pct: 10,
        next_version_timestamp: starknet::get_block_timestamp() + 86400,
        paper_balance: 0,
        high_score: 0,
    };
    world.write_model_test(@season);

    // Initialize SeasonSettings for version 1
    let season_settings = SeasonSettings {
        season_version: 1,
        cash_mode: CashMode::Broke,
        health_mode: HealthMode::Junkie,
        turns_mode: TurnsMode::OnSpeed,
        encounters_mode: EncountersMode::Chill,
        encounters_odds_mode: EncountersOddsMode::Easy,
        drugs_mode: DrugsMode::Cheap,
        wanted_mode: WantedMode::KoolAndTheGang,
    };
    world.write_model_test(@season_settings);

    let dispatchers = SystemDispatchers {
        game: game_dispatcher, game_token: game_token_dispatcher,
    };

    (world, dispatchers)
}

#[test]
#[available_gas(300000000)]
fn test_setup_game_world() {
    let (world, _dispatchers) = setup_game_world();

    let mut store = StoreImpl::new(world);
    let ryo_config = store.ryo_config();
    assert(ryo_config.initialized, 'ryo config not initialized');
    assert(!ryo_config.paused, 'should not be paused');
}
