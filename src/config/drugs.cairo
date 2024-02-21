use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use core::bytes_31::{bytes31, Felt252TryIntoBytes31};

use rollyourown::{
    traits::{Enumerable},
    config::introspect::{Bytes31IntrospectionImpl}
};


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum Drugs {
    Ludes,
    Speed,
    Weed,
    Acid,
    Heroin,
    Cocaine,
}


#[derive(Model, Copy, Drop, Serde)]
struct DrugConfig {
    #[key]
    drug: Drugs,
    drug_id: u8,
    base: usize,
    step: usize,
    weight: usize,
    from_turn: u8,
    to_turn: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct DrugConfigMeta {
    #[key]
    drug: Drugs,
    name: bytes31,
}

//
//
//

#[generate_trait]
impl DrugConfigImpl of DrugConfigTrait {
    #[inline(always)]
    fn get(world: IWorldDispatcher, drug: Drugs) -> DrugConfig {
        get!(world, (drug), DrugConfig)
    }
}

//
//
//

impl DrugsEnumerableImpl of Enumerable<Drugs> {
    #[inline(always)]
    fn all() -> Span<Drugs> {
        let mut items = array![
            Drugs::Ludes, Drugs::Speed, Drugs::Weed, Drugs::Acid, Drugs::Heroin, Drugs::Cocaine
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
            Drugs::Acid => 'Acid',
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
            Drugs::Acid => 3,
            Drugs::Heroin => 4,
            Drugs::Cocaine => 5,
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
            3 => Drugs::Acid,
            4 => Drugs::Heroin,
            5 => Drugs::Cocaine,
            _ => Drugs::Ludes,
        }
    }
}


//
//
//

fn initialize_drug_config(world: IWorldDispatcher) {
    set!(world, DrugConfigMeta { drug: Drugs::Ludes, name: 'Ludes'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Ludes,
            drug_id: Drugs::Ludes.into(),
            base: 18,
            step: 1,
            weight: 2,
            from_turn: 0,
            to_turn: 7
        }
    );

    set!(world, DrugConfigMeta { drug: Drugs::Speed, name: 'Speed'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Speed,
            drug_id: Drugs::Speed.into(),
            base: 85,
            step: 6,
            weight: 5,
            from_turn: 0,
            to_turn: 14
        }
    );

    set!(world, DrugConfigMeta { drug: Drugs::Weed, name: 'Weed'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Weed,
            drug_id: Drugs::Weed.into(),
            base: 420,
            step: 23,
            weight: 14,
            from_turn: 0,
            to_turn: 255
        }
    );

    set!(world, DrugConfigMeta { drug: Drugs::Acid, name: 'Acid'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Acid,
            drug_id: Drugs::Acid.into(),
            base: 1590,
            step: 69,
            weight: 30,
            from_turn: 0,
            to_turn: 255
        }
    );

    set!(world, DrugConfigMeta { drug: Drugs::Heroin, name: 'Heroin'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Heroin,
            drug_id: Drugs::Heroin.into(),
            base: 5720,
            step: 169,
            weight: 65,
            from_turn: 8,
            to_turn: 255
        }
    );

    set!(world, DrugConfigMeta { drug: Drugs::Cocaine, name: 'Cocaine'.try_into().unwrap(), });
    set!(
        world,
        DrugConfig {
            drug: Drugs::Cocaine,
            drug_id: Drugs::Cocaine.into(),
            base: 12200,
            step: 242,
            weight: 100,
            from_turn: 15,
            to_turn: 255
        }
    );
}
