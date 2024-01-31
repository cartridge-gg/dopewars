use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::game_store_packed::{GameStorePacked};
use rollyourown::packing::{
    game_store_layout::{
        GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl
    },
    markets_packed::{MarketsPacked, MarketsPackedImpl, MarketsPackedDefaultImpl},
    items_packed::{ItemsPacked, ItemsPackedImpl, ItemsPackedDefaultImpl},
    player::{Player, PlayerImpl, PlayerDefaultImpl},
};

use rollyourown::utils::bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl};
use rollyourown::traits::{Packable, Packer, Unpacker};


#[derive(Copy, Drop, Serde, PartialEq)]
enum GameMode {
    Test,
    Unlimited
}


#[derive(Copy, Drop)]
struct GameStore {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    markets: MarketsPacked,
    items: ItemsPacked,
    player: Player,
}

// all to zero
impl GameStoreDefaultImpl of Default<GameStore> {
    fn default() -> GameStore {
        GameStore {
            world: IWorldDispatcher { contract_address: 0.try_into().unwrap() },
            game_id: 0,
            player_id: 0.try_into().unwrap(),
            //
            markets: MarketsPackedDefaultImpl::default(),
            items: ItemsPackedDefaultImpl::default(),
            player: PlayerDefaultImpl::default(),
        }
    }
}

// init new game state
#[generate_trait]
impl GameStoreImpl of GameStoreTrait {
    fn new(
        world: IWorldDispatcher,
        game_id: u32,
        player_id: ContractAddress,
        game_mode: GameMode,
        avatar_id: u8,
    ) -> GameStore {
        GameStore {
            world,
            game_id,
            player_id,
            markets: MarketsPackedImpl::new(world, game_id, player_id),
            items: ItemsPackedImpl::new(world, game_id, player_id),
            player: PlayerImpl::new(world, game_id, player_id),
        }
    }
}


// pack 
impl GameStorePackerImpl of Packer<GameStore, GameStorePacked> {
    fn pack(self: GameStore) -> GameStorePacked {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = GameStoreLayoutEnumerableImpl::all();

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    match *item {
                        GameStoreLayout::Markets => {
                            bits.replace::<felt252>(item.idx(), item.bits(), self.markets.packed);
                        },
                        GameStoreLayout::Items => {
                            bits.replace::<felt252>(item.idx(), item.bits(), self.items.packed);
                        },
                        // GameStoreLayout::Drugs => {},
                        // GameStoreLayout::Wanted => {},
                        GameStoreLayout::Player => {
                            let player_packed = 0; //  self.player

                            bits.replace::<felt252>(item.idx(), item.bits(), player_packed);
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        GameStorePacked {
            game_id: self.game_id, player_id: self.player_id, packed: bits.into_felt(),
        }
    }
}

// unpack 
impl GameStoreUnpackerImpl of Unpacker<GameStorePacked, GameStore> {
    fn unpack(self: GameStorePacked, world: IWorldDispatcher) -> GameStore {
        let mut game_store = GameStoreDefaultImpl::default();
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let bits = BitsImpl::from(self.packed);

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    let packed = bits.extract_into::<felt252>(item.idx(), item.bits());

                    match *item {
                        GameStoreLayout::Markets => {
                            game_store
                                .markets =
                                    MarketsPacked {
                                        world,
                                        game_id: self.game_id,
                                        player_id: self.player_id,
                                        packed
                                    };
                        },
                        GameStoreLayout::Items => {
                            game_store
                                .items =
                                    ItemsPacked {
                                        world,
                                        game_id: self.game_id,
                                        player_id: self.player_id,
                                        packed
                                    };
                        },
                        // GameStoreLayout::Drugs => {},
                        // GameStoreLayout::Wanted => {},
                        GameStoreLayout::Player => {},
                    };
                },
                Option::None => { break; },
            };
        };

        game_store
    }
}

