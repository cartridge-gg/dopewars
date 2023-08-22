use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
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

trait PlayerTrait {
    fn can_continue(self: @Player) -> bool;
}

impl PlayerImpl of PlayerTrait {
    fn can_continue(self: @Player) -> bool {
        if *self.health == 0 {
            return false;
        }
        if *self.turns_remaining == 0 {
            return false;
        }

        true
    }
}
