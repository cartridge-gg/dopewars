use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Item {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    item_id: felt252,
    level: u8
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum ItemEnum {
    Attack,
    Defense,
    Transport,
    Speed,
}

#[generate_trait]
impl ItemImpl of ItemTrait {
    fn all() -> Span<felt252> {
        let mut items = array!['Attack', 'Defense', 'Transport', 'Speed'];
        items.span()
    }

    fn all_enum() -> Span<ItemEnum> {
        let mut items = array![
            ItemEnum::Attack, ItemEnum::Defense, ItemEnum::Transport, ItemEnum::Speed,
        ];
        items.span()
    }
}

