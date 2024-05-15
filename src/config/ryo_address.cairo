use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Model, Copy, Drop, Serde)]
struct RyoAddress {
    #[key]
    key: u8,
    paper: ContractAddress,
    treasury: ContractAddress,
    laundromat: ContractAddress,
}
