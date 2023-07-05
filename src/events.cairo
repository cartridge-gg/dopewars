use dojo::world::{Context, IWorldDispatcherTrait};
use serde::Serde;
use array::{ArrayTrait, SpanTrait};

// helper function to emit events, eventually dojo will 
// have framework level event/logging
fn emit(ctx: Context, name: felt252, values: Span<felt252>) {
    let mut keys = array::ArrayTrait::new();
    keys.append(name);
    ctx.world.emit(keys.span(), values);
}

#[derive(Drop, Serde)]
struct LocationCreated {
    game_id: u32,
    location_id: u32,
}

#[derive(Drop, Serde)]
struct GameCreated {
    game_id: u32,
    creator: felt252,
    start_time: u64,
    max_turns: usize,
    max_players: usize,
    max_locations: usize
}

#[derive(Drop, Serde)]
struct PlayerJoined {
    game_id: u32,
    player_id: felt252,
}

#[derive(Drop, Serde)]
struct Bought {
    game_id: u32,
    player_id: felt252,
    drug_id: u32,
    quantity: usize,
    cost: u128
}

#[derive(Drop, Serde)]
struct Sold {
    game_id: u32,
    player_id: felt252,
    drug_id: u32,
    quantity: usize,
    payout: u128
}

#[derive(Drop, Serde)]
struct Traveled {
    game_id: u32,
    player_id: felt252,
    from_location_id: u32,
    to_location_id: u32,
}

#[derive(Drop, Serde)]
struct RandomEvent {
    game_id: u32,
    player_id: felt252,
    health_loss: u8,
    money_loss: u128,
    respect_loss: u8,
    arrested: bool,
    killed: bool
}
