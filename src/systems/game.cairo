use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IGame<TContractState> {
    fn create_game(
        self: @TContractState,
        world: IWorldDispatcher,
        start_time: u64,
        max_players: usize,
        max_turns: usize
    ) -> (u32, ContractAddress);

    fn join_game(self: @TContractState, world: IWorldDispatcher, game_id: u32) -> ContractAddress;
    fn set_name(self: @TContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252);
}


#[starknet::contract]
mod game {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

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
        TRAVEL_RISK, CAPTURE_RISK, STARTING_CASH, STARTING_HEALTH, STARTING_BAG_LIMIT
    };
    use rollyourown::utils::random;
    use super::IGame;
    use super::{IWorldDispatcher, IWorldDispatcherTrait};
    use debug::PrintTrait;

    #[storage]
    struct Storage {}

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
        player_id: ContractAddress
    }

    #[external(v0)]
    impl GameImpl of IGame<ContractState> {
        fn create_game(
            self: @ContractState,
            world: IWorldDispatcher,
            start_time: u64,
            max_players: usize,
            max_turns: usize
        ) -> (u32, ContractAddress) {
            let game_id = world.uuid();
            let caller = get_caller_address();

            let player = Player {
                game_id,
                player_id: caller,
                status: PlayerStatus::Normal,
                location_id: 0,
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
                creator: caller,
            };

            set!(world, (game, player));

            let mut locations = LocationTrait::all();
            loop {
                match locations.pop_front() {
                    Option::Some(location_id) => {
                        //set risks entity
                        set!(
                            world,
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
                                        world,
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
            emit!(world, PlayerJoined { game_id, player_id: caller, });

            // emit game created
            emit!(
                world, GameCreated { game_id, creator: caller, start_time, max_players, max_turns }
            );

            (game_id, caller)
        }


        // not used actually, for multiplayer mode
        fn join_game(
            self: @ContractState, world: IWorldDispatcher, game_id: u32
        ) -> ContractAddress {
            let player_id = get_caller_address();
            let block_info = starknet::get_block_info().unbox();

            let mut game = get!(world, game_id, (Game));
            assert(!game.is_finished, 'game is finished');
            assert(game.max_players > game.num_players, 'game is full');
            assert(game.start_time >= block_info.block_timestamp, 'already started');

            game.num_players += 1;

            let player = Player {
                game_id,
                player_id,
                status: PlayerStatus::Normal,
                location_id: 0,
                cash: STARTING_CASH,
                health: STARTING_HEALTH,
                run_attempts: 0,
                drug_count: 0,
                bag_limit: STARTING_BAG_LIMIT,
                turns_remaining: game.max_turns,
                turns_remaining_on_death: 0
            };

            set!(world, (game, player));
            emit!(world, PlayerJoined { game_id, player_id });

            player_id
        }

        fn set_name(
            self: @ContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252
        ) {
            set!(
                world,
                (Name { game_id, player_id: get_caller_address(), short_string: player_name, })
            )
        }
    }
}
