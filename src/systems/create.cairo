#[system]
mod create_game {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;

    use rollyourown::events::{emit, GameCreated};
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Cash;
    use rollyourown::components::player::Stats;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::Drug;
    use rollyourown::components::location::{Location, LocationId};
    use rollyourown::constants::{
        SCALING_FACTOR, MAX_LOCATIONS, MAX_PRODUCTS, TRAVEL_RISK, HURT_RISK, MUGGED_RISK,
        ARRESTED_RISK, MARKET_CASH, MARKET_QUANTITY
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

        // player entity
        set !(
            ctx.world,
            (game_id, player_id).into(),
            (
                Stats {
                    health: 100, respect: 0, arrested: false, turns_remaining: max_turns
                    }, Cash {
                    amount: 100 * SCALING_FACTOR // $100
                    }, Location {
                    id: LocationId::None(()).into()
                }
            )
        );

        // TODO: spawn locations with risk profiles balanced
        // with market pricing
        let mut location_index: u8 = 1;
        loop {
            if location_index >= MAX_LOCATIONS {
                break ();
            }

            set !(
                ctx.world,
                (game_id, location_index).into(),
                (
                    Location {
                        id: location_index
                        }, Risks {
                        travel: TRAVEL_RISK,
                        hurt: HURT_RISK,
                        mugged: MUGGED_RISK,
                        arrested: ARRESTED_RISK
                    }
                )
            )

            let mut drug_index: u8 = 0;
            loop {
                if drug_index >= MAX_PRODUCTS {
                    break ();
                }
                set !(
                    ctx.world,
                    (game_id, location_index, drug_index).into(),
                    (Market { cash: MARKET_CASH, quantity: MARKET_QUANTITY })
                );
                drug_index += 1;
            }

            location_index += 1;
        }

        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @GameCreated { game_id, creator: player_id, start_time, max_players, max_turns },
            ref values
        );
        emit(ctx, 'GameCreated', values.span());

        (game_id, player_id)
    }
}
