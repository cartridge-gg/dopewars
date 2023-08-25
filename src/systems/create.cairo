#[system]
mod create_game {
    use array::ArrayTrait;
    use array::SpanTrait;
    use box::BoxTrait;
    use option::OptionTrait;
    use traits::{Into, TryInto};
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::events::{emit, GameCreated, PlayerJoined};
    use rollyourown::components::name::Name;
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::{Drug, DrugTrait};
    use rollyourown::components::location::{Location, LocationTrait};
    use rollyourown::constants::{
        SCALING_FACTOR, TRAVEL_RISK, HURT_RISK, MUGGED_RISK, ARRESTED_RISK, MIN_CASH, MAX_CASH,
        MIN_QUANITTY, MAX_QUANTITY, STARTING_CASH
    };
    use rollyourown::utils::random;

    fn execute(
        ctx: Context, start_time: u64, max_players: usize, max_turns: usize
    ) -> (u32, ContractAddress) {
        let game_id = ctx.world.uuid();

        // game entity
        set!(
            ctx.world,
            (Game {
                game_id,
                start_time,
                max_players,
                num_players: 1, // caller auto joins
                max_turns,
                is_finished: false,
                creator: ctx.origin,
            })
        );

        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let location_id = LocationTrait::random(seed);
        // player entity
        set!(
            ctx.world,
            (
                Player {
                    game_id,
                    player_id: ctx.origin,
                    location_id,
                    cash: STARTING_CASH,
                    health: 100,
                    turns_remaining: max_turns
                },
            )
        );

        // TODO: spawn locations with risk profiles balanced
        // with market pricing
        let mut locations = LocationTrait::all();
        loop {
            match locations.pop_front() {
                Option::Some(location_id) => {
                    //set location entity
                    set!(
                        ctx.world,
                        (Risks {
                            game_id,
                            location_id: *location_id,
                            travel: TRAVEL_RISK,
                            hurt: HURT_RISK,
                            mugged: MUGGED_RISK,
                            arrested: ARRESTED_RISK
                        })
                    );

                    let mut seed = starknet::get_tx_info().unbox().transaction_hash;
                    seed = pedersen(seed, *location_id);

                    let mut drugs = DrugTrait::all();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_id) => {
                                // HACK: temp hack to get some randomness
                                seed = pedersen(seed, *drug_id);
                                let market_cash = random(seed, MIN_CASH, MAX_CASH);
                                let rand = random(seed, MIN_QUANITTY.into(), MAX_QUANTITY.into());
                                let market_quantity: usize = rand.try_into().unwrap();

                                //set market entity
                                set!(
                                    ctx.world,
                                    (Market {
                                        game_id,
                                        location_id: *location_id,
                                        drug_id: *drug_id,
                                        cash: market_cash,
                                        quantity: market_quantity
                                    })
                                );
                            },
                            Option::None(()) => {
                                break ();
                            }
                        };
                    };
                },
                Option::None(_) => {
                    break ();
                }
            };
        };

        // emit player joined
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @PlayerJoined { game_id, player_id: ctx.origin, location_id: location_id }, ref values
        );
        emit(ctx, 'PlayerJoined', values.span());

        // emit game created
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @GameCreated { game_id, creator: ctx.origin, start_time, max_players, max_turns },
            ref values
        );
        emit(ctx, 'GameCreated', values.span());

        (game_id, ctx.origin)
    }
}
