use dojo::world::{IWorldDispatcherTrait, WorldStorage, WorldStorageTrait};
use dojo_snf_test::{
    ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
    spawn_test_world,
};
use rollyourown::_mocks::paper_mock::IPaperMockDispatcher;
use rollyourown::config::config::IConfigDispatcher;
use rollyourown::systems::decide::IDecideDispatcher;
use rollyourown::systems::devtools::IDevtoolsDispatcher;
use rollyourown::systems::game::IGameActionsDispatcher;
use rollyourown::systems::game_token::contracts::IGameTokenSystemsDispatcher;
use rollyourown::systems::laundromat::ILaundromatDispatcher;
use rollyourown::systems::ryo::IRyoDispatcher;
use starknet::ContractAddress;


fn NAMESPACE() -> ByteArray {
    "dopewars"
}

fn namespace_def() -> NamespaceDef {
    let mut resources = array![
        TestResource::Model("Game"), TestResource::Model("GameStorePacked"),
        TestResource::Model("GameToken"), TestResource::Model("RyoConfig"),
        TestResource::Model("Season"), TestResource::Model("DrugConfig"),
        TestResource::Model("LocationConfig"), TestResource::Model("HustlerBody"),
        TestResource::Model("HustlerSlot"), TestResource::Model("EncounterStatsConfig"),
        TestResource::Model("GameConfig"), TestResource::Model("RandomnessConfig"),
        TestResource::Model("RyoAddress"), TestResource::Model("SeasonSettings"),
        TestResource::Model("SortedList"), TestResource::Model("SortedListItem"),
        TestResource::Contract("game"), TestResource::Contract("decide"),
        TestResource::Contract("laundromat"), TestResource::Contract("config"),
        TestResource::Contract("ryo"), TestResource::Contract("devtools"),
        TestResource::Contract("game_token_system_v0"), TestResource::Contract("paper_mock"),
        TestResource::Event("GameCreated"), TestResource::Event("Traveled"),
        TestResource::Event("GameOver"), TestResource::Event("TradeDrug"),
        TestResource::Event("HighVolatility"), TestResource::Event("UpgradeItem"),
        TestResource::Event("TravelEncounter"), TestResource::Event("TravelEncounterResult"),
        TestResource::Event("NewSeason"), TestResource::Event("NewHighScore"),
        TestResource::Event("Claimed"), TestResource::Event("ERC20BalanceEvent"),
    ];
    NamespaceDef { namespace: NAMESPACE(), resources: resources.span() }
}

fn contract_defs() -> Span<ContractDef> {
    let mut game_token_init_calldata: Array<felt252> = array![];
    game_token_init_calldata
        .append(
            0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec.try_into().unwrap(),
        ); // creator_address
    game_token_init_calldata
        .append(
            0x05a499a49f635d0a9379da557b3f13aeb74a1b2295944755575e6adb2b86f7dd.try_into().unwrap(),
        ); // denshokan_address

    let mut ryo_init_calldata: Array<felt252> = array![];
    ryo_init_calldata.append(0.try_into().unwrap()); // paper address (0 = use paper_mock)
    ryo_init_calldata
        .append(
            0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f.try_into().unwrap(),
        ); //vrf address
    ryo_init_calldata
        .append(
            0x025ede3b40d5A404Abe7C96755d4Bb7168e95739d75db012040901907a5E1628.try_into().unwrap(),
        ); //treasury address

    let namespace_hash = dojo::utils::bytearray_hash(@NAMESPACE());

    [
        ContractDefTrait::new(@NAMESPACE(), @"game").with_writer_of([namespace_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"decide").with_writer_of([namespace_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"laundromat").with_writer_of([namespace_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"ryo")
            .with_writer_of([namespace_hash].span())
            .with_init_calldata(ryo_init_calldata.span()),
        ContractDefTrait::new(@NAMESPACE(), @"devtools").with_writer_of([namespace_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"game_token_system_v0")
            .with_writer_of([namespace_hash].span())
            .with_init_calldata(game_token_init_calldata.span()),
        ContractDefTrait::new(@NAMESPACE(), @"config").with_writer_of([namespace_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"paper_mock").with_writer_of([namespace_hash].span()),
    ]
        .span()
}

// Grant writer permissions to test player addresses
pub fn update_permissions(world: WorldStorage) {
    let player_a: ContractAddress =
        0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059
        .try_into()
        .unwrap();
    let player_b: ContractAddress =
        0x025ede3b40d5A404Abe7C96755d4Bb7168e95739d75db012040901907a5E1628
        .try_into()
        .unwrap();

    let season_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"Season");
    let ryo_config_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"RyoConfig");
    let game_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"Game");
    let game_store_packed_selector = dojo::utils::selector_from_names(
        @NAMESPACE(), @"GameStorePacked",
    );
    let game_token_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"GameToken");
    let season_settings_selector = dojo::utils::selector_from_names(
        @NAMESPACE(), @"SeasonSettings",
    );
    let game_config_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"GameConfig");
    let sorted_list_selector = dojo::utils::selector_from_names(@NAMESPACE(), @"SortedList");
    let sorted_list_item_selector = dojo::utils::selector_from_names(
        @NAMESPACE(), @"SortedListItem",
    );
    let erc20_balance_event_selector = dojo::utils::selector_from_names(
        @NAMESPACE(), @"ERC20BalanceEvent",
    );

    let model_selectors = array![
        season_selector, ryo_config_selector, game_selector, game_store_packed_selector,
        game_token_selector, season_settings_selector, game_config_selector, sorted_list_selector,
        sorted_list_item_selector, erc20_balance_event_selector,
    ];

    // Grant writer permissions on all models to both test players
    for selector in model_selectors.span() {
        world.dispatcher.grant_writer(*selector, player_a);
        world.dispatcher.grant_writer(*selector, player_b);
    }
}

#[derive(Drop)]
pub struct TestContracts {
    pub world: WorldStorage,
    pub game: IGameActionsDispatcher,
    pub decide: IDecideDispatcher,
    pub laundromat: ILaundromatDispatcher,
    pub ryo: IRyoDispatcher,
    pub devtools: IDevtoolsDispatcher,
    pub game_token: IGameTokenSystemsDispatcher,
    pub config: IConfigDispatcher,
    pub paper_mock: IPaperMockDispatcher,
}

pub fn deploy_world() -> TestContracts {
    let mut world = spawn_test_world([namespace_def()].span());
    world.sync_perms_and_inits(contract_defs());

    let game_address = world.dns_address(@"game").unwrap();
    let decide_address = world.dns_address(@"decide").unwrap();
    let laundromat_address = world.dns_address(@"laundromat").unwrap();
    let ryo_address = world.dns_address(@"ryo").unwrap();
    let devtools_address = world.dns_address(@"devtools").unwrap();
    let game_token_address = world.dns_address(@"game_token_system_v0").unwrap();
    let config_address = world.dns_address(@"config").unwrap();
    let paper_mock_address = world.dns_address(@"paper_mock").unwrap();

    update_permissions(world);

    TestContracts {
        world,
        game: IGameActionsDispatcher { contract_address: game_address },
        decide: IDecideDispatcher { contract_address: decide_address },
        laundromat: ILaundromatDispatcher { contract_address: laundromat_address },
        ryo: IRyoDispatcher { contract_address: ryo_address },
        devtools: IDevtoolsDispatcher { contract_address: devtools_address },
        game_token: IGameTokenSystemsDispatcher { contract_address: game_token_address },
        config: IConfigDispatcher { contract_address: config_address },
        paper_mock: IPaperMockDispatcher { contract_address: paper_mock_address },
    }
}

#[test]
#[fork("provable-dw")]
fn test_world_setup() {
    deploy_world();
}
