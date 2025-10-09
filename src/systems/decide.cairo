use rollyourown::packing::game_store::GameStoreImpl;
use rollyourown::systems::game::EncounterActions;

#[starknet::interface]
trait IDecide<T> {
    fn decide(self: @T, game_id: u32, action: EncounterActions);
}

#[dojo::contract]
pub mod decide {
    use dojo::world::WorldStorageTrait;
    use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
    use game_components_minigame::libs::{assert_token_ownership, post_action, pre_action};
    use rollyourown::packing::game_store::GameStoreImpl;
    use rollyourown::packing::player::PlayerImpl;
    use rollyourown::store::{StoreImpl, StoreTrait};
    use rollyourown::systems::helpers::{game_loop, traveling};
    use rollyourown::utils::bytes16::Bytes16Impl;
    use rollyourown::utils::random::RandomImpl;
    use rollyourown::utils::randomness_helper::RandomnessHelperTrait;
    use starknet::get_caller_address;

    #[abi(embed_v0)]
    impl DecideImpl of super::IDecide<ContractState> {
        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let randomness_config = store.randomness_config();
            let player_id = get_caller_address();

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // Assert token ownership and playability
            let token_address = self._get_game_token_address();
            assert_token_ownership(token_address, game_store.game.minigame_token_id);
            pre_action(token_address, game_store.game.minigame_token_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let game_context = core::poseidon::poseidon_hash_span(
                array![player_id.into(), game_id.into(), 'decide'].span(),
            );
            let mut randomizer = RandomnessHelperTrait::create_randomizer(
                randomness_config, game_context,
            );
            let mut season_settings = store.season_settings(game_store.game.season_version);

            // // resolve decision
            let is_dead = traveling::decide(
                ref game_store, ref season_settings, ref randomizer, action,
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, ref store);
            } else {
                // on_turn_end & save
                game_loop::on_turn_end(ref game_store, ref randomizer, ref store);
            };

            // Update token state
            post_action(token_address, game_store.game.minigame_token_id);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _get_game_token_address(self: @ContractState) -> starknet::ContractAddress {
            let world = self.world(@"dopewars");
            let (game_token_systems_address, _) = world.dns(@"game_token_systems").unwrap();
            let minigame_dispatcher = IMinigameDispatcher {
                contract_address: game_token_systems_address,
            };
            minigame_dispatcher.token_address()
        }
    }

}
