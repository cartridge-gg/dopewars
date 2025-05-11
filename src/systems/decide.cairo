use rollyourown::{systems::game::EncounterActions};
use starknet::ContractAddress;

#[starknet::interface]
trait IDecide<T> {
    fn decide(self: @T, game_id: u32, player_id: ContractAddress, action: EncounterActions);
}

#[dojo::contract]
mod decide {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use dojo::world::{WorldStorage};

    use rollyourown::{
        config::{
            ryo::{RyoConfig}, ryo_address::{RyoAddress},
        },
        packing::{game_store::{GameStoreImpl}, player::{Player, PlayerImpl}},
        store::{Store, StoreImpl, StoreTrait},
        systems::{
            game::EncounterActions,
            helpers::{game_loop, shopping, trading, traveling, traveling::EncounterOutcomes},
        },
        utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}, random::{Random, RandomImpl}},
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    #[abi(embed_v0)]
    impl DecideImpl of super::IDecide<ContractState> {
        fn decide(self: @ContractState, game_id: u32, player_id: ContractAddress, action: EncounterActions) {
            // ensure caller is the game system
            let world = self.world(@"dopewars");
            let (game_system_address, _) = world.dns(@"game").unwrap();
            assert!(
                get_caller_address() == game_system_address,
                "caller must be the game system",
            );


            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let ryo_addresses = store.ryo_addresses();
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
