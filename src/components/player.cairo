#[derive(Component, Copy, Drop, Serde)]
struct Player {
    name: felt252,
    cash: u128,
    health: u8,
    arrested: bool,
    turns_remaining: usize,
}

trait PlayerTrait {
    fn can_continue(self: @Player) -> bool;
}

impl PlayerImpl of PlayerTrait {
    fn can_continue(self: @Player) -> bool {
        if *self.arrested {
            return false;
        }
        if *self.health == 0 {
            return false;
        }
        if *self.turns_remaining == 0 {
            return false;
        }

        true
    }
}
