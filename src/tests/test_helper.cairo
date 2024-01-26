use debug::PrintTrait;

use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::class_hash::Felt252TryIntoClassHash;

use dojo::test_utils::{spawn_test_world};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::{
    game::{game, Game}, player::{player, Player}, drug::{drug, Drug},
    encounter::{encounter, Encounter}, item::{item, Item},
    market_packed::{market_packed, MarketPacked}
};


use rollyourown::systems::{
    decide::{decide, IDecideDispatcher, IDecideDispatcherTrait},
    lobby::{lobby, ILobbyDispatcher, ILobbyDispatcherTrait},
    shop::{shop, IShopDispatcher, IShopDispatcherTrait},
    trade::{trade, ITradeDispatcher, ITradeDispatcherTrait},
    travel::{travel, ITravelDispatcher, ITravelDispatcherTrait}
};


fn ZERO() -> ContractAddress {
    contract_address_const::<0>()
}

fn PLAYER() -> ContractAddress {
    contract_address_const::<'PLAYER'>()
}


#[derive(Copy, Clone, Drop)]
struct SystemDispatchers {
    decide: IDecideDispatcher,
    lobby: ILobbyDispatcher,
    shop: IShopDispatcher,
    trade: ITradeDispatcher,
    travel: ITravelDispatcher,
}


fn spawn_world() -> (IWorldDispatcher, SystemDispatchers) {
    let models = array![
        drug::TEST_CLASS_HASH,
        game::TEST_CLASS_HASH,
        item::TEST_CLASS_HASH,
        market_packed::TEST_CLASS_HASH,
        player::TEST_CLASS_HASH,
        encounter::TEST_CLASS_HASH,
    ];

    let world = spawn_test_world(models);

    let systems = SystemDispatchers {
        decide: IDecideDispatcher {
            contract_address: world
                .deploy_contract('paper', decide::TEST_CLASS_HASH.try_into().unwrap())
        },
        lobby: ILobbyDispatcher {
            contract_address: world
                .deploy_contract('paper', lobby::TEST_CLASS_HASH.try_into().unwrap())
        },
        shop: IShopDispatcher {
            contract_address: world
                .deploy_contract('paper', shop::TEST_CLASS_HASH.try_into().unwrap())
        },
        trade: ITradeDispatcher {
            contract_address: world
                .deploy_contract('paper', trade::TEST_CLASS_HASH.try_into().unwrap())
        },
        travel: ITravelDispatcher {
            contract_address: world
                .deploy_contract('paper', travel::TEST_CLASS_HASH.try_into().unwrap())
        },
    };

    // TODO: setup auth

    (world, systems)
}


#[test]
#[available_gas(200000000)]
fn test_spawn_world() {
    let (world, systems) = spawn_world();
}
