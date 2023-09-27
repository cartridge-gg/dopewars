mod components;
mod systems;
mod constants;
mod utils;

#[cfg(test)]
mod tests;

use dojo::database::schema::{
    EnumMember, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

#[derive(Copy, Drop, Serde, PartialEq)]
enum PlayerStatus {
    Normal: (),
    BeingMugged: (),
    BeingArrested: (),
}

impl PlayerStatusIntrospectionImpl of SchemaIntrospection<PlayerStatus> {
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
            EnumMember {
                name: 'PlayerStatus',
                attrs: array![].span(),
                values: array![
                    serialize_member_type(@Ty::Simple('Normal')),
                    serialize_member_type(@Ty::Simple('BeingMugged')),
                    serialize_member_type(@Ty::Simple('BeingArrested')),
                ]
                    .span()
            }
        )
    }
}

impl PlayerStatusPrintImpl of core::debug::PrintTrait<PlayerStatus> {
    fn print(self: PlayerStatus) {
        match self {
            PlayerStatus::Normal(()) => 0.print(),
            PlayerStatus::BeingMugged(()) => 1.print(),
            PlayerStatus::BeingArrested(()) => 2.print(),
        }
    }
}
