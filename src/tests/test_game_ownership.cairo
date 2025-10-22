#[cfg(test)]
mod test_game_ownership {
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use dojo_snf_test::cheatcodes::set_caller_address;
    use openzeppelin_token::erc721::interface::{
        IERC721Dispatcher, IERC721DispatcherTrait, IERC721MetadataDispatcher,
    };
    use game_components_minigame::interface::{IMinigame, IMinigameDispatcher, IMinigameDispatcherTrait};
    use rollyourown::config::locations::Locations;
    use rollyourown::models::game::{GameMode, TokenId};
    use rollyourown::models::game_token::GameToken;
    use rollyourown::systems::decide::{IDecideDispatcher, IDecideDispatcherTrait};
    use rollyourown::systems::game::{
        EncounterActions, IGameActions, IGameActionsDispatcher, IGameActionsSafeDispatcherTrait, IGameActionsDispatcherTrait,
    };
    use rollyourown::systems::game_token::contracts::{
        IGameTokenSystemsDispatcher, IGameTokenSystemsDispatcherTrait,
    };
    use rollyourown::systems::laundromat::{ILaundromatDispatcher, ILaundromatDispatcherTrait};
    use starknet::ContractAddress;
    use crate::tests::test_helper::{TestContracts, deploy_world};
    use rollyourown::helpers::season_manager::SeasonManagerTrait;
    use rollyourown::store::{StoreImpl};

    const PLAYER_A: ContractAddress = 0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap();
    const PLAYER_B: ContractAddress = 0x025ede3b40d5A404Abe7C96755d4Bb7168e95739d75db012040901907a5E1628.try_into().unwrap();
    const DENSHOKAN_ADDRESS_SEPOLIA: ContractAddress = 0x02334dc9c950c74c3228e2a343d495ae36f0b4edf06767a679569e9f9de08776.try_into().unwrap();

    const denshokan_dispatcher: IERC721Dispatcher = IERC721Dispatcher { contract_address: DENSHOKAN_ADDRESS_SEPOLIA };
    
    #[derive(Drop)]
    struct Setup {
        contracts: TestContracts,
        player_a: ContractAddress,
        player_b: ContractAddress,
        token_id: u64,
    }

    fn get_valid_guest_loot_id(world: WorldStorage) -> felt252 {
        let mut store = StoreImpl::new(world);
        let mut season_manager = SeasonManagerTrait::new(store);
        let season_version = season_manager.get_current_version();

        let hash: u256 = core::poseidon::poseidon_hash_span(
            array![season_version.into(), 0_u32.into()].span(),
        )
            .into();
        let id: felt252 = ((hash % 8000) + 1).try_into().unwrap();
        id
    }
    
    fn setup_world_with_mint() -> Setup {
        let contracts = deploy_world();
        
        let minigame_dispatcher: IMinigameDispatcher = IMinigameDispatcher { contract_address: contracts.game_token.contract_address };
        let token_id = minigame_dispatcher
            .mint_game(
                Option::Some(PLAYER_A.try_into().unwrap()), // player_name
                Option::Some(0), // settings_id
                Option::None, // start
                Option::None, // end
                Option::None, // objective_ids
                Option::None, // context
                Option::None, // client_url
                Option::None, // renderer_address
                0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap(), // to
                false // soulbound
            );

        Setup { contracts, player_a: PLAYER_A, player_b: PLAYER_B, token_id }
    }

    fn setup_world_with_game() -> Setup {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(GameMode::Ranked, 'Player A', 1, TokenId::GuestLootId(guest_loot_id), setup.token_id);
        setup
    }

    #[test]
    // #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    fn test_owner_can_create_game() {
        let setup = setup_world_with_mint();
        set_caller_address(0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap());
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(GameMode::Ranked, 'Player A', 1, TokenId::GuestLootId(guest_loot_id), setup.token_id);
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_non_owner_cannot_create_game() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_b);
    let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(GameMode::Ranked, 'Player B', 1, TokenId::GuestLootId(guest_loot_id), setup.token_id);
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    fn test_owner_can_travel() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.game.travel(setup.token_id, Locations::Bronx, array![].span());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_non_owner_cannot_travel() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.game.travel(setup.token_id, Locations::Bronx, array![].span());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_owner_can_decide() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.decide.decide(setup.token_id, EncounterActions::Pay);
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_non_owner_cannot_decide() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.decide.decide(setup.token_id, EncounterActions::Pay);
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_owner_can_register_score() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.laundromat.register_score(setup.token_id, 0, 0.try_into().unwrap());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_non_owner_cannot_register_score() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.laundromat.register_score(setup.token_id, 0, 0.try_into().unwrap());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_owner_can_claim() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.laundromat.claim(setup.player_a, array![setup.token_id].span());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_non_owner_cannot_claim() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.laundromat.claim(setup.player_b, array![setup.token_id].span());
    }

    // --- Integration: Transfer of Ownership ---

    fn setup_and_transfer() -> Setup {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        let minigame_dispatcher: IMinigameDispatcher = IMinigameDispatcher { contract_address: setup.contracts.game_token.contract_address };

        let token_address = minigame_dispatcher.token_address();
        let erc721_dispatcher = IERC721Dispatcher { contract_address: token_address };
        erc721_dispatcher.transfer_from(setup.player_a, setup.player_b, setup.token_id.into());
        let new_owner = erc721_dispatcher.owner_of(setup.token_id.into());
        assert(new_owner == setup.player_b, 'Token transfer failed');
        setup
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    #[should_panic]
    fn test_integration_old_owner_cannot_travel() {
        let setup = setup_and_transfer();
        set_caller_address(setup.player_a);
        setup.contracts.game.travel(setup.token_id, Locations::Central, array![].span());
    }

    #[test]
    #[fork(url: "https://api.cartridge.gg/x/starknet/sepolia", block_tag: latest)]
    fn test_integration_new_owner_can_travel() {
        let setup = setup_and_transfer();
        set_caller_address(setup.player_b);
        setup.contracts.game.travel(setup.token_id, Locations::Central, array![].span());
    }
}
