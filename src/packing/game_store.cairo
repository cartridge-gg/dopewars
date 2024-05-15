use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::{game_store_packed::{GameStorePacked}, game::{Game, GameMode, GameImpl}},
    config::{game::{GameConfig}},
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
    library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl}, traits::{Packable, Packer, Unpacker}
};


#[derive(Copy, Drop, Serde)]
struct GameStore {
    s: IStoreLibraryDispatcher,
    game: Game,
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
    fn new(s: IStoreLibraryDispatcher, game: Game, ref game_config: GameConfig) -> GameStore {
        GameStore {
            s,
            game,
            //
            markets: MarketsPackedImpl::new(game.game_id),
            items: ItemsPackedImpl::new(s, game.hustler_id),
            drugs: DrugsPackedImpl::new(),
            wanted: WantedPackedImpl::new(game.game_id + 1),
            player: PlayerImpl::new(ref game_config),
        }
    }

    fn empty(s: IStoreLibraryDispatcher, game: Game) -> GameStore { 
        GameStore {
            s,
            game,
            //
            markets: MarketsPacked { packed: 0 },
            items: ItemsPackedImpl::new(s, 0),
            drugs: DrugsPacked { packed: 0 },
            wanted: WantedPacked { packed: 0 },
            player: PlayerImpl::empty()
        }
    }

    //
    //
    //

    fn can_continue(self: GameStore) -> bool {
        if self.player.health == 0 {
            return false;
        }

        if self.player.status != PlayerStatus::Normal {
            return false;
        }

        if self.player.turn == self.game.max_turns {
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
}


// pack 
impl GameStorePackerImpl of Packer<GameStore, GameStorePacked> {
    fn pack(self: GameStore) -> GameStorePacked {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = GameStoreLayoutEnumerableImpl::all();

        while let Option::Some(item) = layout
            .pop_front() {
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
impl GameStoreUnpackerImpl of Unpacker<GameStorePacked, GameStore> {
    fn unpack(self: GameStorePacked, s: IStoreLibraryDispatcher, game: Game,) -> GameStore {
        let mut game_store = GameStoreImpl::empty(s, game);
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self.packed);

        while let Option::Some(item) = layout
            .pop_front() {
                let packed = bits.extract_into::<felt252>(item.idx(), item.bits());

                match *item {
                    GameStoreLayout::Markets => { game_store.markets = MarketsPacked { packed }; },
                    GameStoreLayout::Items => {
                        game_store
                            .items = ItemsPacked { s, hustler_id: game.hustler_id, packed };
                    },
                    GameStoreLayout::Drugs => { game_store.drugs = DrugsPacked { packed }; },
                    GameStoreLayout::Wanted => { game_store.wanted = WantedPacked { packed }; },
                    GameStoreLayout::Player => {
                        // unpack packed into Player
                        game_store.player = packed.unpack(s, game);
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

