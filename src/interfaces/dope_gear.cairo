use starknet::ContractAddress;

use dope_contracts::dope_gear::dope_gear_ext::{GearItem};

#[starknet::interface]
pub trait IDopeGear<T> {
    fn mint_batch(
        ref self: T,
        recipient: ContractAddress,
        token_ids: Span<u256>,
        values: Span<u256>,
        data: Span<felt252>,
    );

    fn random_gear_item_id(
        self: @T, seed: u256, slot_slug: felt252, dopeness: Option<felt252>,
    ) -> GearItem;
}
