use dojo::model::{ModelStorage, ModelStorageTest, ModelValueStorage};
use dojo::world::{IWorldDispatcher, WorldStorage};

use rollyourown::{
    config::{
        drugs::{DrugConfig, Drugs}, encounters::{EncounterConfig, EncounterStatsConfig, Encounters},
        game::{GameConfig}, hustlers::{ItemSlot}, locations::{Locations}, ryo::{RyoConfig},
        ryo_address::{RyoAddress}, settings::{DrugsMode, EncountersMode, SeasonSettings},
    },
    models::{game::Game, game_store_packed::GameStorePacked, season::Season},
    packing::{game_store::{GameMode, GameStore, GameStorePackerImpl}}, traits::{Packable, Packer},
    utils::sorted_list::{SortedList, SortedListItem},
};
use starknet::ContractAddress;

const UNIVERSAL_ANSWER: u8 = 0; //42;

#[derive(Drop, Copy, Clone)]
pub struct Store {
    pub world: WorldStorage,
}

#[generate_trait]
impl StoreImpl of StoreTrait {
    fn new(world: WorldStorage) -> Store {
        Store { world }
    }

    fn ryo_config(self: @Store) -> RyoConfig {
        self.world.read_model(UNIVERSAL_ANSWER)
    }

    fn ryo_addresses(self: @Store) -> RyoAddress {
        self.world.read_model(UNIVERSAL_ANSWER)
    }

    //

    fn game_config(self: @Store, version: u16) -> GameConfig {
        self.world.read_model(version)
    }

    fn drug_config(self: @Store, drugs_mode: DrugsMode, drug: Drugs) -> DrugConfig {
        self.world.read_model((drugs_mode, drug))
    }

    fn encounter_stats_config(
        self: @Store, encounter: Encounters, encounters_mode: EncountersMode,
    ) -> EncounterStatsConfig {
        self.world.read_model((encounter, encounters_mode))
    }

    //

    fn season(self: @Store, version: u16) -> Season {
        self.world.read_model(version)
    }

    fn season_settings(self: @Store, version: u16) -> SeasonSettings {
        self.world.read_model(version)
    }

    fn game(self: @Store, game_id: u32, player_id: ContractAddress) -> Game {
        self.world.read_model((game_id, player_id))
    }

    fn game_store_packed(
        self: @Store, game_id: u32, player_id: ContractAddress,
    ) -> GameStorePacked {
        self.world.read_model((game_id, player_id))
    }


    fn sorted_list(self: @Store, list_id: felt252) -> SortedList {
        self.world.read_model(list_id)
    }

    fn sorted_list_item(
        self: @Store, list_id: felt252, item_k0: u32, item_k1: ContractAddress,
    ) -> SortedListItem {
        self.world.read_model((list_id, item_k0, item_k1))
    }

    // fn slot_machine(self: @Store, game_id: u32) -> SlotMachine {
    //     self.world.read_model(game_id)
    // }

    //
    // setter
    //

    fn save_ryo_config(ref self: Store, ryo_config: @RyoConfig) { // check UNIVERSAL_ANSWER ?
        self.world.write_model(ryo_config)
    }

    fn save_ryo_addresses(ref self: Store, ryo_addresses: @RyoAddress) { // check UNIVERSAL_ANSWER ?
        self.world.write_model(ryo_addresses)
    }

    fn save_game_config(ref self: Store, game_config: @GameConfig) { // check UNIVERSAL_ANSWER ?
        self.world.write_model(game_config)
    }

    //

    fn save_encounter_stats_config(ref self: Store, config: @EncounterStatsConfig) {
        self.world.write_model(config)
    }

    fn save_drug_config(ref self: Store, config: @DrugConfig) {
        self.world.write_model(config)
    }

    //

    fn save_season(ref self: Store, season: @Season) {
        self.world.write_model(season)
    }

    fn save_season_settings(ref self: Store, season_settings: @SeasonSettings) {
        self.world.write_model(season_settings)
    }

    fn set_game(ref self: Store, game: @Game) {
        self.world.write_model(game)
    }

    fn set_game_store_packed(ref self: Store, game_store_packed: @GameStorePacked) {
        self.world.write_model(game_store_packed)
    }

    fn set_sorted_list(ref self: Store, list: @SortedList) {
        self.world.write_model(list)
    }

    fn set_sorted_list_item(ref self: Store, item: @SortedListItem) {
        self.world.write_model(item)
    }
    //

    //
// fn set_slot_machine(ref self: Store, machine: @SlotMachine) {
//     self.world.write_model(machine)
// }

}

