use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::ContractAddress;
use starknet::get_contract_address;

#[derive(Copy, Drop, Serde)]
struct Random {
    seed: felt252,
    nonce: usize,
}

#[generate_trait]
impl RandomImpl of RandomTrait {
    fn new(seed: felt252) -> Random {
        Random { seed, nonce: 0 }
    }

    fn next(ref self: Random) -> felt252 {
        self.nonce += 1;
        poseidon::poseidon_hash_span(array![self.seed, self.nonce.into()].span())
    }

    fn bool(ref self: Random) -> bool {
        let seed: u256 = self.next().into();
        seed.low % 2 == 0
    }

    fn occurs(ref self: Random, likelihood: u8) -> bool {
        if likelihood == 0 {
            return false;
        }

        let result = self.between::<u8>(0, 100);
        result <= likelihood
    }

    fn between<
        T,
        +Into<T, u128>,
        +Into<T, u256>,
        +TryInto<u128, T>,
        +PartialOrd<T>,
        +Zeroable<T>,
        +Copy<T>,
        +Drop<T>
    >(
        ref self: Random, min: T, max: T
    ) -> T {
        let seed: u256 = self.next().into();

        if min >= max {
            return Zeroable::zero();
        };

        let range: u128 = max.into() - min.into();
        let rand = (seed.low % range) + min.into();
        rand.try_into().unwrap()
    }
}

