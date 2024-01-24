use starknet::ContractAddress;
use rollyourown::models::game::{GameMode};
use rollyourown::models::player::PlayerClass;
use rollyourown::models::item::{ItemTier};

#[derive(Copy, Drop, Serde)]
struct Items {
    attackItem: felt252,
    defenseItem: felt252,
    transportItem: felt252,
    speedItem: felt252,
}

#[derive(Copy, Drop, Serde)]
struct InitialTiers {
    attackTier: ItemTier,
    defenseTier: ItemTier,
    transportTier: ItemTier,
    speedTier: ItemTier,
}

#[derive(Copy, Drop, Serde)]
struct AvailableClasses {
    class: PlayerClass,
    items: Items,
    initialTiers: InitialTiers,
}

#[starknet::interface]
trait ILobby<TContractState> {
    fn create_game(
        self: @TContractState,
        game_mode: GameMode,
        player_name: felt252,
        class: PlayerClass,
        avatar_id: u8,
        mainnet_address: ContractAddress
    ) -> (u32, ContractAddress);

    fn set_name(
        self: @TContractState, game_id: u32, player_id: ContractAddress, player_name: felt252
    );

    fn get_available_classes(self: @TContractState) -> Span<AvailableClasses>;
}


#[dojo::contract]
mod lobby {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use starknet::get_block_timestamp;
    use starknet::info::get_tx_info;

    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus, PlayerClass};
    use rollyourown::models::game::{Game, GameMode};
    use rollyourown::models::market::Market;
    use rollyourown::models::drug::{Drug, DrugTrait};
    use rollyourown::models::location::{Location, LocationTrait, LocationEnum};
    use rollyourown::models::market::{MarketTrait};
    use rollyourown::models::leaderboard::{Leaderboard};
    use rollyourown::models::item::{ItemMetaImpl};

    use rollyourown::utils::settings::{
        GameSettings, GameSettingsImpl, PlayerSettings, PlayerSettingsImpl, ShopSettings,
        ShopSettingsImpl, ClassImplementation
    };
    use rollyourown::utils::market;
    use rollyourown::utils::random::{Random, RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};


    use super::{ILobby, AvailableClasses, Items, InitialTiers};


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
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        player_name: felt252
    }

    #[external(v0)]
    impl LobbyImpl of ILobby<ContractState> {
        fn create_game(
            self: @ContractState,
            game_mode: GameMode,
            player_name: felt252,
            class: PlayerClass,
            avatar_id: u8,
            mainnet_address: ContractAddress,
        ) -> (u32, ContractAddress) {
            assert_valid_name(player_name);
            assert_valid_chain(game_mode);

            let game_id = self.world().uuid();
            let caller = get_caller_address();

            let start_time = get_block_timestamp();

            let game_settings = GameSettingsImpl::get(game_mode);
            let player_settings = PlayerSettingsImpl::get(game_mode, class);
            let shop_settings = ShopSettingsImpl::get(game_mode);

            let mut randomizer = RandomImpl::new(self.world());

            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            let leaderboard_version = leaderboard_manager.on_game_start();

            let player = Player {
                game_id,
                player_id: caller,
                mainnet_address,
                name: player_name,
                avatar_id: avatar_id,
                status: PlayerStatus::Normal,
                hood_id: LocationEnum::Home,
                location_id: LocationEnum::Home,
                next_location_id: LocationEnum::Home,
                cash: player_settings.cash,
                health: player_settings.health,
                drug_count: 0,
                turn: 0,
                max_turns: game_settings.max_turns,
                max_items: shop_settings.max_item_allowed,
                wanted: player_settings.wanted,
                attack: player_settings.attack,
                defense: player_settings.defense,
                transport: player_settings.transport,
                speed: player_settings.speed,
                leaderboard_version,
                game_over: false,
                class,
            };

            let game = Game {
                game_id,
                game_mode,
                start_time: start_time,
                max_players: game_settings.max_players,
                num_players: 1, // caller auto joins
                max_turns: game_settings.max_turns,
                creator: caller,
            };

            set!(self.world(), (game, player));

            let mut locations = LocationTrait::all();
            loop {
                match locations.pop_front() {
                    Option::Some(location_id) => {
                        // initialize markets for location
                        market::initialize_markets(
                            self.world(), ref randomizer, game_id, game_mode, *location_id
                        );
                    },
                    Option::None(_) => { break (); }
                };
            };

            // emit player joined
            emit!(self.world(), PlayerJoined { game_id, player_id: caller, player_name });

            // emit game created
            emit!(self.world(), GameCreated { game_id, game_mode, creator: caller, start_time, });

            (game_id, caller)
        }

        fn set_name(
            self: @ContractState, game_id: u32, player_id: ContractAddress, player_name: felt252
        ) {
            assert_valid_name(player_name);

            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'CALLER_IS_NOT_OWNER'
            );

            let mut player = get!(self.world(), (game_id, player_id), Player);
            player.name = player_name;

            set!(self.world(), (player))
        }

        fn get_available_classes(self: @ContractState) -> Span<AvailableClasses> {
            let mut classes = array![
                PlayerClass::Dragon, PlayerClass::Monkey, PlayerClass::Rabbit,
            ];

            let mut available: Array<AvailableClasses> = array![];

            loop {
                match classes.pop_front() {
                    Option::Some(class) => {
                        let initialItems = class.get_initial_items();
                        let attackItem = initialItems.Attack.name();
                        let defenseItem = initialItems.Defense.name();
                        let transportItem = initialItems.Transport.name();
                        let speedItem = initialItems.Speed.name();
                        let attackTier = initialItems.Attack.initial_tier();
                        let defenseTier = initialItems.Defense.initial_tier();
                        let transportTier = initialItems.Transport.initial_tier();
                        let speedTier = initialItems.Speed.initial_tier();

                        let available_class = AvailableClasses {
                            class,
                            items: Items { attackItem, defenseItem, transportItem, speedItem, },
                            initialTiers: InitialTiers {
                                attackTier, defenseTier, transportTier, speedTier,
                            },
                        };

                        available.append(available_class);
                    },
                    Option::None => { break; },
                };
            };

            available.span()
        }
    }

    fn assert_valid_chain(
        game_mode: GameMode
    ) { // assert(game_mode == GameMode::Unlimited, 'invalid game_mode');
    //if game_mode == GameMode::Test {
    // let chain_id = get_tx_info().unbox().chain_id;
    // assert(chain_id != 'KATANA', 'wrong chain_id');
    // }
    }

    fn assert_valid_name(name: felt252) {
        let name_256: u256 = name.into();
        assert(name_256 > 0xffff, 'Name too short');
        assert(name_256 < 0xffffffffffffffffffffffffffffffffffffffff, 'Name too long');
    }
}
