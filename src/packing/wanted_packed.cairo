use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::{game::GameMode,},
    config::{
        items::{ItemConfig, ItemSlot}, drugs::{Drugs},
        locations::{Locations, LocationsEnumerableImpl}
    },
    utils::{
        math::{MathTrait, MathImplU8},
        bits::{Bits, BitsImpl, BitsDefaultImpl, BitsTrait, BitsMathImpl}
    },
    packing::game_store::{GameStore}
};


// 18 bits : 3 bits x 6 locations
#[derive(Copy, Drop)]
struct WantedPacked {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    packed: felt252
}


impl WantedPackedDefaultImpl of Default<WantedPacked> {
    fn default() -> WantedPacked {
        WantedPacked {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            packed: 0
        }
    }
}

#[generate_trait]
impl WantedPackedImpl of WantedPackedTrait {
    fn new(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> WantedPacked {
        let packed: u256 = core::pedersen::pedersen(game_id.into() + 1, player_id.into()).into();
        let mask = BitsMathImpl::mask::<u256>(18);
        let safe_packed: felt252 = (packed & mask).try_into().unwrap();

        WantedPacked { world, game_id, player_id, packed: safe_packed }
    }


    fn get(self: @WantedPacked, location: Locations) -> u8 {
        let bits = BitsImpl::from_felt(*self.packed);

        let index: u8 = (location.into() - 1) * 3; // location 0 = home
        let wanted: u8 = bits.extract_into::<u8>(index, 3);

        wanted
    }

    fn set(ref self: WantedPacked, location: Locations, value: u8) {
        let mut bits = BitsImpl::from_felt(self.packed);

        let index: u8 = (location.into() - 1) * 3; // location 0 = home
        bits.replace::<u8>(index, 3, value.into());

        self.packed = bits.into_felt();
    }


    fn on_turn_end(ref self: WantedPacked, game_store: GameStore) {
        let mut locations = LocationsEnumerableImpl::all();

        loop {
            match locations.pop_front() {
                Option::Some(location) => {
                    let mut value = self.get(*location);

                    if game_store.player.next_location == *location {
                        if game_store.player.next_location == game_store.player.prev_location {
                            // travel back to same location : +3
                            self.set(*location, value.add_capped(3, 7))
                        } else {
                            // travel to location : +1
                            self.set(*location, value.add_capped(1, 7));
                        }
                    } else {
                        //not current location
                        if game_store.player.location != *location {
                            // nothin at location : -1
                            self.set(*location,  value.sub_capped(1, 0));
                        }
                    }
                },
                Option::None => { break; }
            }
        }
    }
// fn on_trade(ref self: WantedPacked, game_store: GameStore) { }
// fn on_encounter(ref self: WantedPacked, game_store: GameStore) { }
}

