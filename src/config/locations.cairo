//
//
//

use dojo::model::{ModelStorage};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::traits::{Enumerable, Randomizable};
use rollyourown::utils::random::{Random, RandomImpl};

use rollyourown::{
    utils::{introspect::{Bytes31IntrospectionImpl}, bytes16::{Bytes16, Bytes16Impl, Bytes16Trait,}},
    store::{Store, StoreImpl, StoreTrait}
};

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct LocationConfig {
    #[key]
    location: Locations,
    location_id: u8,
    name: Bytes16,
}

#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
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
        array![
            Locations::Queens,
            Locations::Bronx,
            Locations::Brooklyn,
            Locations::Jersey,
            Locations::Central,
            Locations::Coney
        ]
            .span()
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
fn initialize_location_config(ref store: Store) {
    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Home,
                location_id: Locations::Home.into(),
                name: Bytes16Impl::from('Home')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Queens,
                location_id: Locations::Queens.into(),
                name: Bytes16Impl::from('Queens')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Bronx,
                location_id: Locations::Bronx.into(),
                name: Bytes16Impl::from('The Bronx')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Brooklyn,
                location_id: Locations::Brooklyn.into(),
                name: Bytes16Impl::from('Brooklyn')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Jersey,
                location_id: Locations::Jersey.into(),
                name: Bytes16Impl::from('Jersey City')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Central,
                location_id: Locations::Central.into(),
                name: Bytes16Impl::from('Central Park')
            }
        );

    store
        .world
        .write_model(
            @LocationConfig {
                location: Locations::Coney,
                location_id: Locations::Coney.into(),
                name: Bytes16Impl::from('Coney Island')
            }
        );
}

