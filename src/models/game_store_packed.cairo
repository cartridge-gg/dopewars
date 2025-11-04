use starknet::ContractAddress;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct GameStorePacked {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: ContractAddress,
    pub packed: felt252,
}

