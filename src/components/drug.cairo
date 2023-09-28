use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Drug {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    drug_id: felt252,
    quantity: usize,
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum DrugEnum {
    Ludes,
    Speed,
    Weed,
    Acid,
    Heroin,
    Cocaine,
}

#[generate_trait]
impl DrugImpl of DrugTrait {
    fn all() -> Span<felt252> {
        let mut drugs = array!['Ludes', 'Speed', 'Weed', 'Acid', 'Heroin', 'Cocaine'];
        drugs.span()
    }

    fn all_enum() -> Span<DrugEnum> {
        let mut drugs = array![
            DrugEnum::Ludes,
            DrugEnum::Speed,
            DrugEnum::Weed,
            DrugEnum::Acid,
            DrugEnum::Heroin,
            DrugEnum::Cocaine
        ];
        drugs.span()
    }
}

