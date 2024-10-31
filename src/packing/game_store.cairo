use core::traits::TryInto;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::{game_store_packed::{GameStorePacked}, game::{Game, GameMode, GameImpl}},
    config::{
        game::{GameConfig}, drugs::{Drugs, DrugsEnumerableImpl, DrugConfig},
        locations::{Locations, LocationsEnumerableImpl},
        settings::{SeasonSettings, SeasonSettingsTrait, DrugsMode}
    },
    packing::{
        game_store_layout::{
            GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl
        },
        drugs_packed::{DrugsPacked, DrugsPackedImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl},
        markets_packed::{MarketsPacked, MarketsPackedImpl},
        items_packed::{ItemsPacked, ItemsPackedImpl},
        player::{Player, PlayerStatus, PlayerImpl, PlayerPackerImpl, PlayerUnpackerImpl},
    },
    store::{Store, StoreImpl, StoreTrait},
    utils::{
        bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl}, math::{MathTrait, MathImplU8},
        random::{Random, RandomImpl,}
    },
    traits::{Packable, Packer}
};
use starknet::ContractAddress;


#[derive(Copy, Drop)]
struct GameStore {
    store: Store,
    game: Game,
    game_config: Option<GameConfig>,
    season_settings: Option<SeasonSettings>,
    //
    markets: MarketsPacked,
    items: ItemsPacked,
    drugs: DrugsPacked,
    wanted: WantedPacked,
    player: Player,
}

// init new game state
#[generate_trait]
impl GameStoreImpl of GameStoreTrait {
    fn new(
        store: Store, ref game: Game, ref game_config: GameConfig, ref randomizer: Random
    ) -> GameStore {
        GameStore {
            store,
            game,
            game_config: Option::Some(game_config),
            season_settings: Option::None,
            //
            markets: MarketsPackedImpl::new(randomizer.next().into()),
            items: ItemsPackedImpl::new(@store, game.hustler_id),
            drugs: DrugsPackedImpl::new(),
            wanted: WantedPackedImpl::new(randomizer.next().into()),
            player: PlayerImpl::new(ref game_config),
        }
    }

    fn empty(store: Store, ref game: Game) -> GameStore {
        GameStore {
            store,
            game,
            game_config: Option::None,
            season_settings: Option::None,
            //
            markets: MarketsPacked { packed: 0 },
            items: ItemsPackedImpl::new(@store, 0),
            drugs: DrugsPacked { packed: 0 },
            wanted: WantedPacked { packed: 0 },
            player: PlayerImpl::empty()
        }
    }

    //
    // Load / Save
    //

    fn load(ref store: Store, game_id: u32, player_id: ContractAddress) -> GameStore {
        let mut game = store.game(game_id, player_id);
        let game_store_packed = store.game_store_packed(game_id, player_id);
        game_store_packed.unpack(ref store, ref game)
    }

    fn save(self: GameStore) {
        let game_store_packed = self.pack();
        let mut store = self.store;
        store.set_game_store_packed(@game_store_packed);
    }


    //
    // Lazy load
    //

    fn game_config(ref self: GameStore) -> GameConfig {
        if let Option::Some(game_config) = self.game_config {
            game_config
        } else {
            let game_config = self.store.game_config(self.game.season_version);
            self.game_config = Option::Some(game_config);
            game_config
        }
    }

    fn season_settings(ref self: GameStore) -> SeasonSettings {
        if let Option::Some(season_settings) = self.season_settings {
            season_settings
        } else {
            let season_settings = self.store.season_settings(self.game.season_version);
            self.season_settings = Option::Some(season_settings);
            season_settings
        }
    }

    //
    // Markets
    //

    fn get_drug_price(ref self: GameStore, location: Locations, drug: Drugs) -> usize {
        let season_settings = self.season_settings();
        let drug_config = self.store.drug_config(season_settings.drugs_mode, drug);
        let tick = self.markets.get_tick(location, drug);

        tick * drug_config.step.into() + drug_config.base.into()
    }

    //
    // Player
    //

    fn can_continue(ref self: GameStore) -> bool {
        if self.player.health == 0 {
            return false;
        }

        if self.player.status != PlayerStatus::Normal {
            return false;
        }

        if self.player.turn == self.game_config().max_turns {
            return false;
        }

        if self.game.game_over {
            return false;
        }

        true
    }


    fn can_trade(self: GameStore) -> bool {
        if self.player.health == 0 {
            return false;
        }

        if self.player.status != PlayerStatus::Normal {
            return false;
        }

        if self.game.game_over {
            return false;
        }

        true
    }


    //
    //  Wanted
    //

    #[inline(always)]
    fn get_wanted_risk(ref self: GameStore, location: Locations) -> u8 {
        // 0	0%
        // 1	0%
        // 2	15%
        // 3	30%
        // 4	45%
        // 5	60%
        // 6	75%
        // 7	90%
        let modifier = self.season_settings().get_wanted_risk_modifier();

        let wanted = self.wanted.get(location);
        (wanted * 15).sub_capped(modifier, 0)
    }

    fn update_wanted(ref self: GameStore) {
        let mut locations = LocationsEnumerableImpl::all();
        let drugs = self.drugs.get();
        let season_settings = self.season_settings();
        let travel_back_mod = season_settings.get_wanted_travel_back_modifier();
        let leave_with_drugs_mod = season_settings.get_wanted_leave_with_drug_modifier();

        loop {
            match locations.pop_front() {
                Option::Some(location) => {
                    let mut value = self.wanted.get(*location);

                    if self.player.next_location == *location
                        && self.player.next_location == self.player.prev_location {
                        // travel back to same location : +3
                        self.wanted.set(*location, value.add_capped(travel_back_mod, 7));
                    } else if self.player.location == *location {
                        // leaving current location with drugs : +5
                        if drugs.quantity > 0 {
                            self.wanted.set(*location, value.add_capped(leave_with_drugs_mod, 7));
                        };
                    } else if *location != self.player.next_location {
                        //  not next / not prev / not current : -1
                        self.wanted.set(*location, value.sub_capped(1, 0));
                    }
                },
                Option::None => { break; }
            }
        }
    }
}


// pack
impl GameStorePackerImpl of Packer<GameStore, GameStorePacked> {
    fn pack(self: GameStore) -> GameStorePacked {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = GameStoreLayoutEnumerableImpl::all();

        while let Option::Some(item) = layout.pop_front() {
            match *item {
                GameStoreLayout::Markets => {
                    bits.replace::<felt252>(item.idx(), item.bits(), self.markets.packed);
                },
                GameStoreLayout::Items => {
                    bits.replace::<felt252>(item.idx(), item.bits(), self.items.packed);
                },
                GameStoreLayout::Drugs => {
                    bits.replace::<felt252>(item.idx(), item.bits(), self.drugs.packed);
                },
                GameStoreLayout::Wanted => {
                    bits.replace::<felt252>(item.idx(), item.bits(), self.wanted.packed);
                },
                GameStoreLayout::Player => {
                    let player_packed: felt252 = self.player.pack();
                    bits.replace::<felt252>(item.idx(), item.bits(), player_packed);
                },
            };
        };

        GameStorePacked {
            game_id: self.game.game_id, player_id: self.game.player_id, packed: bits.into_felt(),
        }
    }
}

// unpack
#[generate_trait]
impl GameStoreUnpackerImpl of GameStoreUnpackerTrait {
    fn unpack(self: GameStorePacked, ref store: Store, ref game: Game) -> GameStore {
        let mut game_store = GameStoreImpl::empty(store, ref game);
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self.packed);

        while let Option::Some(item) = layout.pop_front() {
            let packed = bits.extract_into::<felt252>(item.idx(), item.bits());

            match *item {
                GameStoreLayout::Markets => { game_store.markets = MarketsPacked { packed }; },
                GameStoreLayout::Items => {
                    game_store
                        .items = ItemsPacked { store: @store, hustler_id: game.hustler_id, packed };
                },
                GameStoreLayout::Drugs => { game_store.drugs = DrugsPacked { packed }; },
                GameStoreLayout::Wanted => { game_store.wanted = WantedPacked { packed }; },
                GameStoreLayout::Player => {
                    // unpack packed into Player
                    game_store.player = packed.unpack();
                },
            };
        };

        game_store
    }
}


#[cfg(test)]
mod tests {
    use rollyourown::models::game_store_packed::GameStorePacked;
    use super::{GameStorePackerImpl};
    // #[test]
// #[available_gas(100000000)]
// fn test_game_store_pack() {
//     let mut game_store = GameStoreDefaultImpl::default();
//     let game_store_packed: GameStorePacked = game_store.pack();
//     assert(game_store_packed.packed == 0, 'should be 0');
// }
}

