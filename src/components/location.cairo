use traits::Into;
use traits::TryInto;
use option::OptionTrait;
use debug::PrintTrait;

use rollyourown::components::player::Cash;
use rollyourown::components::player::Stats;


#[derive(Component)]
struct Location {
    id: u32,
}

#[derive(Drop)]
enum Event {
    None: (),
    Hurt: u8,
    Killed: (),
    Mugged: u128,
    Arrested: (),
}

trait LocationTrait {
    fn risk_event(self: Location, seed: felt252) -> (felt252, bool, bool, u128, u8, u8);
}

impl LocationImpl of LocationTrait {
    fn risk_event(
        self: Location, 
        seed: felt252
    ) -> (
        felt252,    // event_name
        bool,       // arrested
        bool,       // killed
        u128,       // money_loss
        u8,         // health_loss
        u8,         // respect_loss 
    ) {

        // TODO: probablity of events happening
        let event = Event::None(());

        match event {
            Event::None(_) => {
                ('none', false, false, 0_u128, 0_u8, 0_u8)
            },
            Event::Hurt(health_loss) => { 
                ('hurt', false, false, 0_u128, health_loss, 0_u8)
            },
            Event::Killed(_) => {
                ('killed', false, true, 0_u128, 0_u8, 0_u8)
            },
            Event::Mugged(money_loss) => {
                ('mugged', false, false, money_loss, 0_u8, 0_u8)
            },
            Event::Arrested(_) => {
                ('arrested', true, false, 0_u128, 0_u8, 0_u8)
            },
        }
    }
}