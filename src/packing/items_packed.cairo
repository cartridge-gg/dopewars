use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::hustlers::{HustlerItemConfig, HustlerImpl, ItemSlot}, models::game::{Game, GameMode},
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}
};


#[derive(Copy, Drop)]
struct ItemsPacked {
    world: IWorldDispatcher,
    game: Game,
    //
    packed: felt252
}


#[generate_trait]
impl ItemsPackedImpl of ItemsPackedTrait {
    fn new(world: IWorldDispatcher, game: Game) -> ItemsPacked {
        ItemsPacked { world, game, packed: 0 }
    }

    #[inline(always)]
    fn get_slot_size(self: ItemsPacked) -> u8 {
        2
    }

    fn get_item(self: ItemsPacked, slot: ItemSlot) -> HustlerItemConfig {
        let bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level: u8 = bits.extract_into::<u8>(index, size).into();

        let hustler = HustlerImpl::get(self.world, self.game.hustler_id);
        hustler.get_item_config(slot, level)
    }

    // assume you checked its possible or overflow crack boom OD
    fn upgrade_item(ref self: ItemsPacked, slot: ItemSlot) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level = bits.extract_into::<u8>(index, size);

        bits.replace::<u8>(index, size, level + 1);

        self.packed = bits.into_felt();
    }
}

