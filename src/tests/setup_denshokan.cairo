// SPDX-License-Identifier: UNLICENSED

use dojo_snf_test::world::deploy_contract;

use game_components_token::examples::{
    full_token_contract::FullTokenContract,
    minigame_registry_contract::{IMinigameRegistryDispatcher, MinigameRegistryContract},
};
use game_components_token::interface::{IMinigameTokenMixinDispatcher};
use openzeppelin_introspection::interface::ISRC5Dispatcher;
use openzeppelin_token::erc721::interface::{ERC721ABIDispatcher};
use starknet::{ContractAddress, ClassHash};

// use denshokan::tests::utils;

// Test constants
const OWNER: felt252 = 'OWNER';
const PLAYER: felt252 = 'PLAYER';
const GAME_CREATOR: felt252 = 'GAME_CREATOR';
const GAME_NAME: felt252 = 'TestGame';
const DEVELOPER: felt252 = 'TestDev';
const PUBLISHER: felt252 = 'TestPub';
const GENRE: felt252 = 'Action';
const PLAYER_NAME: felt252 = 'TestPlayer';

fn OWNER_ADDR() -> ContractAddress {
    OWNER.try_into().unwrap()
}

fn PLAYER_ADDR() -> ContractAddress {
    PLAYER.try_into().unwrap()
}

fn GAME_CREATOR_ADDR() -> ContractAddress {
    GAME_CREATOR.try_into().unwrap()

}

#[derive(Drop)]
pub struct TestContracts {
    pub denshokan: IMinigameTokenMixinDispatcher,
}

//
// Setup
//

pub fn deploy_minigame_registry_contract_with_params(
    name: ByteArray, symbol: ByteArray, base_uri: ByteArray, event_relayer_address: Option<ContractAddress>,
) -> IMinigameRegistryDispatcher {
    let mut constructor_calldata = array![];
    name.serialize(ref constructor_calldata);
    symbol.serialize(ref constructor_calldata);
    base_uri.serialize(ref constructor_calldata);

    // Serialize event_relayer_address Option
    match event_relayer_address {
        Option::Some(addr) => {
            constructor_calldata.append(0); // Some variant
            constructor_calldata.append(addr.into());
        },
        Option::None => {
            constructor_calldata.append(1); // None variant
        },
    }

    let contract_address = deploy_contract(
        MinigameRegistryContract::TEST_CLASS_HASH.try_into().unwrap(), constructor_calldata.span(),
    );

    let minigame_registry_dispatcher = IMinigameRegistryDispatcher { contract_address };
    minigame_registry_dispatcher
}

pub fn deploy_optimized_token_contract(
    name: Option<ByteArray>,
    symbol: Option<ByteArray>,
    base_uri: Option<ByteArray>,
    game_registry_address: Option<ContractAddress>,
    event_relayer_address: Option<ContractAddress>,
) -> (IMinigameTokenMixinDispatcher, ERC721ABIDispatcher, ISRC5Dispatcher, ContractAddress) {
    let mut constructor_calldata: Array<felt252> = array![];

    // Set default values if not provided
    let token_name: ByteArray = match name {
        Option::Some(n) => n,
        Option::None => "TestToken",
    };

    let token_symbol: ByteArray = match symbol {
        Option::Some(s) => s,
        Option::None => "TT",
    };

    let token_base_uri: ByteArray = match base_uri {
        Option::Some(uri) => uri,
        Option::None => "https://test.com/",
    };

    // Serialize basic parameters
    token_name.serialize(ref constructor_calldata);
    token_symbol.serialize(ref constructor_calldata);
    token_base_uri.serialize(ref constructor_calldata);

    // set no royalty info
    constructor_calldata.append(1);
    constructor_calldata.append(1);

    // Serialize game_registry_address Option
    match game_registry_address {
        Option::Some(addr) => {
            constructor_calldata.append(0); // Some variant
            constructor_calldata.append(addr.into());
        },
        Option::None => {
            constructor_calldata.append(1); // None variant
        },
    }

    // Serialize event_relayer_address Option
    match event_relayer_address {
        Option::Some(addr) => {
            constructor_calldata.append(0); // Some variant
            constructor_calldata.append(addr.into());
        },
        Option::None => {
            constructor_calldata.append(1); // None variant
        },
    }

    let contract_address = deploy_contract(
        FullTokenContract::TEST_CLASS_HASH.try_into().unwrap(), constructor_calldata.span(),
    );

    let token_dispatcher = IMinigameTokenMixinDispatcher { contract_address };
    let erc721_dispatcher = ERC721ABIDispatcher { contract_address };
    let src5_dispatcher = ISRC5Dispatcher { contract_address };

    (token_dispatcher, erc721_dispatcher, src5_dispatcher, contract_address)
}


pub fn setup() -> TestContracts {
    let minigame_registry_dispatcher = deploy_minigame_registry_contract_with_params(
        "TestGame", "TT", "https://test.com/", Option::None,
    );

    let (token_dispatcher, _erc721_dispatcher, _src5_dispatcher, _contract_address) = deploy_optimized_token_contract(
        Option::None,
        Option::None,
        Option::None,
        Option::Some(minigame_registry_dispatcher.contract_address),
        Option::None,
    );

    TestContracts { denshokan: token_dispatcher }
}
