use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::traits::{Enumerable, Randomizable};
use rollyourown::utils::random::{Random, RandomImpl};

use rollyourown::config::introspect::{Bytes31IntrospectionImpl};


#[derive(Model, Copy, Drop, Serde)]
struct LocationConfig {
    #[key]
    location: Locations,
    location_id: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct LocationConfigMeta {
    #[key]
    location: Locations,
    name: bytes31,
}


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum Locations {
    Home,
    Queens,
    Bronx,
    Brooklyn,
    Jersey,
    Central,
    Coney,
}

//
//
//

impl LocationsEnumerableImpl of Enumerable<Locations> {
    fn all() -> Span<Locations> {
        let mut items = array![
            Locations::Queens,
            Locations::Bronx,
            Locations::Brooklyn,
            Locations::Jersey,
            Locations::Central,
            Locations::Coney
        ];
        items.span()
    }
}

//
//
//

impl LocationsRandomizableImpl of Randomizable<Locations> {
    fn random(ref randomizer: Random) -> Locations {
        let locations = LocationsEnumerableImpl::all();
        let index = randomizer.between::<u32>(0, locations.len().into());
        *locations.at(index.try_into().unwrap())
    }
}

//
//
//

impl LocationsIntoFelt252 of Into<Locations, felt252> {
    fn into(self: Locations) -> felt252 {
        match self {
            Locations::Home => 'Home',
            Locations::Queens => 'Queens',
            Locations::Bronx => 'Bronx',
            Locations::Brooklyn => 'Brooklyn',
            Locations::Jersey => 'Jersey',
            Locations::Central => 'Central',
            Locations::Coney => 'Coney',
        }
    }
}

impl LocationsIntoU8 of Into<Locations, u8> {
    fn into(self: Locations) -> u8 {
        match self {
            Locations::Home => 0,
            Locations::Queens => 1,
            Locations::Bronx => 2,
            Locations::Brooklyn => 3,
            Locations::Jersey => 4,
            Locations::Central => 5,
            Locations::Coney => 6,
        }
    }
}


impl U8IntoLocations of Into<u8, Locations> {
    fn into(self: u8) -> Locations {
        let self252: felt252 = self.into();
        match self252 {
            0 => Locations::Home,
            1 => Locations::Queens,
            2 => Locations::Bronx,
            3 => Locations::Brooklyn,
            4 => Locations::Jersey,
            5 => Locations::Central,
            6 => Locations::Coney,
            _ => Locations::Home,
        }
    }
}


//
//
//

fn initialize_location_config(world: IWorldDispatcher) {
    set!(
        world, LocationConfigMeta { location: Locations::Home, name: 'Home'.try_into().unwrap(), }
    );
    set!(world, LocationConfig { location: Locations::Home, location_id: Locations::Home.into(), });

    set!(
        world,
        LocationConfigMeta { location: Locations::Queens, name: 'Queens'.try_into().unwrap(), }
    );
    set!(
        world,
        LocationConfig { location: Locations::Queens, location_id: Locations::Queens.into(), }
    );

    set!(
        world,
        LocationConfigMeta { location: Locations::Bronx, name: 'The Bronx'.try_into().unwrap(), }
    );
    set!(
        world, LocationConfig { location: Locations::Bronx, location_id: Locations::Bronx.into(), }
    );

    set!(
        world,
        LocationConfigMeta { location: Locations::Brooklyn, name: 'Brooklyn'.try_into().unwrap(), }
    );
    set!(
        world,
        LocationConfig { location: Locations::Brooklyn, location_id: Locations::Brooklyn.into(), }
    );

    set!(
        world,
        LocationConfigMeta { location: Locations::Jersey, name: 'Jersey City'.try_into().unwrap(), }
    );
    set!(
        world,
        LocationConfig { location: Locations::Jersey, location_id: Locations::Jersey.into(), }
    );

    set!(
        world,
        LocationConfigMeta {
            location: Locations::Central, name: 'Central Park'.try_into().unwrap(),
        }
    );
    set!(
        world,
        LocationConfig { location: Locations::Central, location_id: Locations::Central.into(), }
    );

    set!(
        world,
        LocationConfigMeta { location: Locations::Coney, name: 'Coney Island'.try_into().unwrap(), }
    );
    set!(
        world, LocationConfig { location: Locations::Coney, location_id: Locations::Coney.into(), }
    );
}

