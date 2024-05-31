use dojo::database::introspect::{Enum, Member, Ty, Introspect, Layout};

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




// impl Bytes31IntrospectionImpl of Introspect<bytes31> {
//     #[inline(always)]
//     fn size() -> usize {
//         1
//     }

//     #[inline(always)]
//     fn layout(ref layout: Array<u8>) {
//         layout.append(251);
//     }

//     #[inline(always)]
//     fn ty() -> Ty {
//         Ty::Primitive('felt252')
//     }
// }

// impl Bytes16IntrospectionImpl of Introspect<Bytes16> {
//     #[inline(always)]
//     fn size() -> usize {
//         1
//     }

//     #[inline(always)]
//     fn layout(ref layout: Array<u8>) {
//         layout.append(128);
//     }

//     #[inline(always)]
//     fn ty() -> Ty {
//         Ty::Primitive('u128')
//     }
// }

