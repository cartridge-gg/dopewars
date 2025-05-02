#[starknet::interface]
pub trait IDopeHustlers<T> {
    fn gear_item_id(self: @T, hustler_id: u256, slot_slug: felt252) -> Option<u256>;
}