use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::hustlers::{HustlerItemConfig, HustlerImpl, ItemSlot}, models::game::{Game, GameMode},
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}, packing::game_store::{GameStore},
    store::{Store, StoreImpl, StoreTrait}
};
use starknet::ContractAddress;


#[derive(Copy, Drop)]
struct ItemsPacked {
    store: @Store,
    hustler_id: u16,
    //
    packed: felt252
}


#[generate_trait]
impl ItemsPackedImpl of ItemsPackedTrait {
    fn new(s: @Store, hustler_id: u16) -> ItemsPacked {
        ItemsPacked { store: s, hustler_id, packed: 0 }
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

        let hustler = HustlerImpl::get(self.store, self.hustler_id);
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


    //
    //
    //

    #[inline(always)]
    fn is_maxed_out(self: ItemsPacked) -> bool {
        self.packed == 0b11111111
    }

    #[inline(always)]
    fn attack_item(self: ItemsPacked) -> HustlerItemConfig {
        self.get_item(ItemSlot::Weapon)
    }

    #[inline(always)]
    fn defense_item(self: ItemsPacked) -> HustlerItemConfig {
        self.get_item(ItemSlot::Clothes)
    }

    #[inline(always)]
    fn speed_item(self: ItemsPacked) -> HustlerItemConfig {
        self.get_item(ItemSlot::Feet)
    }

    #[inline(always)]
    fn transport_item(self: ItemsPacked) -> HustlerItemConfig {
        self.get_item(ItemSlot::Transport)
    }

    // stats

    #[inline(always)]
    fn attack(self: ItemsPacked) -> u8 {
        self.attack_item().tier.stat.try_into().unwrap()
    }

    #[inline(always)]
    fn defense(self: ItemsPacked) -> u8 {
        self.defense_item().tier.stat.try_into().unwrap()
    }

    #[inline(always)]
    fn speed(self: ItemsPacked) -> u8 {
        self.speed_item().tier.stat.try_into().unwrap()
    }

    #[inline(always)]
    fn transport(self: ItemsPacked) -> u32 {
        self.transport_item().tier.stat
    }
}

