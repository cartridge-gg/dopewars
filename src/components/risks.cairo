#[derive(Drop)]
enum TradeEvent {
    None: (),
    Hacked: (u128, usize),
    Rugged: (u128, usize),
    Slippage: u128,
    ChainHalted: (),
}

#[derive(Drop)]
enum TravelEvent {
    None: (),
    Hurt: u8,
    Killed: (),
    Mugged: u128,
    Arrested: (),
}


#[derive(Component)]
struct Risks {
    // travel risk probabilities
    hurt: u8,
    killed: u8,
    mugged: u8,
    arrested: u8,

    // trade ris probabilities
    hacked: u8,
    rugged: u8,
    slippage: u8,
    chain_halted: u8,
}


trait RisksTrait {
    fn travel(self: Risks, seed: felt252) -> (felt252, bool, bool, u128, u8, u8);
    fn trade(self: Risks, seed: felt252) -> (felt252, u128, usize);
}

impl RisksImpl of RisksTrait {
    fn travel(
        self: Risks, 
        seed: felt252
    ) -> (
        felt252,    // event_name
        bool,       // arrested
        bool,       // killed
        u128,       // money_loss
        u8,         // health_loss
        u8          // respect_loss
    ) {
         // TODO: probablity of travel events
        let event = TravelEvent::None(());

        match event {
            TravelEvent::None(_) => {
                ('none', false, false, 0_u128, 0_u8, 0_u8)
            },
            TravelEvent::Hurt(health_loss) => { 
                ('hurt', false, false, 0_u128, health_loss, 0_u8)
            },
            TravelEvent::Killed(_) => {
                ('killed', false, true, 0_u128, 0_u8, 0_u8)
            },
            TravelEvent::Mugged(money_loss) => {
                ('mugged', false, false, money_loss, 0_u8, 0_u8)
            },
            TravelEvent::Arrested(_) => {
                ('arrested', true, false, 0_u128, 0_u8, 0_u8)
            },
        }
    }

    fn trade(
        self: Risks, 
        seed: felt252
    ) -> (
        felt252,    // event_name 
        u128,       // money_loss
        usize       // drug_loss
    ) {
        // TODO: probablity of trade events
        let event = TradeEvent::None(());

        match event {
            TradeEvent::None(_) => {
                ('none', 0_u128, 0_usize)
            },
            TradeEvent::Hacked((money_loss, drug_loss)) => {
                ('hacked', money_loss, drug_loss)
            },
            TradeEvent::Rugged((money_loss, drug_loss)) => {
                ('rugged', money_loss, drug_loss)
            },
            TradeEvent::Slippage(x) => {
                ('slippage', 0_u128, 0_usize)
            },
            TradeEvent::ChainHalted(_) => {
                ('chain_halted', 0_u128, 0_usize)
            }
        }
    }
}