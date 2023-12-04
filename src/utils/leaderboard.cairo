use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::models::ryo::{RyoMeta, RyoMetaManager, RyoMetaManagerTrait};
use rollyourown::models::leaderboard::{Leaderboard};

const ONE_HOUR: u64 = 3600; // 60 * 60
const ONE_DAY: u64 = 86_400; // 24 * 60 * 60
const ONE_WEEK: u64 = 604_800; // 7 * 86_400;

#[derive(Copy, Drop)]
struct LeaderboardManager {
    world: IWorldDispatcher,
}

trait LeaderboardManagerTrait {
    fn new(world: IWorldDispatcher) -> LeaderboardManager;
    fn get_current_version(self: LeaderboardManager) -> u32;
    fn get_next_version_timestamp() -> u64;
    fn on_game_start(self: LeaderboardManager) -> u32;
    fn on_game_end(self: LeaderboardManager, score: u128) -> bool;
}

impl LeaderboardManagerImpl of LeaderboardManagerTrait {
    fn new(world: IWorldDispatcher) -> LeaderboardManager {
        LeaderboardManager { world }
    }

    fn get_current_version(self: LeaderboardManager) -> u32 {
        let meta_manager = RyoMetaManagerTrait::new(self.world);
        let metas = meta_manager.get();
        metas.leaderboard_version
    }

    fn get_next_version_timestamp() -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();
        current_timestamp + (6 * ONE_HOUR)
    }

    fn on_game_start(self: LeaderboardManager) -> u32 {
        // check if current leaderboard should be historized and return leaderboard version

        let meta_manager = RyoMetaManagerTrait::new(self.world);
        let mut metas = meta_manager.get();

        let leaderboard = get!(self.world, (metas.leaderboard_version), Leaderboard);
        let current_timestamp = starknet::info::get_block_timestamp();

        if current_timestamp > leaderboard.next_version_timestamp {
            // create a new Leaderboard version with high_score = 0 & timestamp = now

            metas.leaderboard_version += 1;
            meta_manager.set(metas);

            set!(
                self.world,
                Leaderboard {
                    version: metas.leaderboard_version,
                    high_score: 0,
                    next_version_timestamp: LeaderboardManagerTrait::get_next_version_timestamp(),
                }
            );
        }

        metas.leaderboard_version
    }

    fn on_game_end(
        self: LeaderboardManager, score: u128
    ) -> bool { // check if new high_score & update high_score & next_version_timestamp if necessary
        let current_version = self.get_current_version();
        let mut leaderboard = get!(self.world, (current_version), Leaderboard);

        if score > leaderboard.high_score {
            leaderboard.high_score = score;
            leaderboard.next_version_timestamp = LeaderboardManagerTrait::get_next_version_timestamp();
            set!(self.world, (leaderboard));
            // trigger NewHighScore event ?
            true
        } else {
            false
        }
    }
}
