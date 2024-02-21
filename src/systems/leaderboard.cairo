use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::{ryo::{RyoMeta, RyoMetaManager, RyoMetaManagerTrait}, leaderboard::{Leaderboard}},
    packing::game_store::{GameStore}
};

const ONE_HOUR: u64 = 3600; // 60 * 60
const ONE_DAY: u64 = 86_400; // 24 * 60 * 60
const ONE_WEEK: u64 = 604_800; // 7 * 86_400;

#[derive(Copy, Drop)]
struct LeaderboardManager {
    world: IWorldDispatcher,
}

trait LeaderboardManagerTrait {
    fn new(world: IWorldDispatcher) -> LeaderboardManager;
    fn get_current_version(self: LeaderboardManager) -> u16;
    fn get_next_version_timestamp() -> u64;
    fn new_leaderboard(self: LeaderboardManager, version: u16);
    fn on_game_start(self: LeaderboardManager) -> u16;
    fn on_game_over(self: LeaderboardManager, ref game_store: GameStore) -> bool;
}

impl LeaderboardManagerImpl of LeaderboardManagerTrait {
    fn new(world: IWorldDispatcher) -> LeaderboardManager {
        LeaderboardManager { world }
    }

    fn get_current_version(self: LeaderboardManager) -> u16 {
        let meta_manager = RyoMetaManagerTrait::new(self.world);
        let metas = meta_manager.get();
        metas.leaderboard_version
    }

    fn get_next_version_timestamp() -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();

        // TODO: revert
        //current_timestamp + ONE_WEEK
        current_timestamp + ONE_HOUR
    }

    fn new_leaderboard(self: LeaderboardManager, version: u16) {
        set!(
            self.world,
            Leaderboard {
                version,
                player_id: 0.try_into().unwrap(),
                high_score: 0,
                next_version_timestamp: LeaderboardManagerTrait::get_next_version_timestamp(),
            }
        );
    }

    fn on_game_start(self: LeaderboardManager) -> u16 {
        // check if current leaderboard should be historized and return leaderboard version

        let meta_manager = RyoMetaManagerTrait::new(self.world);
        let mut metas = meta_manager.get();

        let leaderboard = get!(self.world, (metas.leaderboard_version), Leaderboard);
        let current_timestamp = starknet::info::get_block_timestamp();

        if current_timestamp > leaderboard.next_version_timestamp {
            // create a new Leaderboard version with high_score = 0 & player_id = 0 & next_version_timestamp

            metas.leaderboard_version += 1;
            meta_manager.set(metas);

            self.new_leaderboard(metas.leaderboard_version);
        }
        metas.leaderboard_version
    }

    fn on_game_over(self: LeaderboardManager, ref game_store: GameStore) -> bool {
        // check if new high_score & update high_score & next_version_timestamp if necessary
        let current_version = self.get_current_version();
        let mut leaderboard = get!(self.world, (current_version), Leaderboard);

        // new high score
        if game_store.player.cash > leaderboard.high_score {
            //set highscore
            leaderboard.high_score = game_store.player.cash;

            //set player_id
            leaderboard.player_id = game_store.game.player_id;

            //reset current version timer
            leaderboard
                .next_version_timestamp = LeaderboardManagerTrait::get_next_version_timestamp();

            // save leaderboard
            set!(self.world, (leaderboard));
            // trigger NewHighScore event ?
            true
        } else {
            false
        }
    }
}
