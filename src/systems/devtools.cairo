use starknet::ContractAddress;

#[starknet::interface]
trait IDevtools<TContractState> {
    fn failing_tx(self: @TContractState);
    fn feed_leaderboard(self: @TContractState, count: u32);
//fn get_cash(self: @TContractState, count: u32);
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

    use rollyourown::models::player::{Player, PlayerStatus};
    use rollyourown::models::location::{LocationEnum};
    use rollyourown::models::leaderboard::{Leaderboard};

    use rollyourown::utils::random::{RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};

    #[external(v0)]
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

                let rand: u128 = randomizer.between::<u128>(0, 100000000);
                let rand_100: u8 = randomizer.between::<u8>(0, 100);
                let rand_10: u8 = randomizer.between::<u8>(0, 10);
                let rand_2: u8 = randomizer.between::<u8>(0, 2);

                let player = Player {
                    game_id: uuid,
                    player_id: uuid_f.try_into().unwrap(),
                    mainnet_address: 0.try_into().unwrap(),
                    name: uuid_f,
                    avatar_id: rand_10,
                    status: PlayerStatus::Normal,
                    hood_id: LocationEnum::Home,
                    location_id: LocationEnum::Home,
                    next_location_id: LocationEnum::Home,
                    cash: rand * game.scaling_factor
                    health: rand_2,
                    drug_count: 0,
                    turn: rand_100.into(),
                    max_turns: rand_100.into(),
                    max_items: 2,
                    wanted: 69,
                    attack: 42,
                    defense: 42,
                    transport: 42,
                    speed: 42,
                    leaderboard_version,
                    game_over: true,
                };

                set!(self.world(), (player));

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

