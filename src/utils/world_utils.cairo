use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{ClassHash, ContractAddress};

pub fn get_contract_infos(
    world: IWorldDispatcher, resource: felt252
) -> (ClassHash, ContractAddress) {
    let (class_hash, contract_address) = match world.resource(resource) {
        dojo::world::Resource::Contract((
            class_hash, contract_address
        )) => (class_hash, contract_address),
        _ => (0.try_into().unwrap(), 0.try_into().unwrap())
    };

    if class_hash.is_zero() || contract_address.is_zero() {
        panic!("Invalid resource!");
    }

    (class_hash, contract_address)
}
