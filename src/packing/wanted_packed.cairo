use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game, GameImpl, GameMode,},
    config::{drugs::{Drugs}, locations::{Locations, LocationsEnumerableImpl}},
    utils::{
        math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsDefaultImpl, BitsTrait, BitsMathImpl}
    },
    packing::{game_store::{GameStore}, drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsUnpacked}}
};


// 18 bits : 3 bits x 6 locations
#[derive(Copy, Drop, Serde)]
struct WantedPacked {
    packed: felt252
}


#[generate_trait]
impl WantedPackedImpl of WantedPackedTrait {
    fn new(rand: u256) -> WantedPacked {
        let mask = BitsMathImpl::mask::<u256>(18);
        let safe_packed: felt252 = (rand & mask).try_into().unwrap();

        WantedPacked { packed: safe_packed }
    }

    #[inline(always)]
    fn get_slot_size(self: WantedPacked) -> u8 {
        3
    }

    fn get(self: @WantedPacked, location: Locations) -> u8 {
        let bits = BitsImpl::from_felt(*self.packed);

        let index: u8 = (location.into() - 1) * (*self).get_slot_size(); // location 0 = home
        let wanted: u8 = bits.extract_into::<u8>(index, (*self).get_slot_size());

        wanted
    }

    fn set(ref self: WantedPacked, location: Locations, value: u8) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let index: u8 = (location.into() - 1) * self.get_slot_size(); // location 0 = home
        bits.replace::<u8>(index, self.get_slot_size(), value.into());

        self.packed = bits.into_felt();
    }

}

