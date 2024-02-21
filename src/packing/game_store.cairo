use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::{
        game_store_packed::{GameStorePacked}, game::{Game, GameMode, GameImpl}
    },
    packing::{
        game_store_layout::{
            GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl
        },
        drugs_packed::{DrugsPacked, DrugsPackedImpl},
        wanted_packed::{WantedPacked, WantedPackedImpl},
        markets_packed::{MarketsPacked, MarketsPackedImpl},
        items_packed::{ItemsPacked, ItemsPackedImpl},
        encounters_packed::{EncountersPacked, EncountersPackedImpl},
        player::{Player, PlayerImpl, PlayerPackerImpl, PlayerUnpackerImpl},
    },
    utils::bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl}, traits::{Packable, Packer, Unpacker}
};


#[derive(Copy, Drop)]
struct GameStore {
    world: IWorldDispatcher,
    game: Game,
    //
    markets: MarketsPacked,
    items: ItemsPacked,
    drugs: DrugsPacked,
    wanted: WantedPacked,
    encounters: EncountersPacked,
    player: Player,
}

// init new game state
#[generate_trait]
impl GameStoreImpl of GameStoreTrait {
    fn new(world: IWorldDispatcher, game: Game) -> GameStore {
        GameStore {
            world,
            game,
            //
            markets: MarketsPackedImpl::new(world, game),
            items: ItemsPackedImpl::new(world, game),
            drugs: DrugsPackedImpl::new(world, game),
            wanted: WantedPackedImpl::new(world, game),
            encounters: EncountersPackedImpl::new(world, game),
            player: PlayerImpl::new(world, game),
        }
    }

    fn get(world: IWorldDispatcher, game: Game) -> GameStore {
        let game_store_packed = get!(world, (game.game_id, game.player_id), GameStorePacked);
        game_store_packed.unpack(world, game)
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
                        GameStoreLayout::Encounters => {
                            bits
                                .replace::<
                                    felt252
                                >(item.idx(), item.bits(), self.encounters.packed);
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
            game_id: self.game.game_id, player_id: self.game.player_id, packed: bits.into_felt(),
        }
    }
}

// unpack 
impl GameStoreUnpackerImpl of Unpacker<GameStorePacked, GameStore> {
    fn unpack(self: GameStorePacked, world: IWorldDispatcher, game: Game,) -> GameStore {
        let mut game_store = GameStoreImpl::get(world, game);
        let mut layout = GameStoreLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self.packed);

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    let packed = bits.extract_into::<felt252>(item.idx(), item.bits());

                    match *item {
                        GameStoreLayout::Markets => {
                            game_store.markets = MarketsPacked { world, game, packed };
                        },
                        GameStoreLayout::Items => {
                            game_store.items = ItemsPacked { world, game, packed };
                        },
                        GameStoreLayout::Drugs => {
                            game_store.drugs = DrugsPacked { world, game, packed };
                        },
                        GameStoreLayout::Wanted => {
                            game_store.wanted = WantedPacked { world, game, packed };
                        },
                        GameStoreLayout::Encounters => {
                            game_store.encounters = EncountersPacked { world, game, packed };
                        },
                        GameStoreLayout::Player => {
                            // unpack packed into Player
                            game_store.player = packed.unpack(world, game);
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
    use super::{GameStorePackerImpl};
// #[test]
// #[available_gas(100000000)]
// fn test_game_store_pack() {
//     let mut game_store = GameStoreDefaultImpl::default();
//     let game_store_packed: GameStorePacked = game_store.pack();
//     assert(game_store_packed.packed == 0, 'should be 0');
// }
}

