use dojo_core::integer::u250;

#[derive(Component, Copy, Drop, Serde)]
struct Drug {
    id: u250,
    quantity: usize,
}

