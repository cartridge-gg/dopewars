use rollyourown::utils::random::{Random, RandomImpl};

trait Enumerable<T> {
    fn all() -> Span<T>;
}

trait Randomizable<T> {
    fn random(ref randomizer: Random) -> T;
}

