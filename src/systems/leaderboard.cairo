use starknet::{get_caller_address,get_contract_address};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    config::{ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait}},
    models::{leaderboard::{Leaderboard}},
    packing::game_store::{GameStore},
    interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait},
    constants::{ETHER}
};

const TWENTY_MIN: u64 = 1200; // 20 * 60
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
        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let ryo_config = ryo_config_manager.get();
        ryo_config.leaderboard_version
    }

    fn get_next_version_timestamp() -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();

        // TODO: revert
        //current_timestamp + ONE_WEEK
        current_timestamp + TWENTY_MIN
    }

    fn new_leaderboard(self: LeaderboardManager, version: u16) {
        set!(
            self.world,
            Leaderboard {
                version,
                player_id: 0.try_into().unwrap(),
                high_score: 0,
                next_version_timestamp: LeaderboardManagerTrait::get_next_version_timestamp(),
                paper_balance: 0,
                claimed: false,
            }
        );
    }

    fn on_game_start(self: LeaderboardManager) -> u16 {
        // check if current leaderboard should be historized and return leaderboard version
        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let mut ryo_config = ryo_config_manager.get();

        // get current leaderboard infos
        let leaderboard = get!(self.world, (ryo_config.leaderboard_version), Leaderboard);
        let current_timestamp = starknet::info::get_block_timestamp();

        if current_timestamp > leaderboard.next_version_timestamp {
            // create a new Leaderboard version with high_score = 0 & player_id = 0 & next_version_timestamp

            ryo_config.leaderboard_version += 1;
            ryo_config_manager.set(ryo_config);

            self.new_leaderboard(ryo_config.leaderboard_version);
        }

        // get current leaderboard infos
        let mut leaderboard = get!(self.world, (ryo_config.leaderboard_version), Leaderboard);

        // calc paper_fee
        let paper_fee:u256 = ryo_config.paper_fee.into() * ETHER;

        // add paper_fee to current_leaderboard & save
        leaderboard.paper_balance += paper_fee;
        set!(self.world, (leaderboard));

        // transfer paper_fee from user to game ( user approve ryo to spend paper before)
        IPaperDispatcher {
            contract_address: ryo_config.paper_address
        }.transfer_from(get_caller_address(), get_contract_address(), paper_fee);

        ryo_config.leaderboard_version
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
