use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct GameStorePacked {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    packed: felt252
}


