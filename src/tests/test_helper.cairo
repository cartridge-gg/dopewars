// Fork testing on Sepolia

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, WorldStorage, WorldStorageTrait};
use dojo_snf_test::{
    ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
    spawn_test_world,
};
use rollyourown::config::ryo::RyoConfig;
use rollyourown::events::{
    Claimed, GameCreated, GameOver, HighVolatility, NewHighScore, NewSeason, TradeDrug,
    TravelEncounter, TravelEncounterResult, Traveled, UpgradeItem,
};
use rollyourown::models::game::Game;
use rollyourown::models::game_store_packed::GameStorePacked;
use rollyourown::models::game_token::GameToken;
use rollyourown::models::season::Season;
use rollyourown::systems::decide::{IDecideDispatcher, IDecideDispatcherTrait, decide};
use rollyourown::systems::devtools::{IDevtoolsDispatcher, IDevtoolsDispatcherTrait, devtools};
use rollyourown::systems::game::{IGameActionsDispatcher, IGameActionsDispatcherTrait, game};
use rollyourown::systems::game_token::contracts::{
    IGameTokenSystemsDispatcher, IGameTokenSystemsDispatcherTrait, game_token_system_v0,
};
use rollyourown::systems::laundromat::{
    ILaundromatDispatcher, ILaundromatDispatcherTrait, laundromat,
};
use rollyourown::systems::ryo::{IRyoDispatcher, IRyoDispatcherTrait, ryo};
use starknet::{ContractAddress, contract_address_const};


fn NAMESPACE() -> ByteArray {
    "dopewars"
}

fn namespace_def() -> NamespaceDef {
    let mut resources = array![
        TestResource::Model("Game"), TestResource::Model("GameStorePacked"),
        TestResource::Model("GameToken"), TestResource::Model("RyoConfig"),
        TestResource::Model("Season"), TestResource::Model("DrugConfig"),
        TestResource::Model("EncounterStatsConfig"), TestResource::Model("GameConfig"),
        TestResource::Model("RandomnessConfig"), TestResource::Model("RyoAddress"),
        TestResource::Model("SeasonSettings"), TestResource::Model("SortedList"),
        TestResource::Model("SortedListItem"), TestResource::Contract("game"),
        TestResource::Contract("decide"), TestResource::Contract("laundromat"),
        TestResource::Contract("ryo"), TestResource::Contract("devtools"),
        TestResource::Contract("game_token_system_v0"), TestResource::Event("GameCreated"),
        TestResource::Event("Traveled"), TestResource::Event("GameOver"),
        TestResource::Event("TradeDrug"), TestResource::Event("HighVolatility"),
        TestResource::Event("UpgradeItem"), TestResource::Event("TravelEncounter"),
        TestResource::Event("TravelEncounterResult"), TestResource::Event("NewSeason"),
        TestResource::Event("NewHighScore"), TestResource::Event("Claimed"),
    ];
    NamespaceDef { namespace: NAMESPACE(), resources: resources.span() }
}

fn contract_defs() -> Span<ContractDef> {
    let mut game_token_init_calldata: Array<felt252> = array![];
    game_token_init_calldata
        .append(
            0x065d2AB17338b5AffdEbAF95E2D79834B5f30Bac596fF55563c62C3c98700150.try_into().unwrap(),
        ); // creator_address
    game_token_init_calldata
        .append(
            0x02334dc9c950c74c3228e2a343d495ae36f0b4edf06767a679569e9f9de08776.try_into().unwrap(),
        ); // denshokan_address

    let mut ryo_init_calldata: Array<felt252> = array![];
    ryo_init_calldata
        .append(
            0x01d98402b4e52674d9460Feceb8B98DC78A039350590B73CeaA0B32ed02b1425.try_into().unwrap(),
        ); // paper address
    ryo_init_calldata
        .append(
            0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f.try_into().unwrap(),
        ); //vrf address
    ryo_init_calldata
        .append(
            0x44cea566ac53bf7c36b298e36536c1a53ba0b0bdf66b2c5f437965605acface.try_into().unwrap(),
        ); //treasury address
    [
        ContractDefTrait::new(@NAMESPACE(), @"game")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span()),
        ContractDefTrait::new(@NAMESPACE(), @"decide")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span()),
        ContractDefTrait::new(@NAMESPACE(), @"laundromat")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span()),
        ContractDefTrait::new(@NAMESPACE(), @"ryo")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span())
            .with_init_calldata(ryo_init_calldata.span()),
        ContractDefTrait::new(@NAMESPACE(), @"devtools")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span()),
        ContractDefTrait::new(@NAMESPACE(), @"game_token_system_v0")
            .with_writer_of([dojo::utils::bytearray_hash(@NAMESPACE())].span())
            .with_init_calldata(game_token_init_calldata.span()),
    ]
        .span()
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
#[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
fn test_world_setup() {
    let contracts = deploy_world();
}
