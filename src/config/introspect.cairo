


use dojo::database::introspect::{
    Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type
};

use super::drugs::Drugs;
use super::locations::Locations;


//
//
//

impl LocationsIntrospectionImpl of Introspect<Locations> {
    #[inline(always)]
    fn size() -> usize {
        1
    }

    #[inline(always)]
    fn layout(ref layout: Array<u8>) {
        layout.append(8);
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Enum(
            Enum {
                name: 'Locations',
                attrs: array![].span(),
                children: array![
                    ('Home', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Queens', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Bronx', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Brooklyn', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Jersey', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Central', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Coney', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}


//
//
//

impl DrugsIntrospectionImpl of Introspect<Drugs> {
    #[inline(always)]
    fn size() -> usize {
        1
    }

    #[inline(always)]
    fn layout(ref layout: Array<u8>) {
        layout.append(8);
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Enum(
            Enum {
                name: 'Drugs',
                attrs: array![].span(),
                children: array![
                    ('Ludes', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Speed', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Weed', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Acid', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Heroin', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Cocaine', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}

//
//
//


impl Bytes31IntrospectionImpl of Introspect<bytes31> {
    #[inline(always)]
    fn size() -> usize {
        1
    }

    #[inline(always)]
    fn layout(ref layout: Array<u8>) {
        layout.append(251);
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Primitive('felt252')
    }
}

