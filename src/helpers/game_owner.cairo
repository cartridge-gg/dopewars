use core::num::traits::Zero;
use dojo::world::{WorldStorage, WorldStorageTrait};
use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
use rollyourown::store::{Store, StoreImpl, StoreTrait};
use starknet::ContractAddress;

/// Returns the current game owner, falling back to the original player if missing.
pub fn resolve_current_owner(
    world: WorldStorage, game_id: u32, player_id: ContractAddress,
) -> ContractAddress {
    let store = StoreImpl::new(world);
    resolve_current_owner_with_store(store, game_id, player_id)
}

/// Returns the current game owner when only the minigame token id is known.
pub fn resolve_current_owner_by_token(world: WorldStorage, token_id: u64) -> ContractAddress {
    let store = StoreImpl::new(world);
    let game_token = store.game_token(token_id);

    if game_token.game_id == 0 || game_token.player_id.is_zero() {
        return game_token.player_id;
    }

    let game_token_systems_address = world.dns_address(@"game_token_system_v0").unwrap();

    let minigame_dispatcher = IMinigameDispatcher { contract_address: game_token_systems_address };
    let token_address = minigame_dispatcher.token_address();

    let erc721_dispatcher = IERC721Dispatcher { contract_address: token_address };
    let current_owner = erc721_dispatcher.owner_of(token_id.into());

    current_owner
}

fn resolve_current_owner_with_store(
    store: Store, game_id: u32, player_id: ContractAddress,
) -> ContractAddress {
    let game = store.game(game_id, player_id);

    // Game hasn't minted or registered its minigame token yet.
    if game.minigame_token_id == 0 {
        return player_id;
    }

    let world = store.world;
    let Option::Some(game_token_systems_address) = world.dns_address(@"game_token_system_v0") else {
        return player_id;
    };

    let minigame_dispatcher = IMinigameDispatcher { contract_address: game_token_systems_address };
    let token_address = minigame_dispatcher.token_address();
    if token_address.is_zero() {
        return player_id;
    }

    let erc721_dispatcher = IERC721Dispatcher { contract_address: token_address };
    let owner = erc721_dispatcher.owner_of(game.minigame_token_id.into());

    if owner.is_zero() {
        player_id
    } else {
        owner
    }
}

/// Reverts when the caller is not the current owner of the game token
pub fn assert_current_owner(
    world: WorldStorage, game_id: u32, player_id: ContractAddress, caller: ContractAddress,
) {
    let expected = resolve_current_owner(world, game_id, player_id);
    assert(caller == expected, 'caller not owner');
}
