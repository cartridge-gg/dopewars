use starknet::ContractAddress;
use rollyourown::PlayerStatus;

#[derive(Component, Copy, Drop, Serde)]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    status: PlayerStatus, // player status (normal, being mugged, being arrested)
    location_id: felt252, // current player location
    cash: u128, // player cash
    health: u8, // player health
    run_attempts: u8, // num times player tries to run during a single encounter
    drug_count: usize, // aggregate drugs player is carrying
    bag_limit: usize, // limit player is allowed to carry
    turns_remaining: usize, // number turns remaining
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
