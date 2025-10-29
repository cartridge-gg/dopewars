mod tests {
    use dojo_snf_test::cheatcodes::set_caller_address;
    use rollyourown::systems::laundromat::ILaundromatDispatcherTrait;
    use rollyourown::tests::test_helpers::test_helpers::setup_world_with_game;


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
}
