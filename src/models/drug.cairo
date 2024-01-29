use starknet::ContractAddress;
use rollyourown::config::drugs::Drugs;

#[derive(Model, Copy, Drop, Serde )]
struct Drug {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    drug_id: Drugs,
    quantity: u8,
}

