use dojo::world::WorldStorageTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::world::{WorldStorage};

use rollyourown::config::hustlers::ItemSlot;
use rollyourown::interfaces::{
    dope_hustlers::{IDopeHustlersDispatcher, IDopeHustlersDispatcherTrait},
    dope_loot::{IDopeLootDispatcher, IDopeLootDispatcherTrait},
};
use rollyourown::{store::{Store, StoreImpl, StoreTrait}};
use rollyourown::events::{HustlerSlot, HustlerBody};
use starknet::ContractAddress;

pub type GearId = felt252;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct GameWithTokenId {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub token_id: TokenId,
    // sorted by slot order 0,1,2,3
    pub equipment_by_slot: Span<GearId>,
}


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum TokenId {
    GuestLootId: felt252,
    LootId: felt252,
    HustlerId: felt252,
}


#[generate_trait]
pub impl GearIdImpl of GearIdTrait {
    fn item_id(self: @GearId) -> u8 {
        let value: u256 = (*self).into();
        (value & 0xff).try_into().unwrap()
    }
    fn slot_id(self: @GearId) -> u8 {
        let value: u256 = (*self).into();
        (value & 0xff00).try_into().unwrap()
    }
}

#[generate_trait]
pub impl GameWithTokenIdImpl of GameWithTokenIdTrait {
    fn new(
        dope_world: WorldStorage,
        store: Store,
        game_id: u32,
        player_id: ContractAddress,
        token_id: TokenId,
    ) -> GameWithTokenId {
        let equipment_by_slot = match token_id {
            TokenId::GuestLootId(loot_id) |
            TokenId::LootId(loot_id) => {
                let dope_loot = IDopeLootDispatcher {
                    contract_address: dope_world.dns_address(@"DopeLoot").unwrap(),
                };

                let mut equipment = array![
                    dope_loot.gear_item_id(loot_id.into(), 'Weapon').try_into().unwrap(),
                    dope_loot.gear_item_id(loot_id.into(), 'Clothe').try_into().unwrap(),
                    dope_loot.gear_item_id(loot_id.into(), 'Foot').try_into().unwrap(),
                    dope_loot.gear_item_id(loot_id.into(), 'Vehicle').try_into().unwrap(),
                ];

                equipment.span()
            },
            TokenId::HustlerId(hustler_id) => {
                let dope_hustlers = IDopeHustlersDispatcher {
                    contract_address: dope_world.dns_address(@"DopeHustlers").unwrap(),
                };

                let mut equipment = array![
                    dope_hustlers
                        .gear_item_id(hustler_id.into(), 'Weapon')
                        .expect('must equip a weapon')
                        .try_into()
                        .unwrap(),
                    dope_hustlers
                        .gear_item_id(hustler_id.into(), 'Clothe')
                        .expect('must equip a clothe')
                        .try_into()
                        .unwrap(),
                    dope_hustlers
                        .gear_item_id(hustler_id.into(), 'Foot')
                        .expect('must equip a foot')
                        .try_into()
                        .unwrap(),
                    dope_hustlers
                        .gear_item_id(hustler_id.into(), 'Vehicle')
                        .expect('must equip a vehicle')
                        .try_into()
                        .unwrap(),
                ];

                equipment.span()
            },
        };

        GameWithTokenId { game_id, player_id, token_id, equipment_by_slot }
    }
}

