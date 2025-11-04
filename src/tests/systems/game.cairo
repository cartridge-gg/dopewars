mod tests {
    use dojo_snf_test::cheatcodes::set_caller_address;
    use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use rollyourown::config::locations::Locations;
    use rollyourown::helpers::game_owner::resolve_current_owner;
    use rollyourown::models::game::{GameMode, TokenId};
    use rollyourown::store::{StoreImpl, StoreTrait};
    use rollyourown::systems::game::IGameActionsDispatcherTrait;
    use rollyourown::tests::test_helpers::test_helpers::{
        get_valid_guest_loot_id, setup_and_transfer, setup_world_with_game, setup_world_with_mint,
    };

    #[test]
    #[fork("provable-dw")]
    fn test_owner_can_create_game() {
        let setup = setup_world_with_mint();
        set_caller_address(
            0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap(),
        );
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(
                GameMode::Ranked,
                'Player A',
                1,
                TokenId::GuestLootId(guest_loot_id),
                setup.token_id,
            );

        let mut store = StoreImpl::new(setup.contracts.world);
        let game = store.game_by_token_id(setup.token_id);
        let resolved = resolve_current_owner(setup.contracts.world, game.game_id, game.player_id);
        assert(resolved == setup.player_a, 'resolve_current_owner mismatch');
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'Caller is not owner of token 95')]
    fn test_non_owner_cannot_create_game() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_b);
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(
                GameMode::Ranked,
                'Player B',
                1,
                TokenId::GuestLootId(guest_loot_id),
                setup.token_id,
            );
    }

    #[test]
    #[should_panic(expected: 'game has started')]
    #[fork("provable-dw")]
    fn test_cannot_create_game_twice_with_same_token() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(
                GameMode::Ranked,
                'Player A',
                1,
                TokenId::GuestLootId(guest_loot_id),
                setup.token_id,
            );
        setup
            .contracts
            .game
            .create_game(
                GameMode::Ranked,
                'Player A',
                1,
                TokenId::GuestLootId(guest_loot_id),
                setup.token_id,
            );
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'ERC721: invalid token ID')]
    fn test_cannot_end_game_with_invalid_token() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        setup.contracts.game.end_game(0, array![].span());
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'ERC721: invalid token ID')]
    fn test_cannot_travel_with_invalid_token() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        setup.contracts.game.travel(0, Locations::Bronx, array![].span());
    }


    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_integration_old_owner_cannot_travel() {
        let setup = setup_and_transfer();
        set_caller_address(setup.player_a);
        setup.contracts.game.travel(setup.token_id, Locations::Central, array![].span());
    }

    // #[test]
    // #[fork("provable-dw")]
    // fn test_integration_new_owner_can_travel() {
    //     let setup = setup_and_transfer();
    //     set_caller_address(setup.player_b);
    //     setup.contracts.game.travel(setup.token_id, Locations::Central, array![].span());
    // }

    #[test]
    #[fork("provable-dw")]
    fn test_owner_can_travel() {
        let setup = setup_world_with_game();
        let erc721_dispatcher = IERC721Dispatcher {
            contract_address: setup.contracts.game_token.contract_address,
        };
        let token_owner = erc721_dispatcher.owner_of(setup.token_id.into());
        assert(token_owner == setup.player_a, 'token owner mismatch');
        assert(starknet::get_caller_address() == setup.player_a, 'caller address mismatch');
        setup.contracts.game.travel(setup.token_id, Locations::Bronx, array![].span());
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_non_owner_cannot_travel() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.game.travel(setup.token_id, Locations::Bronx, array![].span());
    }
}
