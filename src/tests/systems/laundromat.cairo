mod tests {
    use dojo_snf_test::cheatcodes::set_caller_address;
    use rollyourown::store::StoreImpl;
    use rollyourown::systems::laundromat::ILaundromatDispatcherTrait;
    use rollyourown::tests::test_helpers::test_helpers::{
        mark_game_claimable, setup_and_transfer, setup_world_with_game,
    };


    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_owner_can_register_score() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.laundromat.register_score(setup.token_id, 0, 0.try_into().unwrap());
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_non_owner_cannot_register_score() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.laundromat.register_score(setup.token_id, 0, 0.try_into().unwrap());
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_owner_can_claim() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.laundromat.claim(setup.player_a, array![setup.token_id].span());
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_non_owner_cannot_claim() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.laundromat.claim(setup.player_b, array![setup.token_id].span());
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'Caller is not owner of token')]
    fn test_original_owner_cannot_claim_after_transfer() {
        let setup = setup_and_transfer();
        mark_game_claimable(setup.contracts.world, setup.token_id, 1);
        set_caller_address(setup.player_a);
        setup.contracts.laundromat.claim(setup.player_a, array![setup.token_id].span());
    }

    #[test]
    #[fork("provable-dw")]
    fn test_transferred_owner_can_claim() {
        let setup = setup_and_transfer();
        mark_game_claimable(setup.contracts.world, setup.token_id, 42);

        set_caller_address(setup.player_b);
        setup.contracts.laundromat.claim(setup.player_b, array![setup.token_id].span());

        let store = StoreImpl::new(setup.contracts.world);
        let game = store.game_by_token_id(setup.token_id);
        assert(game.claimed, 'expected claimed flag to be set');
        assert(game.claimable == 42, 'claimable mismatch');
    }
}
