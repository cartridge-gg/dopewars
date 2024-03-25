use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const RYO_ADDRESS_CONFIG_KEY: u8 = 0;

#[derive(Model, Copy, Drop, Serde)]
struct RyoAddress {
    #[key]
    key: u8,
    paper: ContractAddress,
    treasury: ContractAddress,
}

#[derive(Copy, Drop)]
struct RyoAddressManager {
    world: IWorldDispatcher
}

#[generate_trait]
impl RyoAddressImpl of RyoAddressManagerTrait {
    fn new(world: IWorldDispatcher) -> RyoAddressManager {
        RyoAddressManager { world }
    }

    fn get(self: RyoAddressManager) -> RyoAddress {
        get!(self.world, (RYO_ADDRESS_CONFIG_KEY), RyoAddress)
    }

    fn set(self: RyoAddressManager, ryo_address: RyoAddress) {
        set!(self.world, (ryo_address));
    }

    // getters

    fn paper(self: RyoAddressManager) -> ContractAddress {
        self.get().paper
    }

    fn treasury(self: RyoAddressManager) -> ContractAddress {
        self.get().treasury
    }

}
