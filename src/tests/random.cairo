use debug::PrintTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::tests::test_helper::{SystemDispatchers, spawn_world};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};


#[test]
#[available_gas(100000000)]
fn test_random_between_0_2() {
    let (world, contracts) = spawn_world();

    starknet::testing::set_contract_address(111.try_into().unwrap());
    let mut randomizer = RandomImpl::new('world');
    let mut i = 0;
    loop {
        if i == 10 {
            break;
        }

        let rand = randomizer.between::<u8>(0, 2);
        rand.print();

        i += 1;
    };
}

#[test]
#[available_gas(100000000)]
fn test_random_u8() {
    let (world, contracts) = spawn_world();

    starknet::testing::set_contract_address(111.try_into().unwrap());
    let mut randomizer = RandomImpl::new('world');
    let mut i = 0;
    loop {
        if i == 3 {
            break;
        }

        let rand = randomizer.between::<u8>(0, 100);

        '1-----------'.print();
        rand.print();

        i += 1;
    };

    starknet::testing::set_contract_address(222.try_into().unwrap());
    let mut randomizer2 = RandomImpl::new('world');
    let mut i = 0;
    loop {
        if i == 3 {
            break;
        }

        let rand = randomizer2.between::<u8>(0, 100);

        '2-----------'.print();
        rand.print();

        i += 1;
    };
}
