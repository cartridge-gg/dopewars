// SPDX-License-Identifier: MIT

// use starknet::ContractAddress;

#[starknet::interface]
pub trait IGameTokenSystems<T> {
    fn player_name(self: @T, token_id: u64) -> felt252;
}

#[dojo::contract]
pub mod game_token_systems {
    use core::num::traits::Zero;
    use dojo::model::ModelStorage;
    use game_components_minigame::interface::IMinigameTokenData;
    use game_components_minigame::minigame::MinigameComponent;
    use openzeppelin::introspection::src5::SRC5Component;
    use rollyourown::models::game_token::GameToken;
    use rollyourown::packing::game_store::GameStoreTrait;
    use rollyourown::store::{StoreImpl, StoreTrait};
    use starknet::ContractAddress;
    use super::IGameTokenSystems;

    // Components
    component!(path: MinigameComponent, storage: minigame, event: MinigameEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl MinigameImpl = MinigameComponent::MinigameImpl<ContractState>;
    impl MinigameInternalImpl = MinigameComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        minigame: MinigameComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        MinigameEvent: MinigameComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    /// @title Dojo Init
    /// @notice Initializes the game token system
    /// @param creator_address: the address of the creator of the game
    /// @param token_address: Denshokan address
    fn dojo_init(
        ref self: ContractState, creator_address: ContractAddress, token_address: ContractAddress,
    ) {
        self
            .minigame
            .initializer(
                creator_address,
                "DopeWars",
                "Roll Your Own - Dope Wars on StarkNet. Build your empire.",
                "Cartridge",
                "Dope Wars",
                "Strategy",
                "https://dopewars.gg/favicon.png",
                Option::None, // color - uses default
                Option::None, // client_url
                Option::None, // renderer_address - uses default renderer
                Option::None, // settings_address
                Option::None, // objectives_address
                token_address,
            );
    }

    // ------------------------------------------ //
    // ------------ Minigame Component ---------- //
    // ------------------------------------------ //
    #[abi(embed_v0)]
    impl GameTokenDataImpl of IMinigameTokenData<ContractState> {
        fn score(self: @ContractState, token_id: u64) -> u32 {
            let world = self.world(@"dopewars");
            let game_token: GameToken = world.read_model(token_id);

            if game_token.game_id == 0 {
                return 0;
            }

            let mut store = StoreImpl::new(world);

            let mut game_store = GameStoreTrait::load(
                ref store, game_token.game_id, game_token.player_id,
            );

            // Return player's cash as the score
            game_store.player.cash
        }

        fn game_over(self: @ContractState, token_id: u64) -> bool {
            let world = self.world(@"dopewars");

            let game_token: GameToken = world.read_model(token_id);

            assert(game_token.game_id != 0, 'game does not exist');
            assert(game_token.player_id.is_non_zero(), 'game does not exist');

            let store = StoreImpl::new(world);

            let game = store.game(game_token.game_id, game_token.player_id);
            game.game_over
        }
    }

    // ------------------------------------------ //
    // ------------ Game Token Systems ---------- //
    // ------------------------------------------ //
    #[abi(embed_v0)]
    impl GameTokenSystemsImpl of IGameTokenSystems<ContractState> {
        fn player_name(self: @ContractState, token_id: u64) -> felt252 {
            self.minigame.get_player_name(token_id)
        }
    }
}
