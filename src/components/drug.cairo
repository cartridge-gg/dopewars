use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde)]
struct Drug {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    drug_id: felt252,
    quantity: usize,
}

#[generate_trait]
impl DrugImpl of DrugTrait {
    fn all() -> Span<felt252> {
        let mut drugs = array!['Acid', 'Weed', 'Ludes', 'Speed', 'Heroin', 'Cocaine'];
        drugs.span()
    }
}
