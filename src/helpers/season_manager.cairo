use dojo::event::EventStorage;
use dojo::world::{IWorldDispatcher, WorldStorage};

use rollyourown::{
    config::{
        ryo::{RyoConfig, RyoConfigTrait}, ryo_address::{RyoAddress},
        settings::{SeasonSettings, SeasonSettingsImpl, SeasonSettingsTrait},
    },
    constants::{ETHER, MAX_MULTIPLIER}, events::NewHighScore,
    interfaces::{
        chips::{IChips, IChipsDispatcher, IChipsDispatcherTrait},
        paper::{IPaperDispatcher, IPaperDispatcherTrait},
    },
    models::{season::{Season, SeasonImpl, SeasonTrait}}, packing::game_store::{GameStore},
    store::{Store, StoreImpl, StoreTrait},
    utils::{
        events::{RawEventEmitterImpl, RawEventEmitterTrait}, math::{MathImpl, MathTrait},
        random::{Random, RandomTrait},
    },
};
use starknet::{get_caller_address, get_contract_address};

#[derive(Drop, Copy)]
struct SeasonManager {
    store: Store,
}

trait SeasonManagerTrait {
    fn new(store: Store) -> SeasonManager;
    fn get_current_version(ref self: SeasonManager) -> u16;
    fn get_next_version_timestamp(ref self: SeasonManager) -> u64;
    fn new_season(ref self: SeasonManager, ref randomizer: Random, version: u16);
    fn on_game_start(ref self: SeasonManager, multiplier: u8);
    fn on_register_score(ref self: SeasonManager, ref game_store: GameStore) -> bool;
}

impl SeasonManagerImpl of SeasonManagerTrait {
    fn new(store: Store) -> SeasonManager {
        SeasonManager { store }
    }

    fn get_current_version(ref self: SeasonManager) -> u16 {
        let ryo_config = self.store.ryo_config();
        ryo_config.season_version
    }

    fn get_next_version_timestamp(ref self: SeasonManager) -> u64 {
        let current_timestamp = starknet::info::get_block_timestamp();
        let ryo_config = self.store.ryo_config();

        current_timestamp + ryo_config.season_duration.into()
    }

    fn new_season(ref self: SeasonManager, ref randomizer: Random, version: u16) {
        let mut store = self.store;
        let ryo_config = store.ryo_config();

        let season = ryo_config.build_season(version);
        let season_settings = SeasonSettingsImpl::random(ref randomizer, version);
        let game_config = season_settings.build_game_config();

        store.save_season(@season);
        store.save_season_settings(@season_settings);
        store.save_game_config(@game_config);
    }

    fn on_game_start(ref self: SeasonManager, multiplier: u8) {
        let mut store = self.store;
        let mut ryo_config = store.ryo_config();

        // get current season infos
        let mut season = store.season(ryo_config.season_version);

        // check if season is opened
        assert(season.is_open(), 'season has closed');
        // check if enought time for a game before season end
        assert(season.can_create_game(), 'not enought time for a game');

        // check multiplier
        assert(multiplier > 0 && multiplier <= MAX_MULTIPLIER, 'invalid multiplier');

        // get paper_fee
        let paper_fee: u32 = season.paper_fee.into() * multiplier.into();
        let paper_fee_eth: u256 = paper_fee.into() * ETHER;

        // calc treasury share
        let treasury_share = paper_fee.pct(season.treasury_fee_pct.into());
        let jackpot_share = paper_fee - treasury_share;

        // add jackpot_share to current_season & save
        season.paper_balance += jackpot_share;
        store.save_season(@season);

        // add treasury_share to treasury_balance & save
        ryo_config.treasury_balance += treasury_share;
        store.save_ryo_config(@ryo_config);

        // retrieve paper_address & laundromat_address
        let ryo_addresses = store.ryo_addresses();

        // transfer paper_fee_ether from user to laundromat ( user approved game contract to spend
        // paper before)
        IPaperDispatcher { contract_address: ryo_addresses.paper }
            .transfer_from(get_caller_address(), ryo_addresses.laundromat, paper_fee_eth);
    }

    fn on_register_score(ref self: SeasonManager, ref game_store: GameStore) -> bool {
        let mut store = self.store;
        // check if new high_score & update high_score & next_version_timestamp if necessary
        let current_version = self.get_current_version();
        let mut season = store.season(current_version);

        // new high score
        if game_store.player.cash > season.high_score {
            //set highscore
            season.high_score = game_store.player.cash;

            // reset current version timer
            season.next_version_timestamp = self.get_next_version_timestamp();

            // save season
            store.save_season(@season);

            // // emit NewHighScore
            store
                .world
                .emit_event(
                    @NewHighScore {
                        game_id: game_store.game.game_id,
                        player_id: game_store.game.player_id,
                        season_version: game_store.game.season_version,
                        player_name: game_store.game.player_name.into(),
                        token_id: game_store.game.token_id,
                        cash: game_store.player.cash,
                        health: game_store.player.health,
                        reputation: game_store.player.reputation,
                    },
                );

            true
        } else {
            false
        }
    }
}
