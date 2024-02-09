use rollyourown::utils::math::MathTrait;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    config::items::{ItemConfig, ItemConfigImpl, ItemSlot, ItemLevel}, models::game::GameMode,
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}
};



#[derive(Copy, Drop)]
struct EncountersPacked {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    packed: felt252
}

impl EncountersPackedDefaultImpl of Default<EncountersPacked> {
    fn default() -> EncountersPacked {
        EncountersPacked {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            packed: 0
        }
    }
}


#[generate_trait]
impl EncountersPackedImpl of EncountersPackedTrait {
    fn new(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> EncountersPacked {
        EncountersPackedDefaultImpl::default()
    }

    #[inline(always)]
    fn get_slot_size(self: EncountersPacked) -> u8 {
        3
    }

    fn get_encounter_level(self: EncountersPacked, slot: Encounters) -> u8 {
        let bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level = bits.extract_into::<u8>(index, size);

        level
    }

    fn increase_encounter_level(ref self: EncountersPacked, slot: Encounters) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let size: u8 = self.get_slot_size();
        let index: u8 = slot.into() * size;
        let level = bits.extract_into::<u8>(index, size);

        bits.replace::<u8>(index, size, level.add_capped(1,7));

        self.packed = bits.into_felt();
    }
}



//
//
//

#[derive(Copy, Drop, Serde, PartialEq)]
enum Encounters {
    Cops,
    Gang,
}

impl EncountersIntoFelt252 of Into<Encounters, felt252> {
    fn into(self: Encounters) -> felt252 {
        match self {
            Encounters::Cops => 'Cops',
            Encounters::Gang => 'Gang',
        }
    }
}

impl EncountersIntoU8 of Into<Encounters, u8> {
    fn into(self: Encounters) -> u8 {
        match self {
            Encounters::Cops => 0,
            Encounters::Gang => 1,
        }
    }
}
