#[cfg(test)]
pub mod test_helpers {
    use dojo::world::WorldStorage;
    use dojo_snf_test::cheatcodes::{set_account_address, set_caller_address};
    use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
    use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use rollyourown::_mocks::paper_mock::{
        IPaperMockDispatcherTrait, IPaperMockFaucetDispatcher, IPaperMockFaucetDispatcherTrait,
    };
    use rollyourown::helpers::season_manager::SeasonManagerTrait;
    use rollyourown::models::game::{GameMode, TokenId};
    use rollyourown::store::StoreImpl;
    use rollyourown::systems::game::IGameActionsDispatcherTrait;
    use rollyourown::utils::sorted_list::SortedListImpl;
    use snforge_std::start_cheat_account_contract_address;
    use starknet::ContractAddress;
    use crate::tests::setup_world::{TestContracts, deploy_world};

    const PLAYER_A: ContractAddress =
        0x04E830A9dC3CA7AABecaC15D6b6f14c958bb57E28e62944F383581Fd5d0eF059
        .try_into()
        .unwrap();
    const PLAYER_B: ContractAddress =
        0x025ede3b40d5A404Abe7C96755d4Bb7168e95739d75db012040901907a5E1628
        .try_into()
        .unwrap();
    const DENSHOKAN_ADDRESS_SEPOLIA: ContractAddress =
        0x02334dc9c950c74c3228e2a343d495ae36f0b4edf06767a679569e9f9de08776
        .try_into()
        .unwrap();
    const DENSHOKAN_ADDRESS_PROVABLE_DW: ContractAddress =
        0x05a499a49f635d0a9379da557b3f13aeb74a1b2295944755575e6adb2b86f7dd
        .try_into()
        .unwrap();

    const denshokan_dispatcher: IERC721Dispatcher = IERC721Dispatcher {
        contract_address: DENSHOKAN_ADDRESS_PROVABLE_DW,
    };

    #[derive(Drop)]
    pub struct Setup {
        pub contracts: TestContracts,
        pub player_a: ContractAddress,
        pub player_b: ContractAddress,
        pub token_id: u64,
    }

    pub fn get_valid_guest_loot_id(world: WorldStorage) -> felt252 {
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

    pub fn setup_world_with_mint() -> Setup {
        let contracts = deploy_world();

        let paper_faucet = IPaperMockFaucetDispatcher {
            contract_address: contracts.paper_mock.contract_address,
        };
        paper_faucet.faucetTo(PLAYER_A);
        paper_faucet.faucetTo(PLAYER_B);

        set_account_address(PLAYER_A);
        let paper_dispatcher = contracts.paper_mock;
        const ETHER: u256 = 1_000_000_000_000_000_000;
        paper_dispatcher.approve(contracts.game.contract_address, 100_000_000_000 * ETHER);
        paper_dispatcher.approve(contracts.laundromat.contract_address, 100_000_000_000 * ETHER);

        let minigame_dispatcher: IMinigameDispatcher = IMinigameDispatcher {
            contract_address: contracts.game_token.contract_address,
        };
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
                PLAYER_A.try_into().unwrap(), // to
                false // soulbound
            );

        Setup { contracts, player_a: PLAYER_A, player_b: PLAYER_B, token_id }
    }

    pub fn setup_world_with_game() -> Setup {
        let setup = setup_world_with_mint();

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
    }

    // --- Integration: Transfer of Ownership ---

    pub fn setup_and_transfer() -> Setup {
        let setup = setup_world_with_game();
        set_caller_address(setup.player_a);
        let minigame_dispatcher: IMinigameDispatcher = IMinigameDispatcher {
            contract_address: setup.contracts.game_token.contract_address,
        };

        let token_address = minigame_dispatcher.token_address();
        let erc721_dispatcher = IERC721Dispatcher { contract_address: token_address };
        erc721_dispatcher.transfer_from(setup.player_a, setup.player_b, setup.token_id.into());
        let new_owner = erc721_dispatcher.owner_of(setup.token_id.into());
        assert(new_owner == setup.player_b, 'Token transfer failed');
        setup
    }

    pub fn mark_game_claimable(world: WorldStorage, token_id: u64, claimable: u32) {
        let mut store = StoreImpl::new(world);
        let mut game = store.game_by_token_id(token_id);
        game.game_over = true;
        game.registered = true;
        game.claimable = claimable;
        game.position = 1;
        store.set_game(@game);

        let list_id = game.season_version.into();
        let mut sorted_list = SortedListImpl::new(list_id);
        sorted_list.locked = true;
        sorted_list.processed = true;
        sorted_list.size = 1;
        sorted_list.process_max_size = 1;
        sorted_list.process_size = 1;
        SortedListImpl::set(sorted_list, ref store);
    }
}
