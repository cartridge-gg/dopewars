#[derive(Component, Copy, Drop, Serde)]
struct Location {
    id: u8, 
}

#[derive(Serde, Copy, Drop)]
enum LocationId {
    None: (),
    Bronx: (),
    Queens: (),
    Brooklyn: (),
    JerseyCity: (),
    CentralPark: (),
    ConeyIsland: (),
}

impl LocationIdIntoU8 of Into<LocationId, u8> {
    fn into(self: LocationId) -> u8 {
        match self {
            LocationId::None(()) => 0,
            LocationId::Bronx(()) => 1,
            LocationId::Queens(()) => 2,
            LocationId::Brooklyn(()) => 3,
            LocationId::JerseyCity(()) => 4,
            LocationId::CentralPark(()) => 5,
            LocationId::ConeyIsland(()) => 6,
        }
    }
}
