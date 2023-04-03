#[derive(Component)]
struct Name {
    name: felt252,
}

#[derive(Component)]
struct Stats {
    health: usize,
}

#[derive(Component)]
struct Inventory {
    weapon: usize,
    shoes: usize,
}

#[derive(Component)]
struct Cash {
    amount: u256,
}
