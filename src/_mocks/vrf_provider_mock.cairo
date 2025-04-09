#[dojo::contract]
mod vrf_provider_mock {
    use cartridge_vrf::PublicKey;

    use cartridge_vrf::vrf_provider::vrf_provider_component::VrfProviderComponent;

    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::{ContractAddress, ClassHash};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: VrfProviderComponent, storage: vrf_provider, event: VrfProviderEvent);

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl VrfProviderImpl = VrfProviderComponent::VrfProviderImpl<ContractState>;

    impl VrfProviderInternalImpl = VrfProviderComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        vrf_provider: VrfProviderComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        VrfProviderEvent: VrfProviderComponent::Event,
    }

    fn dojo_init(ref self: ContractState, pubkey_x: felt252, pubkey_y: felt252) {
        self.ownable.initializer(starknet::get_caller_address());
        self.vrf_provider.initializer(PublicKey { x: pubkey_x, y: pubkey_y, });
    }
}
