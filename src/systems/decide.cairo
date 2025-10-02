use rollyourown::{packing::game_store::{GameStoreImpl}, systems::{game::{EncounterActions}}};

#[starknet::interface]
trait IDecide<T> {
    fn decide(self: @T, game_id: u32, action: EncounterActions);
}

#[dojo::contract]
mod decide {
    use rollyourown::{
        packing::{game_store::{GameStoreImpl}, player::{PlayerImpl}},
        store::{StoreImpl, StoreTrait}, systems::{helpers::{game_loop, traveling}},
        utils::{bytes16::{Bytes16Impl}, random::{RandomImpl}, randomness_helper::{RandomnessHelperTrait}},
    };
    use starknet::get_caller_address;

    #[abi(embed_v0)]
    impl DecideImpl of super::IDecide<ContractState> {
        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let randomness_config = store.randomness_config();
            let player_id = get_caller_address();

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let game_context = core::poseidon::poseidon_hash_span(array![player_id.into(), game_id.into(), 'decide'].span());
            let mut randomizer = RandomnessHelperTrait::create_randomizer(randomness_config, game_context);
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
        }
    }
}
