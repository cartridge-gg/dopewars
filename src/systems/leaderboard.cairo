use starknet::{get_caller_address, get_contract_address};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    config::{
        ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait}, 
        ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait}
    },
    models::{leaderboard::{Leaderboard}}, packing::game_store::{GameStore},
    interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
    utils::math::{MathImpl, MathTrait}
};



#[derive(Copy, Drop)]
struct LeaderboardManager {
    world: IWorldDispatcher,
}

trait LeaderboardManagerTrait {
    fn new(world: IWorldDispatcher) -> LeaderboardManager;
    fn get_current_version(self: LeaderboardManager) -> u16;
    fn get_next_version_timestamp(self: LeaderboardManager) -> u64;
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

    fn get_next_version_timestamp(self: LeaderboardManager) -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();

        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let ryo_config = ryo_config_manager.get();

        current_timestamp + ryo_config.leaderboard_duration.into()
    }

    fn new_leaderboard(self: LeaderboardManager, version: u16) {
        set!(
            self.world,
            Leaderboard {
                version,
                player_id: 0.try_into().unwrap(),
                game_id: 0,
                high_score: 0,
                next_version_timestamp: self.get_next_version_timestamp(),
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

        // get paper_fee
        let paper_fee : u32 = ryo_config.paper_fee.into();
        let paper_fee_eth: u256 = paper_fee.into() * ETHER;

        // calc treasury share
        let treasury_share = paper_fee.pct(ryo_config.treasury_fee_pct.into());
        let jackpot_share = paper_fee - treasury_share;

        // add jackpot_share to current_leaderboard & save
        leaderboard.paper_balance += jackpot_share;
        set!(self.world, (leaderboard));

        // add treasury_share to treasury_balance & save
        ryo_config.treasury_balance += treasury_share;
        ryo_config_manager.set(ryo_config);

        // retrieve paper_address
        let paper_address = RyoAddressManagerTrait::new(self.world).paper();
        
        // transfer paper_fee_ether from user to game ( user approved game contract to spend paper before)
        IPaperDispatcher { contract_address: paper_address }
            .transfer_from(get_caller_address(), get_contract_address(), paper_fee_eth);

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

            // set game_id & player_id
            leaderboard.game_id = game_store.game.game_id;
            leaderboard.player_id = game_store.game.player_id;

            //reset current version timer
            leaderboard
                .next_version_timestamp = self.get_next_version_timestamp();

            // save leaderboard
            set!(self.world, (leaderboard));
            // trigger NewHighScore event ?
            true
        } else {
            false
        }
    }
}
