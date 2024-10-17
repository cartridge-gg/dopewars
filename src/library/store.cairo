use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use rollyourown::{
    config::{
        locations::{Locations}, ryo::{RyoConfig},
        hustlers::{ItemSlot, HustlerItemBaseConfig, HustlerItemTiersConfig},
        drugs::{Drugs, DrugConfig}, encounters::{Encounters, EncounterConfig, EncounterStatsConfig},
        game::{GameConfig}, ryo_address::{RyoAddress},
        settings::{SeasonSettings, EncountersMode, DrugsMode}
    },
    models::{game::Game, season::Season, game_store_packed::GameStorePacked,},
    packing::{game_store::{GameStore, GameStorePackerImpl, GameMode}}, traits::{Packable, Packer},
    systems::slot::SlotMachine
};


#[starknet::interface]
trait IStore<T> {
    fn w(self: @T) -> IWorldDispatcher;
    //
    fn ryo_config(self: @T,) -> RyoConfig;
    fn ryo_addresses(self: @T,) -> RyoAddress;
    fn game_config(self: @T, version: u16) -> GameConfig;
    //
    fn drug_config(self: @T, drugs_mode: DrugsMode, drug: Drugs) -> DrugConfig;
    fn encounter_stats_config(
        self: @T, encounter: Encounters, encounters_mode: EncountersMode
    ) -> EncounterStatsConfig;
    fn item_base_config(self: @T, slot: ItemSlot, item_id: u16) -> HustlerItemBaseConfig;
    fn item_tiers_config(self: @T, slot: ItemSlot, tiers: u8) -> HustlerItemTiersConfig;
    //
    fn season(self: @T, version: u16) -> Season;
    fn season_settings(self: @T, version: u16) -> SeasonSettings;
    fn game(self: @T, game_id: u32, player_id: ContractAddress) -> Game;
    fn game_store_packed(self: @T, game_id: u32, player_id: ContractAddress) -> GameStorePacked;
    fn slot_machine(self: @T, game_id: u32) -> SlotMachine;
    //
    //
    //
    fn save_ryo_config(self: @T, ryo_config: RyoConfig);
    fn save_ryo_addresses(self: @T, ryo_addresses: RyoAddress);
    fn save_game_config(self: @T, game_config: GameConfig);
    //
    fn save_encounter_stats_config(self: @T, config: EncounterStatsConfig);
    fn save_drug_config(self: @T, config: DrugConfig);
    //
    fn save_season(self: @T, season: Season);
    fn save_season_settings(self: @T, season_settings: SeasonSettings);
    fn set_game(self: @T, game: Game);
    fn set_game_store_packed(self: @T, game_store_packed: GameStorePacked);
    fn set_slot_machine(self: @T, machine: SlotMachine);
}

const UNIVERSAL_ANSWER: u8 = 0; //42;

#[dojo::contract]
mod store {
    use super::UNIVERSAL_ANSWER;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            drugs::{Drugs, DrugConfig}, locations::{Locations}, game::{GameConfig},
            hustlers::{ItemSlot, HustlerItemBaseConfig, HustlerItemTiersConfig}, ryo::{RyoConfig,},
            encounters::{Encounters, EncounterConfig, EncounterStatsConfig},
            ryo_address::{RyoAddress}, settings::{SeasonSettings, EncountersMode, DrugsMode}
        },
        models::{game_store_packed::GameStorePacked, game::{Game, GameImpl}, season::{Season}},
        packing::{
            game_store::{GameStore, GameStorePackerImpl, GameStoreUnpackerImpl, GameMode},
            player::{Player, PlayerImpl},
        },
        traits::Packer, systems::slot::SlotMachine
    };

    use debug::PrintTrait;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[abi(embed_v0)]
    impl StoreImpl of super::IStore<ContractState> {
        fn w(self: @ContractState) -> IWorldDispatcher {
            self.world()
        }

        fn ryo_config(self: @ContractState) -> RyoConfig {
            get!(self.world(), (UNIVERSAL_ANSWER), (RyoConfig))
        }

        fn ryo_addresses(self: @ContractState) -> RyoAddress {
            get!(self.world(), (UNIVERSAL_ANSWER), (RyoAddress))
        }

        //

        fn game_config(self: @ContractState, version: u16) -> GameConfig {
            get!(self.world(), (version), (GameConfig))
        }

        fn drug_config(self: @ContractState, drugs_mode: DrugsMode, drug: Drugs) -> DrugConfig {
            get!(self.world(), (drugs_mode, drug), DrugConfig)
        }

        // fn encounter_config(self: @ContractState, id: u8) -> EncounterConfig {
        //     get!(self.world(), (id), EncounterConfig)
        // }

        fn encounter_stats_config(
            self: @ContractState, encounter: Encounters, encounters_mode: EncountersMode
        ) -> EncounterStatsConfig {
            get!(self.world(), (encounter, encounters_mode), EncounterStatsConfig)
        }

        fn item_base_config(
            self: @ContractState, slot: ItemSlot, item_id: u16
        ) -> HustlerItemBaseConfig {
            get!(self.world(), (slot, item_id), HustlerItemBaseConfig)
        }

        fn item_tiers_config(
            self: @ContractState, slot: ItemSlot, tiers: u8
        ) -> HustlerItemTiersConfig {
            get!(self.world(), (slot, tiers), HustlerItemTiersConfig)
        }


        //

        fn season(self: @ContractState, version: u16) -> Season {
            get!(self.world(), (version), Season)
        }

        fn season_settings(self: @ContractState, version: u16) -> SeasonSettings {
            get!(self.world(), (version), SeasonSettings)
        }

        fn game(self: @ContractState, game_id: u32, player_id: ContractAddress) -> Game {
            get!(self.world(), (game_id, player_id), Game)
        }

        // fn game_store(self: @ContractState, game_id: u32, player_id: ContractAddress) ->
        // GameStore {
        //     let game = self.game(game_id, player_id);
        //     let game_store_packed = get!(self.world(), (game_id, player_id), GameStorePacked);
        //     let game_store: GameStore = game_store_packed.unpack(self.s(), game);
        //     game_store
        // }

        fn game_store_packed(
            self: @ContractState, game_id: u32, player_id: ContractAddress
        ) -> GameStorePacked {
            get!(self.world(), (game_id, player_id), GameStorePacked)
        }

        fn slot_machine(self: @ContractState, game_id: u32) -> SlotMachine {
            get!(self.world(), (game_id), SlotMachine)
        }
       
        //
        // setter
        //

        fn save_ryo_config(self: @ContractState, ryo_config: RyoConfig) {
            // check UNIVERSAL_ANSWER ?
            set!(self.world(), (ryo_config));
        }

        fn save_ryo_addresses(self: @ContractState, ryo_addresses: RyoAddress) {
            // check UNIVERSAL_ANSWER ?
            set!(self.world(), (ryo_addresses));
        }

        fn save_game_config(self: @ContractState, game_config: GameConfig) {
            // check UNIVERSAL_ANSWER ?
            set!(self.world(), (game_config));
        }

        //

        // fn save_encounter_config(self: @ContractState, config: EncounterConfig) {
        //     set!(self.world(), (config))
        // }

        fn save_encounter_stats_config(self: @ContractState, config: EncounterStatsConfig) {
            set!(self.world(), (config))
        }

        fn save_drug_config(self: @ContractState, config: DrugConfig) {
            set!(self.world(), (config))
        }

        //

        fn save_season(self: @ContractState, season: Season) {
            set!(self.world(), (season))
        }

        fn save_season_settings(self: @ContractState, season_settings: SeasonSettings) {
            set!(self.world(), (season_settings))
        }

        fn set_game(self: @ContractState, game: Game) {
            set!(self.world(), (game));
        }

        // fn set_game_store(self: @ContractState, game_store: GameStore) {
        //     let game_store_packed = game_store.pack();
        //     set!(self.world(), (game_store_packed));
        // }

        fn set_game_store_packed(self: @ContractState, game_store_packed: GameStorePacked) {
            set!(self.world(), (game_store_packed));
        }

        fn set_slot_machine(self: @ContractState, machine: SlotMachine) {
            set!(self.world(), (machine))
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn s(self: @ContractState,) -> super::IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            super::IStoreLibraryDispatcher { class_hash, }
        }
    }
}
