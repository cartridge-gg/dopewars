use dojo::meta::introspect::{Enum, Member, Ty, Introspect};
use dojo::meta::Layout;

use rollyourown::utils::bytes16::Bytes16;

impl Bytes31IntrospectionImpl of Introspect<bytes31> {
    #[inline(always)]
    fn size() -> Option<usize> {
        Option::Some(1)
    }

    #[inline(always)]
    fn layout() -> Layout {
        Layout::Fixed(array![251].span())
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Primitive('felt252')
    }
}


impl Bytes16IntrospectionImpl of Introspect<Bytes16> {
    #[inline(always)]
    fn size() -> Option<usize> {
        Option::Some(1)
    }

    #[inline(always)]
    fn layout() -> Layout {
        Layout::Fixed(array![128].span())
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Primitive('u128')
    }
}

