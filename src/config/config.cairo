use rollyourown::config::hustlers::{HustlerConfig, HustlerImpl};


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
    layouts: LayoutsConfig,
    hustlers: Array<HustlerConfig>,
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
        game::initialize_game_config,
        hustlers::{
            HustlerConfig, HustlerImpl, initialize_weapons_config, initialize_clothes_config,
            initialize_feet_config, initialize_transport_config, initialize_weapons_tiers_config,
            initialize_clothes_tiers_config, initialize_feet_tiers_config,
            initialize_transport_tiers_config,
        }
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
            let world = self.world();
            // TODO checks

            // only world owner
            assert(world.is_owner(starknet::get_caller_address(), 0), 'only world owner');

            // common
            initialize_drug_config(world);
            initialize_location_config(world);
            //initialize_item_config(world);

            // hustlers items
            initialize_weapons_config(world);
            initialize_clothes_config(world);
            initialize_feet_config(world);
            initialize_transport_config(world);

            // hutlsers items tiers
            initialize_weapons_tiers_config(world);
            initialize_clothes_tiers_config(world);
            initialize_feet_tiers_config(world);
            initialize_transport_tiers_config(world);

            // game
            initialize_game_config(world);
        }

        fn get_config(self: @ContractState) -> Config {
            let world = self.world();

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

            let mut hustlers: Array<HustlerConfig> = array![];
            let mut hustler_ids = array![0_u16, 1_u16, 2_u16].span();

            loop {
                match hustler_ids.pop_front() {
                    Option::Some(id) => {
                        let hustler = HustlerImpl::get(world, *id);
                        hustlers.append(hustler.get_hustler_config());
                    },
                    Option::None => { break; }
                };
            };

            //
            Config { layouts: LayoutsConfig { game_store, player }, hustlers }
        }
    }
}
