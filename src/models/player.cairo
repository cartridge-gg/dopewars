use starknet::ContractAddress;
use rollyourown::PlayerStatus;

#[derive(Model, Copy, Drop, Serde)]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    name: felt252,
    status: PlayerStatus,
    location_id: felt252,
    cash: u128,
    health: u8,
    run_attempts: u8,
    drug_count: usize,
    bag_limit: usize,
    turns_remaining: usize,
    turns_remaining_on_death: usize
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
        if self.status != PlayerStatus::Normal {
            return false;
        }

        true
    }
}
