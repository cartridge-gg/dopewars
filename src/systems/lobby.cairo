use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::game::{GameMode};

#[starknet::interface]
trait IGame<TContractState> {
    fn create_game(
        self: @TContractState, world: IWorldDispatcher, game_mode: GameMode
    ) -> (u32, ContractAddress);

    //fn join_game(self: @TContractState, world: IWorldDispatcher, game_id: u32) -> ContractAddress;
    fn set_name(self: @TContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252);
}


#[starknet::contract]
mod lobby {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    use rollyourown::PlayerStatus;
    use rollyourown::models::name::Name;
    use rollyourown::models::game::{Game, GameMode};
    use rollyourown::models::player::Player;
    use rollyourown::models::risks::Risks;
    use rollyourown::models::market::Market;
    use rollyourown::models::drug::{Drug, DrugTrait};
    use rollyourown::models::location::{Location, LocationTrait};
    use rollyourown::models::market::{MarketTrait};
    use rollyourown::utils::random;
    use rollyourown::utils::settings::{
        GameSettings, GameSettingsImpl, PlayerSettings, PlayerSettingsImpl, RiskSettings,
        RiskSettingsImpl
    };
    use rollyourown::utils::market;
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
        game_mode: GameMode,
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
            self: @ContractState, world: IWorldDispatcher, game_mode: GameMode,
        ) -> (u32, ContractAddress) {
            let game_id = world.uuid();
            let caller = get_caller_address();

            let start_time = get_block_timestamp();

            let game_settings = GameSettingsImpl::new(game_mode);
            let player_settings = PlayerSettingsImpl::new(game_mode);
            let risk_settings = RiskSettingsImpl::new(game_mode);

            let player = Player {
                game_id,
                player_id: caller,
                status: PlayerStatus::Normal,
                location_id: 0,
                cash: player_settings.cash,
                health: player_settings.health,
                run_attempts: 0,
                drug_count: 0,
                bag_limit: player_settings.bag_limit,
                turns_remaining: game_settings.max_turns,
                turns_remaining_on_death: 0
            };

            let game = Game {
                game_id,
                game_mode,
                start_time: start_time,
                max_players: game_settings.max_players,
                num_players: 1, // caller auto joins
                max_turns: game_settings.max_turns,
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
                                travel: risk_settings.travel,
                                capture: risk_settings.capture
                            })
                        );

                        let mut seed = random::seed();
                        seed = pedersen::pedersen(seed, *location_id);

                        // initialize markets for location
                        market::initialize_markets(
                            world, ref seed, game_id, game_mode, *location_id
                        );
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
                world,
                GameCreated {
                    game_id,
                    game_mode,
                    creator: caller,
                    start_time,
                    max_players: game_settings.max_players,
                    max_turns: game_settings.max_turns
                }
            );

            (game_id, caller)
        }

        fn set_name(
            self: @ContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252
        ) {
            set!(
                world,
                (Name { game_id, player_id: get_caller_address(), short_string: player_name, })
            )
        }
    // // not used actually, for multiplayer mode
    // fn join_game(
    //     self: @ContractState, world: IWorldDispatcher, game_id: u32
    // ) -> ContractAddress {
    //     let player_id = get_caller_address();
    //     let block_info = starknet::get_block_info().unbox();

    //     let mut game = get!(world, game_id, (Game));
    //     assert(!game.is_finished, 'game is finished');
    //     assert(game.max_players > game.num_players, 'game is full');
    //     assert(game.start_time >= block_info.block_timestamp, 'already started');

    //     game.num_players += 1;

    //     let player = Player {
    //         game_id,
    //         player_id,
    //         status: PlayerStatus::Normal,
    //         location_id: 0,
    //         cash: STARTING_CASH,
    //         health: STARTING_HEALTH,
    //         run_attempts: 0,
    //         drug_count: 0,
    //         bag_limit: STARTING_BAG_LIMIT,
    //         turns_remaining: game.max_turns,
    //         turns_remaining_on_death: 0
    //     };

    //     set!(world, (game, player));
    //     emit!(world, PlayerJoined { game_id, player_id });

    //     player_id
    // }

    }
}
