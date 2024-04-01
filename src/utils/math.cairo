trait MathTrait<T> {
    fn add_capped(self: T, value: T, cap: T) -> T;
    fn sub_capped(self: T, value: T, cap: T) -> T;
    fn pct(self: T, p: u128) -> T;
    fn min(lhs: T, rhs: T) -> T;
    fn max(lhs: T, rhs: T) -> T;
}

impl MathImpl<
    T,
    +PartialOrd<T>,
    +Add<T>,
    +AddEq<T>,
    +Sub<T>,
    +SubEq<T>,
    +Zeroable<T>,
    +Into<T, u128>,
    +TryInto<u128, T>,
    +Copy<T>,
    +Drop<T>
> of MathTrait<T> {
    fn add_capped(self: T, value: T, cap: T) -> T {
        if self + value >= cap {
            cap
        } else {
            self + value
        }
    }

    fn sub_capped(self: T, value: T, cap: T) -> T {
        if value >= self {
            cap
        } else {
            self - value
        }
    }

    fn pct(self: T, p: u128) -> T {
        (self.into() * p / 100).try_into().unwrap()
    }

    fn min(lhs: T, rhs: T) -> T {
        if lhs < rhs { lhs } else { rhs }
    }

    fn max(lhs: T, rhs: T) -> T {
        if lhs > rhs { lhs } else { rhs }
    }

}


impl MathImplU8 = MathImpl<u8>;
impl MathImplU16 = MathImpl<u16>;
impl MathImplU32 = MathImpl<u32>;
impl MathImplU64 = MathImpl<u64>;
impl MathImplU128 = MathImpl<u128>;
impl MathImplUSize = MathImpl<usize>;

