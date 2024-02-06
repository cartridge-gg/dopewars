use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::items::{ItemConfig, ItemConfigImpl, ItemSlot, ItemLevel}, models::game::GameMode,
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}
};


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

    #[inline(always)]
    fn get_slot_size(self: ItemsPacked) -> u8 {
        2
    }

    fn get_item(self: ItemsPacked, slot: ItemSlot) -> ItemConfig {
        let bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level: ItemLevel = bits.extract_into::<u8>(index, size).into();

        ItemConfigImpl::get(self.world, slot, level)
    }

    // assume you checked its possible or overflow crack boom OD
    fn upgrade_item(ref self: ItemsPacked, slot: ItemSlot) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level = bits.extract_into::<u8>(index, size);

        bits.replace::<u8>(index, size,level+1);

        self.packed = bits.into_felt();
    }

    
}

