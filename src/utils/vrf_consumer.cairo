use starknet::ContractAddress;

#[starknet::interface]
trait IVrfProviderConsumer<TContractState> {
    fn consume_random(ref self: TContractState, source: Source) -> felt252;
}

#[derive(Drop, Copy, Clone, Serde)]
pub enum Source {
    Nonce: ContractAddress,
    Salt: felt252,
}

#[generate_trait]
impl VrfImpl of VrfTrait {
    fn consume(vrf_provider: ContractAddress, source: Source) -> felt252 {
        IVrfProviderConsumerDispatcher { contract_address: vrf_provider }.consume_random(source)
    }
}
