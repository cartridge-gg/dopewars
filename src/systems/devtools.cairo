use starknet::ContractAddress;

#[starknet::interface]
trait IDevtools<T> {
    fn failing_tx(self: @T);
    fn create_fake_game(self: @T, final_score: u32);
}

// use with katana --chain_id != 'KATANA'

#[dojo::contract]
mod devtools {
    use rollyourown::config::config::config::InternalTrait;
    use core::traits::TryInto;
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;

    use super::IDevtools;

    use rollyourown::{
        models::{season::{Season}, game::{Game}, game_store_packed::{GameStorePacked}},
        utils::{
            events::{RawEventEmitterTrait, RawEventEmitterImpl}, random::{RandomImpl},
            bytes16::{Bytes16, Bytes16Impl, Bytes16Trait},
            sorted_list::{SortedListItem, SortedListImpl, SortedListTrait},
        },
        helpers::season_manager::{SeasonManager, SeasonManagerTrait},
        packing::game_store::{GameMode, GameStoreImpl, GameStorePackerImpl},
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
    };


    #[abi(embed_v0)]
    impl DevtoolsImpl of IDevtools<ContractState> {
        fn create_fake_game(self: @ContractState, final_score: u32) {
            let world = self.world();
            let game_id = world.uuid();
            let player_id = get_caller_address();

            // get season version & pay paper_fee
            let season_manager = SeasonManagerTrait::new(self.s());
            let season_version = season_manager.get_current_version();

            let mut randomizer = RandomImpl::new('devtools');
            let rand_score: u32 = if final_score > 0 {
                final_score
            } else {
                randomizer.between::<u32>(0, 100_000)
            };

            let mut game = Game {
                game_id,
                player_id,
                //
                season_version,
                game_mode: GameMode::Dealer,
                //
                player_name: Bytes16Impl::from('fake'),
                hustler_id: 1,
                //
                game_over: true,
                final_score: 0,
                registered: false,
                claimed: false,
                claimable: 0,
                position: 0,
                //
                max_turns: 2,
                max_wanted_shopping: 2,
                max_rounds: 2,
            };

            let mut game_store = self.s().game_store(game.game_id, game.player_id);
            game_store.player.cash = rand_score;

            // save Game & GameStorePacked
            self.s().set_game(game);
            self.s().set_game_store(game_store);

            // simulate register_score

            // register final_score
            let mut game_store = self.s().game_store(game.game_id, game.player_id);
            game.final_score = game_store.player.cash;
            game.registered = true;
            self.s().set_game(game);

            // retrieve Season Sorted List   TODO: check season_version / status
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(world, list_id);

            // add to Game to sorted_list
            sorted_list.add(world, game, (0, 0.try_into().unwrap()));
        }


        fn failing_tx(self: @ContractState) {
            self.check_chain();

            assert(0 == 1, 'failing tx');
        }
    }

    #[generate_trait]
    impl DevtoolsInternalImpl of DevtoolsInternalTrait {
        fn check_chain(self: @ContractState) { // let chain_id = get_tx_info().unbox().chain_id;
        // assert(chain_id != 'KATANA', 'wrong chain_id');
        }

        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = self.world().contract('store');
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}

