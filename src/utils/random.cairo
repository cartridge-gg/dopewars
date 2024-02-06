use starknet::ContractAddress;
use starknet::get_contract_address;

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Copy, Drop, Serde)]
struct Random {
    world: IWorldDispatcher,
    seed: felt252,
    nonce: usize,
}

#[generate_trait]
impl RandomImpl of RandomTrait {
    // one instance by contract, then passed by ref to sub fns
    fn new(world: IWorldDispatcher) -> Random {
        Random { world, seed: seed(get_contract_address()), nonce: 0 }
    }

    fn next_seed(ref self: Random) -> felt252 {
        self.nonce += 1;
        self.seed = pedersen::pedersen(self.seed, self.nonce.into());
        self.seed
    }

    fn bool(ref self: Random) -> bool {
        let seed: u256 = self.next_seed().into();
        seed.low % 2 == 0
    }
    
    fn felt(ref self: Random) -> felt252 {
        let tx_hash = starknet::get_tx_info().unbox().transaction_hash;
        let seed= self.next_seed();
        pedersen::pedersen(tx_hash, seed)
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
        let seed: u256 = self.next_seed().into();

        if min >= max {
            return Zeroable::zero();
        };

        let range: u128 = max.into() - min.into();
        let rand = (seed.low % range) + min.into();
        rand.try_into().unwrap()
    }
}

fn seed(salt: ContractAddress) -> felt252 {
    pedersen::pedersen(starknet::get_tx_info().unbox().transaction_hash, salt.into())
}

