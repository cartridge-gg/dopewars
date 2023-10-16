use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};


#[starknet::interface]
trait IDevtools<TContractState> {
    fn failing_tx(self: @TContractState);
    fn feed_leaderboard(self: @TContractState, count: u32);
    //fn get_cash(self: @TContractState, count: u32);
}

#[starknet::contract]
mod devtools {
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::contract_address::Felt252TryIntoContractAddress;


    use super::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::IDevtools;


    use rollyourown::constants::SCALING_FACTOR;

    use rollyourown::utils::random;
    use rollyourown::models::player::{Player, PlayerStatus};
    use rollyourown::models::location::{LocationEnum};


    #[storage]
    struct Storage {
        world_dispatcher: IWorldDispatcher,
    }

  #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
           self.world_dispatcher.read()
        }
    }


    #[external(v0)]
    impl DevtoolsImpl of IDevtools<ContractState> {
        fn feed_leaderboard(self: @ContractState, count: u32) {
            let mut i = 0;
            loop {
                if i == count {
                    break;
                }

                let uuid = self.world().uuid();
                let uuid_f: felt252 = uuid.into();
                let rand = random::random((random::seed() + uuid_f), 0, 100000000);
                let rand_100: u8 = random::random((random::seed() + uuid_f), 0, 100)
                    .try_into()
                    .unwrap();

                let player = Player {
                    game_id: uuid,
                    player_id: uuid_f.try_into().unwrap(),
                    name: uuid_f,
                    status: PlayerStatus::Normal,
                    location_id: LocationEnum::Home,
                    cash: rand * SCALING_FACTOR,
                    health: rand_100,
                    drug_count: 0,
                    turn: rand_100.into(),
                    max_turns: rand_100.into(),
                    wanted:69,
                    attack:42,
                    defense:42,
                    transport:42,
                    speed:42,
                };

                set!(self.world(), (player));

                i += 1;
            };
        }

        fn failing_tx(self: @ContractState) {
            assert(0 == 1, 'failing tx');
        }

    }
}

