use dojo::world::{Context, IWorldDispatcherTrait};
use serde::Serde;
use array::{ArrayTrait, SpanTrait};
use starknet::ContractAddress;

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

#[derive(Drop, starknet::Event)]
struct Traveled {
    game_id: u32,
    player_id: ContractAddress,
    from_location: felt252,
    to_location: felt252,
}

#[derive(Drop, starknet::Event)]
struct RandomEvent {
    game_id: u32,
    player_id: ContractAddress,
    health_loss: u8,
    mugged: bool,
    arrested: bool
}
