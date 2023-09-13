#[system]
mod random {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;
    use rollyourown::components::game::Game;
    use rollyourown::components::name::Name;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Random: Random
    }

    #[derive(Drop, starknet::Event)]
    struct Random {
        likelihood: u8,
        iterations: u32,
        num_occured: u32,
    }

    fn execute(ctx: Context, likelihood: u8, iterations: u32) {
        let mut seed = starknet::get_tx_info().unbox().transaction_hash;

        let mut i = 0;
        let mut num_occured = 0;

        loop {
            if i == iterations {
                break ();
            }

            seed = pedersen::pedersen(seed, seed);
            let entropy: u256 = seed.into();
            let result: u128 = entropy.low % 100;

            if result <= likelihood.into() {
                num_occured += 1;
            };
            i += 1;
        };

        emit!(ctx.world, Random { likelihood, iterations, num_occured })
    }
}
