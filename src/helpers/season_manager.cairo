use starknet::{get_caller_address, get_contract_address};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    config::{
        ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait}, 
        ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait}
    },
    models::{season::{Season}}, packing::game_store::{GameStore},
    interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
    utils::math::{MathImpl, MathTrait}
};



#[derive(Copy, Drop)]
struct SeasonManager {
    world: IWorldDispatcher,
}

trait SeasonManagerTrait {
    fn new(world: IWorldDispatcher) -> SeasonManager;
    fn get_current_version(self: SeasonManager) -> u16;
    fn get_next_version_timestamp(self: SeasonManager) -> u64;
    fn new_season(self: SeasonManager, version: u16);
    fn on_game_start(self: SeasonManager) -> u16;
    fn on_game_over(self: SeasonManager, ref game_store: GameStore);
}

impl SeasonManagerImpl of SeasonManagerTrait {
    fn new(world: IWorldDispatcher) -> SeasonManager {
        SeasonManager { world }
    }

    fn get_current_version(self: SeasonManager) -> u16 {
        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let ryo_config = ryo_config_manager.get();
        ryo_config.season_version
    }

    fn get_next_version_timestamp(self: SeasonManager) -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();

        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let ryo_config = ryo_config_manager.get();

        current_timestamp + ryo_config.season_duration.into()
    }

    fn new_season(self: SeasonManager, version: u16) {

        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let ryo_config = ryo_config_manager.get();

        let next_version_timestamp = starknet::info::get_block_timestamp() + ryo_config.season_duration.into();

        set!(
            self.world,
            Season {
                version,
                //
                // season config copied from RyoConfig
                season_duration: ryo_config.season_duration,
                paper_fee: ryo_config.paper_fee,
                treasury_fee_pct: ryo_config.treasury_fee_pct,
                // season datas
                next_version_timestamp,
                paper_balance: 0,
            }
        );
    }

    fn on_game_start(self: SeasonManager) -> u16 {
        // check if current season should be historized and return season version
        let ryo_config_manager = RyoConfigManagerTrait::new(self.world);
        let mut ryo_config = ryo_config_manager.get();

        // get current season infos
        let season = get!(self.world, (ryo_config.season_version), Season);
        let current_timestamp = starknet::info::get_block_timestamp();


        // TODO: move
        if current_timestamp > season.next_version_timestamp {
            // create a new Season version with high_score = 0 & player_id = 0 & next_version_timestamp
            ryo_config.season_version += 1;
            ryo_config_manager.set(ryo_config);

            self.new_season(ryo_config.season_version);
        }

        // get current season infos
        let mut season = get!(self.world, (ryo_config.season_version), Season);

        // get paper_fee
        let paper_fee : u32 = ryo_config.paper_fee.into();
        let paper_fee_eth: u256 = paper_fee.into() * ETHER;

        // calc treasury share
        let treasury_share = paper_fee.pct(ryo_config.treasury_fee_pct.into());
        let jackpot_share = paper_fee - treasury_share;

        // add jackpot_share to current_season & save
        season.paper_balance += jackpot_share;
        set!(self.world, (season));

        // add treasury_share to treasury_balance & save
        ryo_config.treasury_balance += treasury_share;
        ryo_config_manager.set(ryo_config);

        // retrieve paper_address
        let paper_address = RyoAddressManagerTrait::new(self.world).paper();
        
        // transfer paper_fee_ether from user to game ( user approved game contract to spend paper before)
        IPaperDispatcher { contract_address: paper_address }
            .transfer_from(get_caller_address(), get_contract_address(), paper_fee_eth);

        ryo_config.season_version
    }

    fn on_game_over(self: SeasonManager, ref game_store: GameStore) {
        // check if new high_score & update high_score & next_version_timestamp if necessary
        let current_version = self.get_current_version();
        let mut season = get!(self.world, (current_version), Season);

        // // new high score
        // if game_store.player.cash > season.high_score {
        //     //set highscore
        //     season.high_score = game_store.player.cash;

        //     // set game_id & player_id
        //     season.game_id = game_store.game.game_id;
        //     season.player_id = game_store.game.player_id;

        //     //reset current version timer
        //     season
        //         .next_version_timestamp = self.get_next_version_timestamp();

        //     // save season
        //     set!(self.world, (season));
        //     // trigger NewHighScore event ?
        //     true
        // } else {
        //     false
        // }
    }
}
