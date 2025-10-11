use starknet::ContractAddress;

/// GameToken model stores the mapping between NFT token_id and game data
/// This allows the game_token system to resolve which game a token represents
#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct GameToken {
    #[key]
    pub token_id: u64,
    pub game_id: u32,
    pub player_id: ContractAddress,
}

#[generate_trait]
pub impl GameTokenImpl of GameTokenTrait {
    fn new(token_id: u64, game_id: u32, player_id: ContractAddress) -> GameToken {
        GameToken { token_id, game_id, player_id }
    }
}
