use starknet::ContractAddress;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
struct GameStorePacked {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    packed: felt252
}

