use dojo::world::{Context, IWorldDispatcherTrait};
use serde::Serde;
use array::{ArrayTrait, SpanTrait};
use starknet::ContractAddress;

// helper function to emit events, eventually dojo will 
// have framework level event/logging
fn emit(ctx: Context, name: felt252, values: Span<felt252>) {
    let mut keys = array::ArrayTrait::new();
    keys.append(name);
    ctx.world.emit(keys, values);
}

#[derive(Drop, starknet::Event)]
struct LocationCreated {
    game_id: u32,
    location_id: u32,
}

#[derive(Drop, starknet::Event)]
struct GameCreated {
    game_id: u32,
    creator: ContractAddress,
    start_time: u64,
    max_turns: usize,
    max_players: usize,
}

#[derive(Drop, starknet::Event)]
struct PlayerJoined {
    game_id: u32,
    player_id: ContractAddress,
    location_id: felt252,
}

#[derive(Drop, starknet::Event)]
struct Bought {
    game_id: u32,
    player_id: ContractAddress,
    drug_id: felt252,
    quantity: usize,
    cost: u128
}

#[derive(Drop, starknet::Event)]
struct Sold {
    game_id: u32,
    player_id: ContractAddress,
    drug_id: felt252,
    quantity: usize,
    payout: u128
}

