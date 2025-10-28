
mod tests {
    use rollyourown::tests::test_helpers::test_helpers::{ 
        Setup, setup_world_with_game, get_valid_guest_loot_id, setup_world_with_mint, setup_and_transfer
    };
    use rollyourown::systems::game::IGameActionsDispatcherTrait;
    use rollyourown::models::game::{GameMode, TokenId};
    use rollyourown::config::locations::Locations;
    use dojo_snf_test::cheatcodes::set_caller_address;

    #[test]
    #[fork("provable-dw")]
    fn test_owner_can_create_game() {
        let setup = setup_world_with_mint();
        set_caller_address(0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap());
        // start_cheat_account_contract_address(0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059.try_into().unwrap(), setup.contracts.game.contract_address);
        let guest_loot_id = get_valid_guest_loot_id(setup.contracts.world);
        setup
            .contracts
            .game
            .create_game(GameMode::Ranked, 'Player A', 1, TokenId::GuestLootId(guest_loot_id), setup.token_id);
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
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
    #[should_panic(expected: 'invalid game token')]
    fn test_cannot_end_game_with_invalid_token() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        setup.contracts.game.end_game(0, array![].span());
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'invalid game token')]
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

    #[test]
    #[fork("provable-dw")]
    fn test_integration_new_owner_can_travel() {
        let setup = setup_and_transfer();
        set_caller_address(setup.player_b);
        setup.contracts.game.travel(setup.token_id, Locations::Central, array![].span());
    }


    #[test]
    #[fork("provable-dw")]
    fn test_owner_can_travel() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
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
