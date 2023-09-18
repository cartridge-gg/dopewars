#[system]
mod create_game {
    use array::ArrayTrait;
    use array::SpanTrait;
    use box::BoxTrait;
    use option::OptionTrait;
    use traits::{Into, TryInto};
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerStatus;
    use rollyourown::components::name::Name;
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;
    use rollyourown::components::risks::Risks;
    use rollyourown::components::market::Market;
    use rollyourown::components::drug::{Drug, DrugTrait};
    use rollyourown::components::location::{Location, LocationTrait};
    use rollyourown::components::market::{MarketTrait};
    use rollyourown::constants::{
         TRAVEL_RISK, CAPTURE_RISK, STARTING_CASH, STARTING_HEALTH,
        STARTING_BAG_LIMIT
    };
    use rollyourown::utils::random;
    use debug::PrintTrait;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        PlayerJoined: PlayerJoined
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        creator: ContractAddress,
        start_time: u64,
        max_turns: usize,
        max_players: usize,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        game_id: u32,
        player_id: ContractAddress,
        location_id: felt252,
    }

    fn execute(
        ctx: Context, start_time: u64, max_players: usize, max_turns: usize
    ) -> (u32, ContractAddress) {
        let game_id = ctx.world.uuid();
        let location_id = LocationTrait::random();

        let player = Player {
            game_id,
            player_id: ctx.origin,
            status: PlayerStatus::Normal(()),
            location_id,
            cash: STARTING_CASH,
            health: STARTING_HEALTH,
            run_attempts: 0,
            drug_count: 0,
            bag_limit: STARTING_BAG_LIMIT,
            turns_remaining: max_turns,
            turns_remaining_on_death: 0
        };

        let game = Game {
            game_id,
            start_time,
            max_players,
            num_players: 1, // caller auto joins
            max_turns,
            is_finished: false,
            creator: ctx.origin,
        };

        set!(ctx.world, (game, player));

        let mut locations = LocationTrait::all();
        loop {
            match locations.pop_front() {
                Option::Some(location_id) => {
                    //set risks entity
                    set!(
                        ctx.world,
                        (Risks {
                            game_id,
                            location_id: *location_id,
                            travel: TRAVEL_RISK,
                            capture: CAPTURE_RISK
                        })
                    );

                    let mut seed = starknet::get_tx_info().unbox().transaction_hash;
                    seed = pedersen::pedersen(seed, *location_id);

                    let mut drugs = DrugTrait::all();
                    loop {
                        match drugs.pop_front() {
                            Option::Some(drug_id) => {
                                seed = pedersen::pedersen(seed, *drug_id);
                                let pricing_infos = MarketTrait::get_pricing_info(*drug_id);
                                let market_price = random(
                                    seed, pricing_infos.min_price, pricing_infos.max_price
                                );
                                let market_quantity: usize = random(
                                    seed, pricing_infos.min_qty, pricing_infos.max_qty
                                )
                                    .try_into()
                                    .unwrap();

                                let market_cash = market_quantity.into() * market_price;

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
        emit!(ctx.world, PlayerJoined { game_id, player_id: ctx.origin, location_id: location_id });

        // emit game created
        emit!(
            ctx.world,
            GameCreated { game_id, creator: ctx.origin, start_time, max_players, max_turns }
        );

        (game_id, ctx.origin)
    }
}
