use rollyourown::{
    config::{hustlers::{ItemSlot}, locations::{Locations}}, packing::game_store::{GameMode},
    packing::game_store::{GameStore, GameStoreImpl},
    systems::{game::{Actions, EncounterActions}, helpers::{shopping, trading}},
};
use starknet::ContractAddress;


#[starknet::interface]
trait IDecide<T> {
    fn decide(self: @T, game_id: u32, action: EncounterActions);
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
            drugs::{Drugs}, encounters::{Encounters}, game::{GameConfig}, locations::{Locations},
            ryo::{RyoConfig}, ryo_address::{RyoAddress},
        },
        constants::{ETHER}, events::{GameCreated}, helpers::season_manager::{SeasonManagerTrait},
        interfaces::{
            dope_hustlers::{IDopeHustlersDispatcher, IDopeHustlersDispatcherTrait},
            erc721::{IERC721ABIDispatcher, IERC721ABIDispatcherTrait},
            paper::{IPaperDispatcher, IPaperDispatcherTrait},
        },
        models::{game::{Game, GameImpl}, game_store_packed::GameStorePacked, season::{Season}},
        packing::{game_store::{GameMode, GameStore, GameStoreImpl}, player::{Player, PlayerImpl}},
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
