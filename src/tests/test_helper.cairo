use starknet::{ContractAddress, contract_address_const};
use dojo::world::{IWorldDispatcherTrait, WorldStorage, WorldStorageTrait, IWorldDispatcher};
use dojo_snf_test::{
    ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
    spawn_test_world,
};
use rollyourown::models::game::{Game};
use rollyourown::models::game_store_packed::{GameStorePacked};
use rollyourown::models::game_token::{GameToken};
use rollyourown::models::season::{Season};
use rollyourown::config::ryo::RyoConfig;
use rollyourown::events::{GameCreated, Traveled, GameOver, TradeDrug, HighVolatility, UpgradeItem, TravelEncounter, TravelEncounterResult, NewSeason, NewHighScore, Claimed};
use rollyourown::systems::game::{game, IGameActionsDispatcher, IGameActionsDispatcherTrait};
use rollyourown::systems::decide::{decide, IDecideDispatcher, IDecideDispatcherTrait};
use rollyourown::systems::laundromat::{laundromat, ILaundromatDispatcher, ILaundromatDispatcherTrait};
use rollyourown::systems::ryo::{ryo, IRyoDispatcher, IRyoDispatcherTrait};
use rollyourown::systems::devtools::{devtools, IDevtoolsDispatcher, IDevtoolsDispatcherTrait};
use rollyourown::systems::game_token::contracts::{game_token_system_v0, IGameTokenSystemsDispatcher, IGameTokenSystemsDispatcherTrait};

fn PLAYER_1() -> ContractAddress {
    'PLAYER_1'.try_into().unwrap()
}

fn NAMESPACE() -> ByteArray {
    "dopewars"
}

fn namespace_def() -> NamespaceDef {
    let mut resources = array![
        TestResource::Model("Game"),
        TestResource::Model("GameStorePacked"),
        TestResource::Model("GameToken"),
        TestResource::Model("RyoConfig"),
        TestResource::Model("Season"),
        TestResource::Model("DrugConfig"),
        TestResource::Model("EncounterStatsConfig"),
        TestResource::Model("GameConfig"),
        TestResource::Model("RandomnessConfig"),
        TestResource::Model("RyoAddress"),
        TestResource::Model("SeasonSettings"),
        TestResource::Model("SortedList"),
        TestResource::Model("SortedListItem"),
        TestResource::Contract("game"),
        TestResource::Contract("decide"),
        TestResource::Contract("laundromat"),
        TestResource::Contract("ryo"),
        TestResource::Contract("devtools"),
        TestResource::Contract("game_token_system_v0"),
        TestResource::Event("GameCreated"),
        TestResource::Event("Traveled"),
        TestResource::Event("GameOver"),
        TestResource::Event("TradeDrug"),
        TestResource::Event("HighVolatility"),
        TestResource::Event("UpgradeItem"),
        TestResource::Event("TravelEncounter"),
        TestResource::Event("TravelEncounterResult"),
        TestResource::Event("NewSeason"),
        TestResource::Event("NewHighScore"),
        TestResource::Event("Claimed"),
    ];
    NamespaceDef { namespace: NAMESPACE(), resources: resources.span() }
}

fn contract_defs() -> Span<ContractDef> {
    let rollyourown_hash = dojo::utils::bytearray_hash(@NAMESPACE());
    [
        ContractDefTrait::new(@NAMESPACE(), @"game").with_writer_of([rollyourown_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"decide").with_writer_of([rollyourown_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"laundromat").with_writer_of([rollyourown_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"ryo").with_writer_of([rollyourown_hash].span()).with_init_calldata([0.try_into().unwrap(), 0.try_into().unwrap(), 0x0].span()), // [ paper_address , vrf_address , treasury_address ]
        ContractDefTrait::new(@NAMESPACE(), @"devtools").with_writer_of([rollyourown_hash].span()),
        ContractDefTrait::new(@NAMESPACE(), @"game_token_system_v0").with_writer_of([rollyourown_hash].span()).with_init_calldata(['player1'.try_into().unwrap(), 0x0].span()), // [ creator_address, token_address ]
    ].span()
}

#[derive(Drop)]
pub struct TestContracts {
    pub world: IWorldDispatcher,
    pub game: IGameActionsDispatcher,
    pub decide: IDecideDispatcher,
    pub laundromat: ILaundromatDispatcher,
    pub ryo: IRyoDispatcher,
    pub devtools: IDevtoolsDispatcher,
    pub game_token: IGameTokenSystemsDispatcher,
}

fn deploy_world() -> TestContracts {
    let mut world = spawn_test_world([namespace_def()].span());
    world.sync_perms_and_inits(contract_defs());

    let rollyourown_hash = dojo::utils::bytearray_hash(@NAMESPACE());
    world.dispatcher.grant_owner(rollyourown_hash, contract_address_const::<'player1'>());

    starknet::testing::set_contract_address(contract_address_const::<'player1'>());
    starknet::testing::set_account_contract_address(contract_address_const::<'player1'>());
    starknet::testing::set_block_timestamp(300000);

    let (game_address, _) = world.dns(@"game").unwrap();
    let (decide_address, _) = world.dns(@"decide").unwrap();
    let (laundromat_address, _) = world.dns(@"laundromat").unwrap();
    let (ryo_address, _) = world.dns(@"ryo").unwrap();
    let (devtools_address, _) = world.dns(@"devtools").unwrap();
    let (game_token_address, _) = world.dns(@"game_token_system_v0").unwrap();

    TestContracts {
        world: world.dispatcher,
        game: IGameActionsDispatcher { contract_address: game_address },
        decide: IDecideDispatcher { contract_address: decide_address },
        laundromat: ILaundromatDispatcher { contract_address: laundromat_address },
        ryo: IRyoDispatcher { contract_address: ryo_address },
        devtools: IDevtoolsDispatcher { contract_address: devtools_address },
        game_token: IGameTokenSystemsDispatcher { contract_address: game_token_address },
    }
}

#[test]
fn test_world_setup() {
    let contracts = deploy_world();
}