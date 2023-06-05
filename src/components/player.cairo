#[derive(Component)]
struct Cash {
    amount: u128, 
}

#[derive(Component)]
struct Stats {
    health: u8,
    respect: u8,
    arrested: bool,
    turns_remaining: usize,
}

trait StatsTrait {
    fn can_continue(self: @Stats) -> bool;
}

impl StatsImpl of StatsTrait {
    fn can_continue(self: @Stats) -> bool {
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
