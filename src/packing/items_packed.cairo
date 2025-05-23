use super::super::config::gear::GearItemConfigTrait;
use dojo::world::WorldStorageTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::gear::{GearItemConfig}, config::hustlers::{ ItemSlot},
    models::game::{Game, GameMode}, 
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}, packing::game_store::{GameStore},
    store::{Store, StoreImpl, StoreTrait},
    libraries::dopewars_items::{
        IDopewarsItemsLibraryDispatcher, IDopewarsItemsDispatcherTrait, DopewarsItemTier,
        DopewarsItemTierConfig,
    },
};
use starknet::ContractAddress;


#[derive(Copy, Drop)]
struct ItemsPacked {
    store: @Store,
    game: Game,
    //
    packed: felt252,
}


const DW_SLOT_IDS: [u8; 4] = [0, 1, 5, 2];

#[generate_trait]
impl ItemsPackedImpl of ItemsPackedTrait {
    fn new(s: @Store, game: Game) -> ItemsPacked {
        ItemsPacked { store: s, game, packed: 0 }
    }

    #[inline(always)]
    fn get_slot_size(self: ItemsPacked) -> u8 {
        2
    }

    fn get_item(self: ItemsPacked, slot: ItemSlot) -> GearItemConfig {
        let bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level: u8 = bits.extract_into::<u8>(index, size).into();

        let slot_u8: u8 = slot.into();
        let gear_id: u256 = (*self.game.equipment_by_slot.at(slot_u8.into())).into();
        let item_id: u8 = (gear_id & 0xff).try_into().unwrap();

        // TODO: set dispatcher in storage ?

        let items_disp = IDopewarsItemsLibraryDispatcher {
            class_hash: self.store.world.dns_class_hash(@"DopewarsItems_v0").unwrap(),
        };
        let dw_slot: u8 = *DW_SLOT_IDS.span().at(slot_u8.into());
        let tier = items_disp.get_item_tier(dw_slot, item_id);
        let levels = items_disp.get_tier_config(dw_slot, tier).span();

        GearItemConfig { slot, item_id, level, levels }


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
    fn attack_item(self: ItemsPacked) -> GearItemConfig {
        self.get_item(ItemSlot::Weapon)
    }

    #[inline(always)]
    fn defense_item(self: ItemsPacked) -> GearItemConfig {
        self.get_item(ItemSlot::Clothes)
    }

    #[inline(always)]
    fn speed_item(self: ItemsPacked) -> GearItemConfig {
        self.get_item(ItemSlot::Feet)
    }

    #[inline(always)]
    fn transport_item(self: ItemsPacked) -> GearItemConfig {
        self.get_item(ItemSlot::Transport)
    }

    // stats

    #[inline(always)]
    fn attack(self: ItemsPacked) -> u8 {
        (*self.attack_item().level_config().stat).try_into().unwrap()
    }

    #[inline(always)]
    fn defense(self: ItemsPacked) -> u8 {
        (*self.defense_item().level_config().stat).try_into().unwrap()
    }

    #[inline(always)]
    fn speed(self: ItemsPacked) -> u8 {
        (*self.speed_item().level_config().stat).try_into().unwrap()
    }

    #[inline(always)]
    fn transport(self: ItemsPacked) -> u32 {
        (*self.transport_item().level_config().stat).try_into().unwrap()
    }
}

