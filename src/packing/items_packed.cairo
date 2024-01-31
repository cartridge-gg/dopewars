use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::config::items::{ItemConfig, ItemSlot};
use rollyourown::packing::game_store::GameMode;

#[derive(Copy, Drop)]
struct ItemsPacked {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    packed: felt252
}

impl ItemsPackedDefaultImpl of Default<ItemsPacked> {
    fn default() -> ItemsPacked {
        ItemsPacked {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            packed: 0
        }
    }
}


#[generate_trait]
impl ItemsPackedImpl of ItemsPackedTrait {
    fn new(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> ItemsPacked {
        ItemsPackedDefaultImpl::default()
    }
}

