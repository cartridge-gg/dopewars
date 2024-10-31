use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::ContractAddress;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct RyoAddress {
    #[key]
    key: u8,
    paper: ContractAddress,
    treasury: ContractAddress,
    vrf: ContractAddress,
    laundromat: ContractAddress, // should be removed
}
