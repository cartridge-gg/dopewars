use starknet::ContractAddress;
use rollyourown::{
    config::{locations::{Locations}, hustlers::{ItemSlot}}, packing::game_store::{GameMode},
    systems::helpers::{trading, shopping}, packing::game_store::{GameStore, GameStoreImpl}
};

#[derive(Copy, Drop, Serde)]
enum Actions {
    Trade: trading::Trade,
    Shop: shopping::Action,
}

#[derive(Copy, Drop, Serde, PartialEq)]
enum EncounterActions {
    Run,
    Pay,
    Fight,
}

#[starknet::interface]
trait IGameActions<T> {
    fn create_game(self: @T, game_mode: GameMode, hustler_id: u16, player_name: felt252);
    fn end_game(self: @T, game_id: u32, actions: Span<Actions>);
    fn travel(self: @T, game_id: u32, next_location: Locations, actions: Span<Actions>);
    fn decide(self: @T, game_id: u32, action: EncounterActions);
}

#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            drugs::{Drugs}, locations::{Locations}, game::{GameConfig}, ryo::{RyoConfig},
            ryo_address::{RyoAddress}, encounters::{Encounters}
        },
        models::{game_store_packed::GameStorePacked, game::{Game, GameImpl}, season::{Season}},
        packing::{game_store::{GameStore, GameStoreImpl, GameMode}, player::{Player, PlayerImpl},},
        systems::{
            helpers::{trading, shopping, traveling, traveling::EncounterOutcomes, game_loop},
            game::EncounterActions, slot::{SlotMachineImpl, SlotMachineTrait}
        },
        library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
        helpers::season_manager::{SeasonManagerTrait},
        utils::{
            random::{Random, RandomImpl}, bytes16::{Bytes16, Bytes16Impl, Bytes16Trait},
            sorted_list::{SortedListImpl, SortedListTrait}
        },
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait}, constants::{ETHER},
    };
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        Traveled: Traveled,
        TradeDrug: TradeDrug,
        HighVolatility: HighVolatility,
        UpgradeItem: UpgradeItem,
        TravelEncounter: TravelEncounter,
        TravelEncounterResult: TravelEncounterResult,
        GameOver: GameOver,
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        game_mode: GameMode,
        player_name: felt252,
        hustler_id: u16
    }

    #[derive(Drop, starknet::Event)]
    struct Traveled {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        turn: u8,
        from_location_id: u8,
        to_location_id: u8,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct TradeDrug {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        drug_id: u8,
        quantity: u32,
        price: u32,
        is_buy: bool,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct HighVolatility {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        location_id: u8,
        drug_id: u8,
        increase: bool,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct UpgradeItem {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        item_slot: u8,
        item_level: u8,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct TravelEncounter {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        encounter: felt252,
        level: u8,
        health: u8,
        attack: u8,
        defense: u8,
        speed: u8,
        demand_pct: u8,
        payout: u32,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct TravelEncounterResult {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        action: EncounterActions,
        outcome: EncounterOutcomes,
        rounds: u8,
        dmg_dealt: Array<(u8, u8)>,
        dmg_taken: Array<(u8, u8)>,
        cash_earnt: u32,
        cash_loss: u32,
        drug_id: u8,
        drug_loss: Array<u32>,
        turn_loss: u8,
        rep_pos: u8,
        rep_neg: u8,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct GameOver {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        #[key]
        season_version: u16,
        player_name: felt252,
        hustler_id: u16,
        turn: u8,
        cash: u32,
        health: u8,
        reputation: u8,
    }


    #[abi(embed_v0)]
    impl GameActionsImpl of super::IGameActions<ContractState> {
        fn create_game(
            self: @ContractState, game_mode: GameMode, hustler_id: u16, player_name: felt252
        ) {
            self.assert_not_paused();

            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));
            let mut randomizer = RandomImpl::new(random);

            let world = self.world();
            let game_id = world.uuid();

            // get season version 
            let season_manager = SeasonManagerTrait::new(self.s());
            let season_version = season_manager.get_current_version();

            // if RANKED 
            if game_mode == GameMode::Ranked {
                // pay paper_fee
                season_manager.on_game_start();
            }

            // create game
            let mut game_config = self.s().game_config(season_version);
            let mut game = GameImpl::new(
                game_id, player_id, season_version, game_mode, player_name, hustler_id
            );

            // save Game
            self.s().set_game(game);

            // create & save GameStorePacked
            let game_store = GameStoreImpl::new(
                self.s(), ref game, ref game_config, ref randomizer
            );
            game_store.save();

            // emit GameCreated
            emit!(
                world,
                (Event::GameCreated(
                    GameCreated { game_id, player_id, game_mode, player_name, hustler_id }
                ))
            );
        }

        fn end_game(self: @ContractState, game_id: u32, actions: Span<super::Actions>) {
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::load(self.s(), game_id, player_id);

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            //save & on_game_over
            game_loop::on_game_over(ref game_store, self.s());
        }


        fn travel(
            self: @ContractState,
            game_id: u32,
            next_location: Locations,
            actions: Span<super::Actions>,
        ) {
            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(self.s(), game_id, player_id);

            // check if can travel
            assert(game_store.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let mut randomizer = RandomImpl::new(random);
            let mut season_settings = self.s().season_settings(game_store.game.season_version);
            // save next_location
            game_store.player.next_location = next_location;

            // traveling
            let (is_dead, has_encounter) = game_loop::on_travel(
                ref game_store, ref season_settings, ref randomizer
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, self.s());
            } else {
                if has_encounter {
                    // save & no end turn
                    game_store.save();
                } else {
                    // save & on_turn_end
                    game_loop::on_turn_end(ref game_store, ref randomizer, self.s());
                }
            }
        }

        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions,) {
            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(self.s(), game_id, player_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let mut randomizer = RandomImpl::new(random);
            let mut season_settings = self.s().season_settings(game_store.game.season_version);

            // // resolve decision
            let is_dead = traveling::decide(
                self.s(), ref game_store, ref season_settings, ref randomizer, action
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, self.s());
            } else {
                // on_turn_end & save
                game_loop::on_turn_end(ref game_store, ref randomizer, self.s());
            };
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // #[inline(always)]
        fn assert_not_paused(self: @ContractState) {
            let ryo_config = self.s().ryo_config();
            assert(!ryo_config.paused, 'game is paused');
        }

        fn execute_actions(
            self: @ContractState, ref game_store: GameStore, ref actions: Span<super::Actions>
        ) {
            let mut has_shopped = false;

            while let Option::Some(action) = actions
                .pop_front() {
                    match action {
                        super::Actions::Trade(tradeAction) => {
                            trading::execute_trade(ref game_store, *tradeAction);
                        },
                        super::Actions::Shop(shopAction) => {
                            assert(has_shopped == false, 'one upgrade by turn');
                            shopping::execute_action(self.s(), ref game_store, *shopAction);
                            has_shopped = true;
                        },
                    };
                };
        }

        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}
