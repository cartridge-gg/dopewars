use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const RYO_META_KEY: u32 = 420;

#[derive(Model, Copy, Drop, Serde)]
struct RyoMeta {
    #[key]
    id: u32,
    initialized: bool,
    leaderboard_version: u32,
}

#[derive(Copy, Drop)]
struct RyoMetaManager {
    world: IWorldDispatcher
}

#[generate_trait]
impl RyoMetaImpl of RyoMetaManagerTrait {
    fn new(world: IWorldDispatcher) -> RyoMetaManager {
        RyoMetaManager { world }
    }

    fn get(self: RyoMetaManager) -> RyoMeta {
        get!(self.world, (RYO_META_KEY), RyoMeta)
    }

    fn set(self: RyoMetaManager, ryo_meta: RyoMeta) {
        set!(self.world, (ryo_meta));
    }

}
