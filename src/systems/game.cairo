use starknet::ContractAddress;
use rollyourown::{
    config::{locations::{Locations}, items::{ItemSlot}}, packing::game_store::{GameMode}
};
use rollyourown::systems::{trading::Trade, shopping::Action,};

#[starknet::interface]
trait IGame<T> {
    fn create_game(self: @T, game_mode: GameMode, avatar_id: u8);
    fn end_game(self: @T, game_id: u32);
    fn travel(self: @T, game_id: u32, next_location: Locations);
    fn trade(self: @T, game_id: u32, trades: Span<Trade>);
    fn shop(self: @T, game_id: u32, actions: Span<Action>);
}

#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address};

    use rollyourown::{
        config::{drugs::{Drugs}, locations::{Locations}, game::{GameConfig, GameConfigImpl}},
        models::{game_store_packed::GameStorePacked, game::{Game}},
        packing::{
            game_store::{GameStore, GameStoreImpl, GameStorePackerImpl, GameMode},
            player::{Player, PlayerImpl}
        },
        systems::{trading, shopping, game_loop}, utils::random::{Random, RandomImpl},
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        Traveled: Traveled,
        HighVolatility: HighVolatility,
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        player_id: ContractAddress,
        game_mode: GameMode,
    }

    #[derive(Drop, starknet::Event)]
    struct Traveled {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        turn: u8,
        from_location: Locations,
        to_location: Locations,
    }

    #[derive(Drop, starknet::Event)]
    struct HighVolatility {
        #[key]
        game_id: u32,
        location_id: Locations,
        drug_id: Drugs,
        increase: bool,
    }

    #[abi(embed_v0)]
    impl GameImpl of super::IGame<ContractState> {
        fn create_game(self: @ContractState, game_mode: GameMode, avatar_id: u8,) {
            let game_id = self.world().uuid();
            let player_id = get_caller_address();

            // TODO: use leaderboard
            // let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            // let leaderboard_version = leaderboard_manager.on_game_start();

            let game_config = GameConfigImpl::get(self.world());
            // let game = Game { game_id, game_mode, max_turns: game_config.max_turns, avatar_id };
            let game = Game {
                game_id, player_id, game_mode, max_turns: 7, avatar_id, game_over: false
            };

            // save Game
            set!(self.world(), (game));

            // create GameStorePacked
            let game_store = GameStoreImpl::new(
                self.world(), game_id, player_id, game_mode, avatar_id
            );
            let game_store_packed = game_store.pack();

            // save GameStorePacked
            set!(self.world(), (game_store_packed));

            // emit GameCreated
            emit!(self.world(), GameCreated { game_id, player_id, game_mode });
        }

        fn end_game(self: @ContractState, game_id: u32) {
            let player_id = get_caller_address();

            //on_game_end
            game_loop::on_game_end(self.world(), game_id, player_id);
        }

        fn travel(self: @ContractState, game_id: u32, next_location: Locations) {
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            assert(game_store.player.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            let mut randomizer = RandomImpl::new(self.world());

            // save next_location
            game_store.player.next_location = next_location;

            //on_turn_end
            game_loop::on_turn_end(self.world(), ref randomizer, ref game_store);
        }


        // TODO: move trade execution before travel wen possible
        fn trade(self: @ContractState, game_id: u32, trades: Span<trading::Trade>) {
            let mut trades = trades;
            let player_id = get_caller_address();
            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            trading::execute_trades(ref game_store, ref trades);

            let game_store_packed = game_store.pack();
            set!(self.world(), (game_store_packed));
        }

        // TODO: upgrade_item execution before travel wen possible
        fn shop(self: @ContractState, game_id: u32, actions: Span<shopping::Action>) {
            let mut actions = actions;
            let player_id = get_caller_address();
            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            shopping::execute_actions(ref game_store, ref actions);

            let game_store_packed = game_store.pack();
            set!(self.world(), (game_store_packed));
        }
    }
}
