use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::game::{GameMode};

#[starknet::interface]
trait ILobby<TContractState> {
    fn create_game(
        self: @TContractState, game_mode: GameMode, player_name: felt252
    ) -> (u32, ContractAddress);

    //fn join_game(self: @TContractState,  game_id: u32) -> ContractAddress;
    fn set_name(self: @TContractState, game_id: u32, player_name: felt252);
}


#[starknet::contract]
mod lobby {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
    use rollyourown::models::game::{Game, GameMode};
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
    use super::ILobby;
    use super::{IWorldDispatcher, IWorldDispatcherTrait};
    use debug::PrintTrait;

    #[storage]
    struct Storage {
        world_dispatcher: ContractAddress,
    }

    #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            IWorldDispatcher { contract_address: self.world_dispatcher.read() }
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        PlayerJoined: PlayerJoined
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        game_mode: GameMode,
        creator: ContractAddress,
        start_time: u64,
        max_turns: usize,
        max_players: usize,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        game_id: u32,
        player_id: ContractAddress,
        player_name: felt252
    }

    #[external(v0)]
    impl LobbyImpl of ILobby<ContractState> {
        fn create_game(
            self: @ContractState, game_mode: GameMode, player_name: felt252
        ) -> (u32, ContractAddress) {
            assert_valid_name(player_name);

            let game_id = self.world().uuid();
            let caller = get_caller_address();

            let start_time = get_block_timestamp();

            let game_settings = GameSettingsImpl::get(game_mode);
            let player_settings = PlayerSettingsImpl::get(game_mode);
            let risk_settings = RiskSettingsImpl::get(game_mode);

            let player = Player {
                game_id,
                player_id: caller,
                name: player_name,
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

            set!(self.world(), (game, player));

            let mut locations = LocationTrait::all();
            loop {
                match locations.pop_front() {
                    Option::Some(location_id) => {
                        //set risks entity
                        set!(
                            self.world(),
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
                            self.world(), ref seed, game_id, game_mode, *location_id
                        );
                    },
                    Option::None(_) => {
                        break ();
                    }
                };
            };

            // emit player joined
            emit!(self.world(), PlayerJoined { game_id, player_id: caller, player_name });

            // emit game created
            emit!(
                self.world(),
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

        fn set_name(self: @ContractState, game_id: u32, player_name: felt252) {
            assert_valid_name(player_name);

            let player_id = get_caller_address();
            let mut player = get!(self.world(), (game_id, player_id), Player);
            player.name = player_name;

            set!(self.world(), (player))
        }
    //
    // // not used actually, for multiplayer mode
    // fn join_game(
    //     self: @ContractState,  game_id: u32
    // ) -> ContractAddress {
    //     let player_id = get_caller_address();
    //     let block_info = starknet::get_block_info().unbox();

    //     let mut game = get!(self.world(), game_id, (Game));
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

    fn assert_valid_name(name: felt252) {
        let name_256: u256 = name.into();
        assert(name_256 > 0xffff, 'Invalid name');
    }
}
