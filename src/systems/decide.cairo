use rollyourown::{packing::game_store::{GameStoreImpl}, systems::{game::{EncounterActions}}};

#[starknet::interface]
trait IDecide<T> {
    fn decide(self: @T, game_id: u32, action: EncounterActions);
}

#[dojo::contract]
mod decide {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use rollyourown::{
        packing::{game_store::{GameStoreImpl}, player::{PlayerImpl}},
        store::{StoreImpl, StoreTrait}, systems::{helpers::{game_loop, traveling}},
        utils::{bytes16::{Bytes16Impl}, random::{RandomImpl}},
    };
    use starknet::get_caller_address;

    #[abi(embed_v0)]
    impl DecideImpl of super::IDecide<ContractState> {
        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let mut randomizer = RandomImpl::new(random);
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
