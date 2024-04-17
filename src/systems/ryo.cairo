use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::player::{Player, PlayerStatus};
use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::models::game::{Game, GameTrait};

#[starknet::interface]
trait IRyo<TContractState> {
    fn initialize(self: @TContractState);
}

#[dojo::contract]
mod ryo {
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;

    use rollyourown::models::ryo::{RyoMeta, RyoMetaManager, RyoMetaManagerTrait};
    use rollyourown::models::leaderboard::{Leaderboard};

    use rollyourown::utils::random::{RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};


    use super::IRyo;

    #[external(v0)]
    impl RyoExternalImpl of IRyo<ContractState> {
        fn initialize(self: @ContractState) {
            //todo check caller is world owner
            let meta_manager = RyoMetaManagerTrait::new(self.world());
            let mut metas = meta_manager.get();

            assert(metas.initialized == false, 'Already initialized');

            // RyoMeta
            metas.initialized = true;
            metas.leaderboard_version = 1;
            meta_manager.set(metas);

            // Leaderboard
            set!(
                self.world(),
                Leaderboard {
                    version: metas.leaderboard_version,
                    high_score: 0,
                    next_version_timestamp: LeaderboardManagerTrait::get_next_version_timestamp(),
                }
            );
        }
    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {}
}


#[derive(Drop, starknet::Event)]
struct GameOver {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    player_name: felt252,
    player_status: PlayerStatus,
    turn: u32,
    cash: u128,
}


fn game_over(world: IWorldDispatcher, ref player: Player) {
    player.game_over = true;

    let leaderboard_manager = LeaderboardManagerTrait::new(world);
    // reset leaderboard timer if new highscore
    leaderboard_manager.on_game_end(player.cash);

    // in case player starts game in version v & end game in version v+1
    player.leaderboard_version = leaderboard_manager.get_current_version();

    let game = get!(world, player.game_id, Game);
    world
        .emit_raw(
            array![selector!("GameOver"), player.game_id.into(), player.player_id.into()],
            array![
                player.name.into(),
                player.status.into(),
                player.turn.into(),
                (player.cash / game.scaling_factor).into(),
            ]
        );
}
