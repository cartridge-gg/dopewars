#[derive(Copy, Drop, Serde, IntrospectPacked, DojoStore)]
pub struct Bytes16 {
    pub value: u128,
}

#[generate_trait]
pub impl Bytes16Impl of Bytes16Trait {
    fn from(value: felt252) -> Bytes16 {
        Bytes16 { value: value.try_into().expect('value > 16 chars') }
    }
}


pub impl Bytes16Into<T, +Into<u128, T>> of Into<Bytes16, T> {
    fn into(self: Bytes16) -> T {
        self.value.into()
    }
}
