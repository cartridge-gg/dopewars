use starknet::ContractAddress;

#[starknet::interface]
trait IDevtools<TContractState> {
    fn failing_tx(self: @TContractState);
    fn feed_leaderboard(self: @TContractState, count: u32);
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
        models::leaderboard::{Leaderboard},
        utils::{random::{RandomImpl}, events::{RawEventEmitterTrait, RawEventEmitterImpl}},
        systems::{leaderboard::{LeaderboardManager, LeaderboardManagerTrait}},
    };


    #[abi(embed_v0)]
    impl DevtoolsImpl of IDevtools<ContractState> {
        fn feed_leaderboard(self: @ContractState, count: u32) {
            self.check_chain();

            let mut randomizer = RandomImpl::new(self.world());

            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            let leaderboard_version = leaderboard_manager.get_current_version();

            let mut i = 0;
            loop {
                if i == count {
                    break;
                }

                let uuid = self.world().uuid();
                let uuid_f: felt252 = uuid.into();

                let rand: u32 = randomizer.between::<u32>(0, 100000000);
                let rand_100: u8 = randomizer.between::<u8>(0, 100);
                let rand_10: u8 = randomizer.between::<u8>(0, 10);

                // emit GameOver / Leaderboard entry
                self
                    .world()
                    .emit_raw(
                        array![
                            selector!("GameOver"),
                            Into::<u32, felt252>::into(uuid),
                            Into::<u32, felt252>::into(rand).into(),
                            leaderboard_version.into()
                        ],
                        array![
                            uuid_f,
                            Into::<u8, felt252>::into(i.try_into().unwrap() % 3_u8),
                            Into::<u8, felt252>::into(rand_10),
                            Into::<u32, felt252>::into(rand),
                            Into::<u8, felt252>::into(rand_100),
                        ]
                    );

                i += 1;
            };
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
    }
}

