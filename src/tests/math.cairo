use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::tests::test_helper::{spawn_world, SystemDispatchers};
use rollyourown::utils::math::{MathTrait, MathImplU8};

use debug::PrintTrait;

#[test]
#[available_gas(100000000)]
fn test_math_pct() {
    let (world, contracts) = spawn_world();

    let value_2 = 2_u8;
    let value_100 = 100_u8;
    let value_250 = 250_u8;

    assert(value_2.pct(50) == 1, 'invalid pct 50');

    assert(value_100.pct(2) == 2, 'invalid pct 2');
    assert(value_100.pct(10) == 10, 'invalid pct 10');

    assert(value_250.pct(20) == 50, 'invalid pct 20');
}
