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
#[derive(Copy, Drop)]
struct WantedPacked {
    world: IWorldDispatcher,
    game: Game,
    //
    packed: felt252
}


#[generate_trait]
impl WantedPackedImpl of WantedPackedTrait {
    fn new(world: IWorldDispatcher, game: Game) -> WantedPacked {
        let packed: u256 = core::pedersen::pedersen(game.game_id.into() + 1, game.player_id.into())
            .into();
        let mask = BitsMathImpl::mask::<u256>(18);
        let safe_packed: felt252 = (packed & mask).try_into().unwrap();

        WantedPacked { world, game, packed: safe_packed }
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


    #[inline(always)]
    fn get_wanted_risk(ref self: WantedPacked, location: Locations) -> u8 {
        // 0	0%   // cannot occurs
        // 1	0%   // cannot occurs
        // 2	15%  // cannot occurs
        // 3	30%
        // 4	45%
        // 5	60%
        // 6	75%
        // 7	90%

        let wanted = self.get(location);
        (wanted * 15).sub_capped(15, 0)
    }

    fn on_turn_end(ref self: WantedPacked, game_store: GameStore) {
        let mut locations = LocationsEnumerableImpl::all();
        let drugs = game_store.drugs.get();

        loop {
            match locations.pop_front() {
                Option::Some(location) => {
                    let mut value = self.get(*location);

                    if game_store.player.next_location == *location && game_store.player.next_location == game_store.player.prev_location {
                        // travel back to same location : +3
                        self.set(*location, value.add_capped(3, 7));
                    } else if game_store.player.location == *location {
                        // leaving current location with drugs : +5
                        if drugs.quantity > 0 {
                            self.set(*location, value.add_capped(5, 7));
                        };
                    } else if *location != game_store.player.next_location {
                        //  not next / not prev / not current : -1
                        self.set(*location, value.sub_capped(1, 0));
                    }
                },
                Option::None => { break; }
            }
        }
    }
// fn on_trade(ref self: WantedPacked, game_store: GameStore) { }
// fn on_encounter(ref self: WantedPacked, game_store: GameStore) { }
}

