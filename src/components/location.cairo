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

        let mut money_loss = 0_u128;
        let mut health_loss = 0_u8;
        let mut respect_loss = 0_u8;
        let mut arrested = false;
        let mut killed = false;

        let event_name = match event {
            Event::None(_) => {
                'none'
            },
            Event::Hurt(x) => { 
                health_loss = x;
                'hurt'
            },
            Event::Killed(_) => {
                killed = true;
                'killed'
            },
            Event::Mugged(x) => {
                money_loss = x;
                'mugged'
            },
            Event::Arrested(_) => {
                arrested = true;
                'arrested'
            },
        };
        
        (event_name, arrested, killed, money_loss, health_loss, respect_loss)
    }
}