use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game, GameMode},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsTrait, BitsMathImpl}
    }
};


#[derive(Copy, Drop)]
struct EncountersPacked {
    world: IWorldDispatcher,
    game: Game,
    //
    packed: felt252
}


#[generate_trait]
impl EncountersPackedImpl of EncountersPackedTrait {
    fn new(world: IWorldDispatcher, game: Game) -> EncountersPacked {
        EncountersPacked { world, game, packed: 0 }
    }

    #[inline(always)]
    fn get_slot_size(self: EncountersPacked) -> u8 {
        3
    }

    fn get_encounter_level(self: EncountersPacked, slot: Encounters) -> u8 {
        let bits = BitsImpl::from_felt(self.packed);

        let index: u8 = slot.into() * self.get_slot_size();
        let level = bits.extract_into::<u8>(index, self.get_slot_size());

        level
    }

    fn increase_encounter_level(ref self: EncountersPacked, slot: Encounters) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let index: u8 = slot.into() * self.get_slot_size();
        let level = bits.extract_into::<u8>(index, self.get_slot_size());

        bits.replace::<u8>(index, self.get_slot_size(), level.add_capped(1, 7));

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
