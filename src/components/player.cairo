use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde)]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    location_id: felt252,
    cash: u128,
    health: u8,
    turns_remaining: usize,
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn can_continue(ref self: Player) -> bool {
        if self.health == 0 {
            return false;
        }
        if self.turns_remaining == 0 {
            return false;
        }

        true
    }
}
