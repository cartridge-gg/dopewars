use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::contract]
mod contract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        world: ContractAddress,
    }

    // #[constructor]
    // fn constructor(ref self: ContractState, world: ContractAddress,) {
    //     self.world.write(world);
    // }
}
