use starknet::ContractAddress;

#[starknet::interface]
trait IDevtools<T> {
    fn failing_tx(self: @T);
    // fn feed_leaderboard(self: @T, count: u32);
    fn create_fake_game(self: @T, final_score: u32);
}

// use with katana --chain_id != 'KATANA'

#[dojo::contract]
mod devtools {
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
            bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}
        },
        helpers::season_manager::{SeasonManager, SeasonManagerTrait},
        packing::game_store::{GameMode, GameStoreImpl, GameStorePackerImpl},
        
    };


    #[abi(embed_v0)]
    impl DevtoolsImpl of IDevtools<ContractState> {
        fn create_fake_game(self: @ContractState, final_score: u32) {
            let world = self.world();
            let game_id = world.uuid();
            let player_id = get_caller_address();

            // get season version & pay paper_fee
            let season_manager = SeasonManagerTrait::new(world);
            let season_version = season_manager.get_current_version();

            let mut randomizer = RandomImpl::new(world);
            let rand_score: u32 = if final_score > 0 {
                final_score
            } else {
                randomizer.between::<u32>(0, 100000000)
            };

            let game = Game {
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
                position: 0,
                //
                max_turns: 2,
                max_wanted_shopping: 2,
                max_rounds: 2,
            };

            let mut game_store = GameStoreImpl::get(world, game);
            game_store.player.cash = rand_score;
            let game_store_packed = game_store.pack();

            // save Game & GameStorePacked
            set!(world, (game, game_store_packed));
        }

        // fn feed_leaderboard(self: @ContractState, count: u32) {
        //     self.check_chain();

        //     let mut randomizer = RandomImpl::new(self.world());

        //     let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
        //     let leaderboard_version = leaderboard_manager.get_current_version();

        //     let mut i = 0;
        //     loop {
        //         if i == count {
        //             break;
        //         }

        //         let uuid = self.world().uuid();
        //         let uuid_f: felt252 = uuid.into();

        //         let rand: u32 = randomizer.between::<u32>(0, 100000000);
        //         let rand_100: u8 = randomizer.between::<u8>(0, 100);
        //         let rand_10: u8 = randomizer.between::<u8>(0, 10);

        //         // emit GameOver / Leaderboard entry
        //         self
        //             .world()
        //             .emit_raw(
        //                 array![
        //                     selector!("GameOver"),
        //                     Into::<u32, felt252>::into(uuid),
        //                     Into::<u32, felt252>::into(rand).into(),
        //                     leaderboard_version.into()
        //                 ],
        //                 array![
        //                     uuid_f,
        //                     Into::<u8, felt252>::into(i.try_into().unwrap() % 3_u8),
        //                     Into::<u8, felt252>::into(rand_10),
        //                     Into::<u32, felt252>::into(rand),
        //                     Into::<u8, felt252>::into(rand_100),
        //                     Into::<u8, felt252>::into(rand_100),
        //                 ]
        //             );

        //         i += 1;
        //     };
        // }

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
    }
}

