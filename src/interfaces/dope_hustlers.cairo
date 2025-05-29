use starknet::ContractAddress;
use rollyourown::events::{HustlerBody, HustlerSlot};

#[starknet::interface]
pub trait IDopeHustlers<T> {
    fn gear_item_id(self: @T, hustler_id: u256, slot_slug: felt252) -> Option<u256>;
    fn body_slot(self: @T, hustler_id: u256, slot_slug: felt252) -> u8;
    fn hustler_equipment(self: @T, hustler_id: u256) -> Span<HustlerSlot>;
    fn hustler_body(self: @T, hustler_id: u256) -> Span<HustlerBody>;
    //
    fn get_slots(self: @T) -> Array<felt252>;
    //
    fn mint_hustler_to(ref self: T, recipient: ContractAddress);
}
