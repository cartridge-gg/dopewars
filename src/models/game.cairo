use dojo::world::WorldStorage;
// use dope_contracts::dope_hustlers::dope_hustlers_models::{HustlerSlots};
// use dope_contracts::dope_hustlers::dope_hustlers_store::{HustlerStoreImpl, HustlerStoreTrait};
// use dope_contracts::dope_loot::dope_loot_store::{LootStoreImpl, LootStoreTrait};
use rollyourown::store::StoreImpl;
use rollyourown::utils::bytes16::{Bytes16, Bytes16Impl};
use starknet::ContractAddress;

pub type GearId = felt252;

#[derive(Copy, Drop, Serde, PartialEq, Introspect, Default, DojoStore)]
pub enum TokenId {
    #[default]
    GuestLootId: felt252,
    LootId: felt252,
    HustlerId: felt252,
}


#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked, Default, DojoStore)]
pub enum GameMode {
    #[default]
    Ranked,
    Noob,
    Warrior,
}

// IntrospectPacked : doesnt supports array
#[derive(Introspect, Copy, Drop, Serde, DojoStore)]
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
    pub minigame_token_id: u64, // NFT token ID from game_components_minigame
    // sorted by slot order 0,1,2,3
    pub equipment_by_slot: Span<GearId>,
}

#[generate_trait]
pub impl GameImpl of GameTrait {
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
                // let mut loot_store = LootStoreImpl::new(dope_world);

                let _loot_id: u256 = loot_id.into();
                let mut equipment = array![0, 256, 1280, 512];
                // let mut equipment = array![
                // loot_store.gear_item_id(loot_id, HustlerSlots::Weapon).try_into().unwrap(),
                // loot_store.gear_item_id(loot_id, HustlerSlots::Clothe).try_into().unwrap(),
                // loot_store.gear_item_id(loot_id, HustlerSlots::Foot).try_into().unwrap(),
                // loot_store.gear_item_id(loot_id, HustlerSlots::Vehicle).try_into().unwrap(),
                // ];

                equipment.span()
            },
            TokenId::HustlerId(_hustler_id) => {
                // let mut hustler_store = HustlerStoreImpl::new(dope_world);
                // let weapon = hustler_store.hustler_slot(hustler_id.into(), HustlerSlots::Weapon);
                // let clothe = hustler_store.hustler_slot(hustler_id.into(), HustlerSlots::Clothe);
                // let foot = hustler_store.hustler_slot(hustler_id.into(), HustlerSlots::Foot);
                // let vehicle = hustler_store.hustler_slot(hustler_id.into(),
                // HustlerSlots::Vehicle);

                // let weapon_id: felt252 = weapon
                //     .gear_item_id
                //     .expect('must equip a weapon')
                //     .try_into()
                //     .unwrap();
                // let clothe_id: felt252 = clothe
                //     .gear_item_id
                //     .expect('must equip a clothe')
                //     .try_into()
                //     .unwrap();
                // let foot_id: felt252 = foot
                //     .gear_item_id
                //     .expect('must equip a foot')
                //     .try_into()
                //     .unwrap();
                // let vehicle_id: felt252 = vehicle
                //     .gear_item_id
                //     .expect('must equip a weapon')
                //     .try_into()
                //     .unwrap();

                // array![weapon_id, clothe_id, foot_id, vehicle_id].span()
                array![0, 256, 1280, 512].span()
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
            minigame_token_id: 0, // Will be set after minting
            equipment_by_slot,
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
