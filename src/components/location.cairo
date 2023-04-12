use traits::Into;
use traits::TryInto;
use option::OptionTrait;
use debug::PrintTrait;


#[derive(Component)]
struct Location {
    id: u32,
}

#[derive(Drop)]
enum Event {
    Hurt: u8,
    Killed: (),
    Mugged: u128,
    Arrested: (),
}

trait LocationTrait {
    fn maybe_event(self: Location, seed: felt252) -> Option::<Event>;
}

impl LocationImpl of LocationTrait {
    fn maybe_event(self: Location, seed: felt252) -> Option::<Event> {
        // TODO: probablity of events happening
        Option::None(())
    }
}