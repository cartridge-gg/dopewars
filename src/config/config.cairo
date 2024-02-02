#[starknet::interface]
trait IConfig<T> {
    fn initialize(ref self: T);
    fn get_config(self: @T) -> Config;
// fn update_drug_config(ref self: T);
// fn update_drug_config_meta(ref self: T);
// ...
}

#[derive(Drop, Serde)]
struct Config {
    layouts: LayoutsConfig
}

#[derive(Drop, Serde)]
struct LayoutsConfig {
    game_store: Array<LayoutItem>,
    player: Array<LayoutItem>,
}


#[derive(Copy, Drop, Serde)]
struct LayoutItem {
    name: bytes31,
    idx: u8,
    bits: u8,
}


#[dojo::contract]
mod config {
    use rollyourown::config::{
        drugs::initialize_drug_config, locations::initialize_location_config,
        items::initialize_item_config, game::initialize_game_config,
    };

    use rollyourown::packing::{
        game_store_layout::{
            GameStoreLayout, GameStoreLayoutEnumerableImpl, GameStoreLayoutPackableImpl,
            GameStoreLayoutIntoBytes31Impl
        },
        player_layout::{
            PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl,
            PlayerLayoutIntoBytes31Impl
        }
    };

    use super::{Config, LayoutsConfig, LayoutItem};

    #[abi(embed_v0)]
    impl ConfigImpl of super::IConfig<ContractState> {
        fn initialize(ref self: ContractState) {
            // TODO checks

            // only world owner
            assert(self.world().is_owner(starknet::get_caller_address(), 0), 'only world owner');

            initialize_drug_config(self.world());
            initialize_location_config(self.world());
            initialize_item_config(self.world());

            initialize_game_config(self.world());
        }

        fn get_config(self: @ContractState) -> Config {
            let mut game_store: Array<LayoutItem> = array![];
            let mut game_store_layout_items = GameStoreLayoutEnumerableImpl::all();

            loop {
                match game_store_layout_items.pop_front() {
                    Option::Some(i) => {
                        game_store
                            .append(
                                LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx(), }
                            );
                    },
                    Option::None => { break; }
                };
            };

            //

            let mut player: Array<LayoutItem> = array![];
            let mut player_layout_items = PlayerLayoutEnumerableImpl::all();

            loop {
                match player_layout_items.pop_front() {
                    Option::Some(i) => {
                        player
                            .append(
                                LayoutItem { name: (*i).into(), bits: i.bits(), idx: i.idx(), }
                            );
                    },
                    Option::None => { break; }
                };
            };

            //
            Config { layouts: LayoutsConfig { game_store, player } }
        }
    }
}
