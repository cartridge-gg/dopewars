use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use rollyourown::{
    config::{
        locations::{Locations}, ryo::{RyoConfig},
        hustlers::{ItemSlot, HustlerItemBaseConfig, HustlerItemTiersConfig},
        drugs::{Drugs, DrugConfig}, encounters::{EncounterConfig}, game::{GameConfig},
        ryo_address::{RyoAddress}
    },
    models::{game::Game, season::Season, game_store_packed::GameStorePacked,},
    packing::{game_store::{GameStore, GameStorePackerImpl, GameMode}},
    traits::{Packable, Packer, Unpacker}
};


#[starknet::interface]
trait IStore<T> {
    fn w(self: @T) -> IWorldDispatcher;
    //
    fn ryo_config(self: @T,) -> RyoConfig;
    fn ryo_addresses(self: @T,) -> RyoAddress;
    fn game_config(self: @T,) -> GameConfig;
    //
    fn drug_config(self: @T, drug: Drugs) -> DrugConfig;
    fn encounter_config(self: @T, id: u8) -> EncounterConfig;
    fn item_base_config(self: @T, slot: ItemSlot, item_id: u16) -> HustlerItemBaseConfig;
    fn item_tiers_config(self: @T, slot: ItemSlot, tiers: u8) -> HustlerItemTiersConfig;
    //
    fn season(self: @T, version: u16) -> Season;
    fn game(self: @T, game_id: u32, player_id: ContractAddress) -> Game;
    fn game_store(self: @T, game_id: u32, player_id: ContractAddress) -> GameStore;
    //
    //
    //
    fn save_ryo_config(self: @T, ryo_config: RyoConfig);
    fn save_ryo_addresses(self: @T, ryo_addresses: RyoAddress);
    fn save_game_config(self: @T, game_config: GameConfig);
    //
    fn save_encounter_config(self: @T, encounter_config: EncounterConfig);
    fn save_drug_config(self: @T, drug_config: DrugConfig);
    //
    fn save_season(self: @T, season: Season);
    fn set_game(self: @T, game: Game);
    fn set_game_store(self: @T, game_store: GameStore);
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
            encounters::{EncounterConfig}, ryo_address::{RyoAddress},
        },
        models::{game_store_packed::GameStorePacked, game::{Game, GameImpl}, season::{Season}},
        packing::{
            game_store::{GameStore, GameStorePackerImpl, GameStoreUnpackerImpl, GameMode},
            player::{Player, PlayerImpl},
        },
        traits::Packer
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

        fn game_config(self: @ContractState) -> GameConfig {
            get!(self.world(), (UNIVERSAL_ANSWER), (GameConfig))
        }

        //

        fn drug_config(self: @ContractState, drug: Drugs) -> DrugConfig {
            get!(self.world(), (drug), DrugConfig)
        }

        fn encounter_config(self: @ContractState, id: u8) -> EncounterConfig {
            get!(self.world(), (id), EncounterConfig)
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

        fn game(self: @ContractState, game_id: u32, player_id: ContractAddress) -> Game {
            get!(self.world(), (game_id, player_id), Game)
        }

        fn game_store(self: @ContractState, game_id: u32, player_id: ContractAddress) -> GameStore {
            let game = self.game(game_id, player_id);
            let game_store_packed = get!(self.world(), (game_id, player_id), GameStorePacked);
            let game_store: GameStore = game_store_packed.unpack(self.s(), game);
            game_store
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

        fn save_encounter_config(self: @ContractState, encounter_config: EncounterConfig) {
            set!(self.world(), (encounter_config))
        }

        fn save_drug_config(self: @ContractState, drug_config: DrugConfig) {
            set!(self.world(), (drug_config))
        }

        //

        fn save_season(self: @ContractState, season: Season) {
            set!(self.world(), (season))
        }

        fn set_game(self: @ContractState, game: Game) {
            set!(self.world(), (game));
        }

        fn set_game_store(self: @ContractState, game_store: GameStore) {
            let game_store_packed = game_store.pack();
            set!(self.world(), (game_store_packed));
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn s(self: @ContractState,) -> super::IStoreLibraryDispatcher {
            let (class_hash, _) = self.world().contract('store');
            super::IStoreLibraryDispatcher { class_hash, }
        }
    }
}
