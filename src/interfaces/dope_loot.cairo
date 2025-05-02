#[starknet::interface]
pub trait IDopeLoot<T> {
    fn gear_item_id(self: @T, token_id: u256, slot_slug: felt252) -> u256;
}