use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IContract<TContractState> {
    fn set_world(ref self: TContractState, world: IWorldDispatcher);
    fn fun1(self: @TContractState, world: IWorldDispatcher, id: u32, value: felt252);
}

#[starknet::contract]
mod contract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    use super::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::IContract;

    #[storage]
    struct Storage {
        world: IWorldDispatcher,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Event0: Event0,
        Event1: Event1,
    }

    #[derive(Drop, starknet::Event)]
    struct Event0 {
        caller: ContractAddress,
    }


    #[derive(Drop, starknet::Event)]
    struct Event1 {
        caller: ContractAddress,
        id: u32,
        value: felt252
    }


    // #[constructor]
    // fn constructor(ref self: ContractState, world: ContractAddress,) {
    //     self.world.write(world);
    // }

    #[external(v0)]
    impl ContractImpl of IContract<ContractState> {
        fn set_world(ref self: ContractState, world: IWorldDispatcher) {
            self.world.write(world);
            emit!(world, Event0 { caller: get_caller_address() });
        }

        fn fun1(self: @ContractState, world: IWorldDispatcher, id: u32, value: felt252) {
            emit!(world, Event1 { caller: get_caller_address(), id, value });
        }
    }
}
