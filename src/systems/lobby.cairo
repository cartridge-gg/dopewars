use starknet::ContractAddress;
use rollyourown::models::game::{GameMode};

#[starknet::interface]
trait ILobby<TContractState> {
    fn create_game(
        self: @TContractState, game_mode: GameMode, player_name: felt252, avatar_id: u8
    ) -> (u32, ContractAddress);

    fn set_name(self: @TContractState, game_id: u32, player_id: ContractAddress, player_name: felt252);
}


#[dojo::contract]
mod lobby {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use starknet::info::get_tx_info;

    use rollyourown::config::locations::Locations;

    use rollyourown::models::{
        game::{Game, GameMode},
        player::{Player, PlayerTrait, PlayerStatus},
        drug::{Drug},
        leaderboard::{Leaderboard}
    };
  
    use rollyourown::utils::settings::{
        GameSettings, GameSettingsImpl, PlayerSettings, PlayerSettingsImpl, ShopSettings,
        ShopSettingsImpl
    };
    use rollyourown::utils::random::{Random, RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};

    use rollyourown::models::market_packed::{MarketImpl, MarketTrait};


    use super::ILobby;

   
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        PlayerJoined: PlayerJoined
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        player_id: ContractAddress,
        game_mode: GameMode,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerJoined {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        player_name: felt252
    }

    #[abi(embed_v0)]
    impl LobbyImpl of ILobby<ContractState> {
        fn create_game(
            self: @ContractState, game_mode: GameMode, player_name: felt252, avatar_id: u8,
        ) -> (u32, ContractAddress) {
            assert_valid_name(player_name);
            assert_valid_chain(game_mode);

            let game_id = self.world().uuid();
            let caller = get_caller_address();


            let game_settings = GameSettingsImpl::get(game_mode);
            let player_settings = PlayerSettingsImpl::get(game_mode);
            let shop_settings = ShopSettingsImpl::get(game_mode);

            let mut randomizer = RandomImpl::new(self.world());

            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            let leaderboard_version = leaderboard_manager.on_game_start();

            let player = Player {
                game_id,
                player_id: caller,
                name: player_name,
                avatar_id: avatar_id,
                status: PlayerStatus::Normal,
                location_id: Locations::Home,
                next_location_id: Locations::Home,
                cash: player_settings.cash,
                health: player_settings.health,
                drug_count: 0,
                turn: 0,
                wanted: player_settings.wanted,
                attack: player_settings.attack,
                defense: player_settings.defense,
                transport: player_settings.transport,
                speed: player_settings.speed,
                leaderboard_version,
                game_over: false,
            };

            let game = Game {
                game_id,
                game_mode,
                max_turns: game_settings.max_turns,
            };

            set!(self.world(), (game, player));

            // markets 
            let markets = MarketImpl::new(game_id, caller);
            set!(self.world(), (markets));

            // emit player joined
            emit!(self.world(), PlayerJoined { game_id, player_id: caller, player_name });

            // emit game created
            emit!(self.world(), GameCreated { game_id, player_id: caller, game_mode });

            (game_id, caller)
        }

        fn set_name(self: @ContractState, game_id: u32, player_id: ContractAddress, player_name: felt252) {
            assert_valid_name(player_name);

            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'CALLER_IS_NOT_OWNER'
            );

            let mut player = get!(self.world(), (game_id, player_id), Player);
            player.name = player_name;

            set!(self.world(), (player))
        }
    }

    fn assert_valid_chain(game_mode: GameMode) {
       // assert(game_mode == GameMode::Unlimited, 'invalid game_mode');

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
