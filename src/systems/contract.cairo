// use starknet::ContractAddress;
// use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// #[starknet::interface]
// trait IContract<TContractState> {
//     fn fun1(self: @TContractState, world: IWorldDispatcher, id: u32, value: felt252);
// }

// #[starknet::contract]
// mod contract {
//     use starknet::ContractAddress;
//     use starknet::get_caller_address;

//     use super::{IWorldDispatcher, IWorldDispatcherTrait};
//     use super::IContract;

//     #[storage]
//     struct Storage {
//         world_dispatcher: IWorldDispatcher,
//     }

//     #[constructor]
//     fn constructor(ref self: ContractState, world: IWorldDispatcher,) {
//         self.world_dispatcher.write(world);
//     }

//     #[event]
//     #[derive(Drop, starknet::Event)]
//     enum Event {
//         Event0: Event0,
//         Event1: Event1,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct Event0 {
//         caller: ContractAddress,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct Event1 {
//         caller: ContractAddress,
//         id: u32,
//         value: felt252
//     }

//     #[external(v0)]
//     impl ContractImpl of IContract<ContractState> {
//         fn fun1(self: @ContractState, world: IWorldDispatcher, id: u32, value: felt252) {
//             emit!(world, Event1 { caller: get_caller_address(), id, value });
//         }
//     }
// }

