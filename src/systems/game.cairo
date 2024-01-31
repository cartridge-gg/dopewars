use starknet::ContractAddress;
use rollyourown::packing::game_store::{GameMode};

#[starknet::interface]
trait IGame<TContractState> {
    fn create_game(self: @TContractState, game_mode: GameMode, avatar_id: u8);
}


#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address};

    use rollyourown::models::game_store_packed::GameStorePacked;
    use rollyourown::packing::game_store::{GameStore, GameStoreImpl, GameStorePackerImpl, GameMode};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        player_id: ContractAddress,
        game_mode: GameMode,
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

            // emit game created
            emit!(self.world(), GameCreated { game_id, player_id, game_mode });
        }
    }
}
