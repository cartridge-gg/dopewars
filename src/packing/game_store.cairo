use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::{game_store_packed::{GameStorePacked}, game::{GameMode}};
use rollyourown::packing::{
    game_store_layout::{
        GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl
    },
    drugs_packed::{DrugsPacked, DrugsPackedImpl, DrugsPackedDefaultImpl},
    wanted_packed::{WantedPacked, WantedPackedImpl, WantedPackedDefaultImpl},
    markets_packed::{MarketsPacked, MarketsPackedImpl, MarketsPackedDefaultImpl},
    items_packed::{ItemsPacked, ItemsPackedImpl, ItemsPackedDefaultImpl},
    player::{Player, PlayerImpl, PlayerDefaultImpl, PlayerPackerImpl, PlayerUnpackerImpl},
};

use rollyourown::utils::bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl};
use rollyourown::traits::{Packable, Packer, Unpacker};


#[derive(Copy, Drop)]
struct GameStore {
    world: IWorldDispatcher,
    game_id: u32,
    player_id: ContractAddress,
    //
    markets: MarketsPacked,
    items: ItemsPacked,
    drugs: DrugsPacked,
    wanted: WantedPacked,
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
            drugs: DrugsPackedDefaultImpl::default(),
            wanted: WantedPackedDefaultImpl::default(),
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
            drugs: DrugsPackedImpl::new(world, game_id, player_id),
            wanted: WantedPackedImpl::new(world, game_id, player_id),
            player: PlayerImpl::new(world, game_id, player_id),
        }
    }

    fn from(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> GameStore {
        GameStore {
            world,
            game_id,
            player_id,
            markets: MarketsPackedImpl::new(world, game_id, player_id),
            items: ItemsPackedImpl::new(world, game_id, player_id),
            drugs: DrugsPackedImpl::new(world, game_id, player_id),
            wanted: WantedPackedImpl::new(world, game_id, player_id),
            player: PlayerImpl::new(world, game_id, player_id),
        }
    }

    fn get(world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,) -> GameStore {
        let game_store_packed = get!(world, (game_id, player_id), GameStorePacked);
        game_store_packed.unpack(world, game_id, player_id)
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
    fn unpack(
        self: GameStorePacked, world: IWorldDispatcher, game_id: u32, player_id: ContractAddress,
    ) -> GameStore {
        let mut game_store = GameStoreImpl::from(world, game_id, player_id);
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self.packed);

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    let packed = bits.extract_into::<felt252>(item.idx(), item.bits());

                    match *item {
                        GameStoreLayout::Markets => {
                            game_store
                                .markets = MarketsPacked { world, game_id, player_id, packed };
                        },
                        GameStoreLayout::Items => {
                            game_store.items = ItemsPacked { world, game_id, player_id, packed };
                        },
                        GameStoreLayout::Drugs => {
                            game_store.drugs = DrugsPacked { world, game_id, player_id, packed };
                        },
                        GameStoreLayout::Wanted => {
                            game_store.wanted = WantedPacked { world, game_id, player_id, packed };
                        },
                        GameStoreLayout::Player => {
                            // unpack packed into Player
                            game_store.player = packed.unpack(world, game_id, player_id);
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        game_store
    }
}


#[cfg(test)]
mod tests {
    use rollyourown::models::game_store_packed::GameStorePacked;
    use super::{GameStoreDefaultImpl, GameStorePackerImpl};

    #[test]
    #[available_gas(100000000)]
    fn test_game_store_pack() {
        let mut game_store = GameStoreDefaultImpl::default();
        let game_store_packed: GameStorePacked = game_store.pack();
        assert(game_store_packed.packed == 0, 'should be 0');
    }
}

