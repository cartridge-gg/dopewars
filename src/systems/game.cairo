use starknet::ContractAddress;
use rollyourown::{
    config::locations::{Locations},
    packing::game_store::{GameMode}
};

#[starknet::interface]
trait IGame<T> {
    fn create_game(self: @T, game_mode: GameMode, avatar_id: u8);
    fn travel(self: @T, game_id: u32, location: Locations);
}

#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address};

    use rollyourown::{
        config::locations::{Locations},
        models::game_store_packed::GameStorePacked,
        packing::game_store::{GameStore, GameStoreImpl, GameStorePackerImpl, GameMode}
    };

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        Traveled:Traveled,
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

    #[abi(embed_v0)]
    impl GameImpl of super::IGame<ContractState> {
        fn create_game(self: @ContractState, game_mode: GameMode, avatar_id: u8,) {
            let game_id = self.world().uuid();
            let player_id = get_caller_address();

            // TODO: use leaderboard
            // let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            // let leaderboard_version = leaderboard_manager.on_game_start();

            let game_store = GameStoreImpl::new(
                self.world(), game_id, player_id, game_mode, avatar_id
            );
            let game_store_packed = game_store.pack();

            // save GameStorePacked
            set!(self.world(), (game_store_packed));

            // emit GameCreated
            emit!(self.world(), GameCreated { game_id, player_id, game_mode });
        }

        fn travel(self: @ContractState, game_id: u32, location: Locations) {
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            game_store.player.prev_location = game_store.player.location;
            game_store.player.location = location;
            game_store.player.turn += 1;
            game_store.player.health -= 1;

            let game_store_packed = game_store.pack();

            // save GameStorePacked
            set!(self.world(), (game_store_packed));

            // emit Traveled
            emit!(self.world(), Traveled {
                game_id,
                player_id,
                turn: game_store.player.turn, 
                from_location:game_store.player.prev_location,
                to_location:game_store.player.location
            });
        }
    }
}
