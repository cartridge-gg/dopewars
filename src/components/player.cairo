#[derive(Component)]
struct Name {
    name: felt252,
}

#[derive(Component)]
struct Stats {
    health: u8,
}

#[derive(Component)]
struct Inventory {
    gun: u8,
}

#[derive(Component)]
struct Location {
    id: u32,
}

#[derive(Component)]
struct Cash {
    amount: felt252,
}
