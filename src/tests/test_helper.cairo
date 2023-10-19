use debug::PrintTrait;

use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::class_hash::Felt252TryIntoClassHash;

use dojo::test_utils::{spawn_test_world};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::drug::{drug, Drug};
use rollyourown::models::game::{game, Game};
use rollyourown::models::item::{item, Item};
use rollyourown::models::market::{market, Market};
use rollyourown::models::player::{player, Player};

use rollyourown::systems::decide::{decide, IDecideDispatcher, IDecideDispatcherTrait};
use rollyourown::systems::lobby::{lobby, ILobbyDispatcher, ILobbyDispatcherTrait};
use rollyourown::systems::shop::{shop, IShopDispatcher, IShopDispatcherTrait};
use rollyourown::systems::trade::{trade, ITradeDispatcher, ITradeDispatcherTrait};
use rollyourown::systems::travel::{travel, ITravelDispatcher, ITravelDispatcherTrait};


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
        market::TEST_CLASS_HASH,
        player::TEST_CLASS_HASH,
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
