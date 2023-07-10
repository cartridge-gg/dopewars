#[system]
mod create_game {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;

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
        SCALING_FACTOR, TRAVEL_RISK, HURT_RISK, MUGGED_RISK, ARRESTED_RISK, MARKET_CASH,
        MARKET_QUANTITY
    };

    fn execute(
        ctx: Context, start_time: u64, max_players: usize, max_turns: usize
    ) -> (u32, felt252) {
        let player_id: felt252 = ctx.origin.into();

        let game_id = ctx.world.uuid();

        // game entity
        set !(
            ctx.world,
            game_id.into(),
            (Game {
                game_id,
                start_time,
                max_players,
                num_players: 1, // caller auto joins
                max_turns,
                is_finished: false,
                creator: player_id,
            })
        );

        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let location_name = LocationTrait::random(seed);
        // player entity
        set !(
            ctx.world,
            (game_id, player_id).into(),
            (
                Player {
                    cash: 100 * SCALING_FACTOR, // $100
                    health: 100,
                    arrested: false,
                    turns_remaining: max_turns
                    }, Location {
                    name: location_name
                }
            )
        );

        // TODO: spawn locations with risk profiles balanced
        // with market pricing
        let mut locations = LocationTrait::all();
        loop {
            match locations.pop_front() {
                Option::Some(location_name) => {
                    //set location entity
                    set !(
                        ctx.world,
                        (game_id, *location_name).into(),
                        (
                            Location {
                                name: *location_name
                                }, Risks {
                                travel: TRAVEL_RISK,
                                hurt: HURT_RISK,
                                mugged: MUGGED_RISK,
                                arrested: ARRESTED_RISK
                            }
                        )
                    );

                    let mut drugs = DrugTrait::all();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_name) => {
                                //set market entity
                                set !(
                                    ctx.world,
                                    (game_id, *location_name, *drug_name).into(),
                                    (
                                        Name {
                                            short_string: *drug_name
                                            }, Market {
                                            cash: MARKET_CASH, quantity: MARKET_QUANTITY
                                        }
                                    )
                                );
                            },
                            Option::None(()) => {
                                break ();
                            }
                        };

                        // required otherwise error: Tail expression not allowed in a `loop` block
                        let wtf = 1;
                    }
                },
                Option::None(_) => {
                    break ();
                }
            };

            // required otherwise error: Tail expression not allowed in a `loop` block
            let wtf = 1;
        }

        // emit player joined
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @PlayerJoined { game_id, player_id, location: location_name }, ref values
        );
        emit(ctx, 'PlayerJoined', values.span());

        // emit game created
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @GameCreated { game_id, creator: player_id, start_time, max_players, max_turns },
            ref values
        );
        emit(ctx, 'GameCreated', values.span());

        (game_id, player_id)
    }
}
