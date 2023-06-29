#[derive(Component, Copy, Drop, Serde)]
struct Drug {
    id: u32,
    quantity: usize,
}
