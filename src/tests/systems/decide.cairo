mod tests {
    use dojo_snf_test::cheatcodes::set_caller_address;
    use rollyourown::systems::decide::IDecideDispatcherTrait;
    use rollyourown::systems::game::EncounterActions;
    use rollyourown::tests::test_helpers::test_helpers::{
        setup_world_with_game, setup_world_with_mint,
    };

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_owner_can_decide() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        setup.contracts.decide.decide(setup.token_id, EncounterActions::Pay);
    }

    #[test]
    #[fork("provable-dw")]
    // #[should_panic]
    fn test_non_owner_cannot_decide() {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_b);
        setup.contracts.decide.decide(setup.token_id, EncounterActions::Pay);
    }

    #[test]
    #[fork("provable-dw")]
    #[should_panic(expected: 'invalid game token')]
    fn test_cannot_decide_with_invalid_token() {
        let setup = setup_world_with_mint();
        set_caller_address(setup.player_a);
        setup.contracts.decide.decide(0, EncounterActions::Pay);
    }
}
