use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    traits::{Enumerable},utils::introspect::{Bytes31IntrospectionImpl},
    utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait, }},
    config::settings::{DrugsMode}
};


#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
enum Drugs {
    Ludes,
    Speed,
    Weed,
    Shrooms,
    Acid,
    Ketamine,
    Heroin,
    Cocaine,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct DrugConfig {
    #[key]
    drugs_mode: DrugsMode,
    #[key]
    drug: Drugs,
    drug_id: u8,
    base: u16,
    step: u16,
    weight: u16,
    name: Bytes16,
}


//
//
//

impl DrugsEnumerableImpl of Enumerable<Drugs> {
    #[inline(always)]
    fn all() -> Span<Drugs> {
        let mut items = array![
            Drugs::Ludes,
            Drugs::Speed,
            Drugs::Weed,
            Drugs::Shrooms,
            Drugs::Acid,
            Drugs::Ketamine,
            Drugs::Heroin,
            Drugs::Cocaine
        ];
        items.span()
    }
}

//
//
//

impl DrugsIntoFelt252 of Into<Drugs, felt252> {
    fn into(self: Drugs) -> felt252 {
        match self {
            Drugs::Ludes => 'Ludes',
            Drugs::Speed => 'Speed',
            Drugs::Weed => 'Weed',
            Drugs::Shrooms => 'Shrooms',
            Drugs::Acid => 'Acid',
            Drugs::Ketamine => 'Ketamine',
            Drugs::Heroin => 'Heroin',
            Drugs::Cocaine => 'Cocaine',
        }
    }
}

impl DrugsIntoU8 of Into<Drugs, u8> {
    fn into(self: Drugs) -> u8 {
        match self {
            Drugs::Ludes => 0,
            Drugs::Speed => 1,
            Drugs::Weed => 2,
            Drugs::Shrooms => 3,
            Drugs::Acid => 4,
            Drugs::Ketamine => 5,
            Drugs::Heroin => 6,
            Drugs::Cocaine => 7,
        }
    }
}

impl U8IntoDrugs of Into<u8, Drugs> {
    fn into(self: u8) -> Drugs {
        let self252: felt252 = self.into();
        match self252 {
            0 => Drugs::Ludes,
            1 => Drugs::Speed,
            2 => Drugs::Weed,
            3 => Drugs::Shrooms,
            4 => Drugs::Acid,
            5 => Drugs::Ketamine,
            6 => Drugs::Heroin,
            7 => Drugs::Cocaine,
            _ => Drugs::Ludes,
        }
    }
}


//
//
//

fn initialize_drug_config_normal(world: IWorldDispatcher) {
    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Ludes,
            drug_id: Drugs::Ludes.into(),
            base: 24,
            step: 2,
            weight: 10,
            name: Bytes16Impl::from('Ludes')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Speed,
            drug_id: Drugs::Speed.into(),
            base: 150,
            step: 8,
            weight: 14,
            name: Bytes16Impl::from('Speed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Weed,
            drug_id: Drugs::Weed.into(),
            base: 402,
            step: 16,
            weight: 19,
            name: Bytes16Impl::from('Weed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Shrooms,
            drug_id: Drugs::Shrooms.into(),
            base: 906,
            step: 32,
            weight: 27,
            name: Bytes16Impl::from('Shrooms')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Acid,
            drug_id: Drugs::Acid.into(),
            base: 1914,
            step: 64,
            weight: 37,
            name: Bytes16Impl::from('Acid')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Ketamine,
            drug_id: Drugs::Ketamine.into(),
            base: 3930,
            step: 128,
            weight: 52,
            name: Bytes16Impl::from('Ketamine')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Heroin,
            drug_id: Drugs::Heroin.into(),
            base: 7962,
            step: 256,
            weight: 72,
            name: Bytes16Impl::from('Heroin')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Normal,
            drug: Drugs::Cocaine,
            drug_id: Drugs::Cocaine.into(),
            base: 16026,
            step: 512,
            weight: 100,
            name: Bytes16Impl::from('Cocaine')
        }
    );
}

fn initialize_drug_config_cheap(world: IWorldDispatcher) {
    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Ludes,
            drug_id: Drugs::Ludes.into(),
            base: 18,
            step: 1,
            weight: 5,
            name: Bytes16Impl::from('Ludes')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Speed,
            drug_id: Drugs::Speed.into(),
            base: 85,
            step: 6,
            weight: 10,
            name: Bytes16Impl::from('Speed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Weed,
            drug_id: Drugs::Weed.into(),
            base: 290,
            step: 18,
            weight: 15,
            name: Bytes16Impl::from('Weed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Shrooms,
            drug_id: Drugs::Shrooms.into(),
            base: 980,
            step: 54,
            weight: 25,
            name: Bytes16Impl::from('Shrooms')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Acid,
            drug_id: Drugs::Acid.into(),
            base: 2900,
            step: 111,
            weight: 30,
            name: Bytes16Impl::from('Acid')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Ketamine,
            drug_id: Drugs::Ketamine.into(),
            base: 6800,
            step: 186,
            weight: 45,
            name: Bytes16Impl::from('Ketamine')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Heroin,
            drug_id: Drugs::Heroin.into(),
            base: 13500,
            step: 231,
            weight: 65,
            name: Bytes16Impl::from('Heroin')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Cheap,
            drug: Drugs::Cocaine,
            drug_id: Drugs::Cocaine.into(),
            base: 19800,
            step: 284,
            weight: 100,
            name: Bytes16Impl::from('Cocaine')
        }
    );
}

fn initialize_drug_config_expensive(world: IWorldDispatcher) {
    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Ludes,
            drug_id: Drugs::Ludes.into(),
            base: 25,
            step: 1,
            weight: 12,
            name: Bytes16Impl::from('Ludes')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Speed,
            drug_id: Drugs::Speed.into(),
            base: 76,
            step: 3,
            weight: 17,
            name: Bytes16Impl::from('Speed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Weed,
            drug_id: Drugs::Weed.into(),
            base: 218,
            step: 10,
            weight: 23,
            name: Bytes16Impl::from('Weed')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Shrooms,
            drug_id: Drugs::Shrooms.into(),
            base: 796,
            step: 28,
            weight: 31,
            name: Bytes16Impl::from('Shrooms')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Acid,
            drug_id: Drugs::Acid.into(),
            base: 1989,
            step: 56,
            weight: 41,
            name: Bytes16Impl::from('Acid')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Ketamine,
            drug_id: Drugs::Ketamine.into(),
            base: 4467,
            step: 109,
            weight: 58,
            name: Bytes16Impl::from('Ketamine')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Heroin,
            drug_id: Drugs::Heroin.into(),
            base: 7934,
            step: 186,
            weight: 76,
            name: Bytes16Impl::from('Heroin')
        }
    );

    set!(
        world,
        DrugConfig {
            drugs_mode: DrugsMode::Expensive,
            drug: Drugs::Cocaine,
            drug_id: Drugs::Cocaine.into(),
            base: 17220,
            step: 333,
            weight: 100,
            name: Bytes16Impl::from('Cocaine')
        }
    );
}
