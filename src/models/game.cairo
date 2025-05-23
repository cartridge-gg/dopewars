use starknet::ContractAddress;
use dojo::world::WorldStorageTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::world::{WorldStorage};

use rollyourown::{utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}}};
use rollyourown::{store::{Store, StoreImpl, StoreTrait}};
use rollyourown::interfaces::{
    dope_hustlers::{IDopeHustlersDispatcher, IDopeHustlersDispatcherTrait},
    dope_loot::{IDopeLootDispatcher, IDopeLootDispatcherTrait},
};

pub type GearId = felt252;

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum TokenId {
    GuestLootId: felt252,
    LootId: felt252,
    HustlerId: felt252,
}


#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum GameMode {
    Ranked,
    Noob,
    Warrior,
}

#[derive(Introspect, Copy, Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    //
    pub season_version: u16,
    pub game_mode: GameMode,
    //
    pub player_name: Bytes16,
    pub multiplier: u8,
    //
    pub game_over: bool,
    pub final_score: u32,
    pub registered: bool,
    pub claimed: bool,
    pub claimable: u32,
    pub position: u16,
    //
    pub token_id: TokenId,
    // sorted by slot order 0,1,2,3
    pub equipment_by_slot: Span<GearId>,
}

#[generate_trait]
impl GameImpl of GameTrait {
    fn new(
        dope_world: WorldStorage,
        game_id: u32,
        player_id: ContractAddress,
        season_version: u16,
        game_mode: GameMode,
        player_name: felt252,
        multiplier: u8,
        token_id: TokenId,
    ) -> Game {
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
        Game {
            game_id,
            player_id,
            //
            season_version,
            game_mode,
            //
            player_name: Bytes16Impl::from(player_name),
            multiplier,
            //
            game_over: false,
            final_score: 0,
            registered: false,
            claimed: false,
            claimable: 0,
            position: 0,
            //
            token_id,
            equipment_by_slot
            
        }
    }

    fn exists(self: Game) -> bool {
        self.season_version > 0
    }

    fn is_ranked(self: Game) -> bool {
        self.game_mode == GameMode::Ranked
    }
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
