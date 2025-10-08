use rollyourown::config::locations::Locations;
use rollyourown::models::game::{GameMode, TokenId};
use rollyourown::packing::game_store::GameStoreImpl;
use rollyourown::systems::helpers::{shopping, trading};

#[derive(Copy, Drop, Serde)]
pub enum Actions {
    Trade: trading::Trade,
    Shop: shopping::Action,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum EncounterActions {
    Run,
    Pay,
    Fight,
}

#[starknet::interface]
pub trait IGameActions<T> {
    fn create_game(
        self: @T, game_mode: GameMode, player_name: felt252, multiplier: u8, token_id: TokenId,
    );
    fn end_game(self: @T, game_id: u32, actions: Span<Actions>);
    fn travel(self: @T, game_id: u32, next_location: Locations, actions: Span<Actions>);
}

#[dojo::contract]
pub mod game {
    // use achievement::store::{StoreTrait as BushidoStoreTrait};
    // use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};
    use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
    use rollyourown::dope_contracts::dope_hustlers::dope_hustlers_models::{
        HustlerBody, HustlerBodyParts, HustlerSlotOption, HustlerSlots,
    };
    // use dope_contracts::dope_hustlers::dope_hustlers_store::{HustlerStoreImpl,
    // HustlerStoreTrait};
    // use rollyourown::achievements::achievements_v1::Tasks;
    use rollyourown::{
        config::{locations::{Locations}}, events::{GameCreated},
        helpers::season_manager::{SeasonManagerTrait},
        interfaces::{erc721::{IERC721ABIDispatcher, IERC721ABIDispatcherTrait}},
        models::{game::{GameImpl, GameMode, TokenId}, game_token::{GameToken}},
        packing::{game_store::{GameStore, GameStoreImpl}, player::{PlayerImpl}},
        store::{StoreImpl, StoreTrait},
        systems::{helpers::{game_loop, shopping, trading, trading::{TradeDirection}}},
        utils::{
            bytes16::{Bytes16Impl}, random::{RandomImpl},
            randomness_helper::{RandomnessHelperTrait},
        },
    };
    use starknet::get_caller_address;


    #[abi(embed_v0)]
    impl GameActionsImpl of super::IGameActions<ContractState> {
        fn create_game(
            self: @ContractState,
            game_mode: GameMode,
            player_name: felt252,
            multiplier: u8,
            token_id: TokenId,
        ) {
            self.assert_not_paused();
            // assert(game_mode == GameMode::Noob || game_mode == GameMode::Ranked, 'invalid game
            // mode!');

            let mut world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let randomness_config = store.randomness_config();
            let player_id = get_caller_address();
            let game_context = core::poseidon::poseidon_hash_span(
                array![player_id.into(), 'create_game'].span(),
            );
            let mut randomizer = RandomnessHelperTrait::create_randomizer(
                randomness_config, game_context,
            );

            let game_id = world.dispatcher.uuid();

            // get season version
            let mut season_manager = SeasonManagerTrait::new(store);
            let season_version = season_manager.get_current_version();

            // if RANKED
            if game_mode == GameMode::Ranked {
                // pay paper_fee * multiplier
                season_manager.on_game_start(multiplier);
            }

            let mut dope_world = self.world(@"dope");

            let mut game_created = GameCreated {
                game_id,
                player_id,
                game_mode,
                player_name,
                multiplier,
                token_id,
                hustler_equipment: array![].span(),
                hustler_body: array![].span(),
            };

            match token_id {
                TokenId::GuestLootId(guest_loot_id) => {
                    // check one of the availble guest_loot_id for season
                    let mut i: u32 = 0;
                    let mut is_valid = false;
                    while i < 8 {
                        let hash: u256 = core::poseidon::poseidon_hash_span(
                            array![season_version.into(), i.into()].span(),
                        )
                            .into();
                        let id: felt252 = ((hash % 8000) + 1).try_into().unwrap();
                        if guest_loot_id == id {
                            is_valid = true;
                            break;
                        }
                        i += 1;
                    }

                    assert!(is_valid, "invalid guest loot id");
                },
                TokenId::LootId(loot_id) => {
                    // check if owner of loot_id
                    let loot_dispatcher = IERC721ABIDispatcher {
                        contract_address: dope_world.dns_address(@"DopeLoot").unwrap(),
                    };
                    assert(
                        player_id == loot_dispatcher.owner_of(loot_id.into()),
                        'caller is not loot owner',
                    );
                },
                TokenId::HustlerId(hustler_id) => {
                    // check if owner of hustler_id
                    let erc721_dispatcher = IERC721ABIDispatcher {
                        contract_address: dope_world.dns_address(@"DopeHustlers").unwrap(),
                    };

                    assert(
                        player_id == erc721_dispatcher.owner_of(hustler_id.into()),
                        'caller is not hustler owner',
                    );

                    // let mut hustler_store = HustlerStoreImpl::new(dope_world);

                    // game_created
                    //     .hustler_equipment = hustler_store
                    //     .hustler_slot_full(hustler_id.into());

                    // game_created.hustler_body =
                    // hustler_store.hustler_body_full(hustler_id.into());

                    game_created
                        .hustler_equipment =
                            array![
                                HustlerSlotOption {
                                    token_id: hustler_id.into(),
                                    slot: HustlerSlots::Clothe,
                                    gear_item_id: Option::Some(256),
                                },
                                HustlerSlotOption {
                                    token_id: hustler_id.into(),
                                    slot: HustlerSlots::Vehicle,
                                    gear_item_id: Option::Some(512),
                                },
                                HustlerSlotOption {
                                    token_id: hustler_id.into(),
                                    slot: HustlerSlots::Foot,
                                    gear_item_id: Option::Some(1280),
                                },
                                HustlerSlotOption {
                                    token_id: hustler_id.into(),
                                    slot: HustlerSlots::Weapon,
                                    gear_item_id: Option::Some(0),
                                },
                            ]
                        .span();

                    game_created
                        .hustler_body =
                            array![
                                HustlerBody {
                                    token_id: hustler_id.into(),
                                    slot: HustlerBodyParts::Gender,
                                    value: 0,
                                },
                                HustlerBody {
                                    token_id: hustler_id.into(),
                                    slot: HustlerBodyParts::Body,
                                    value: 0,
                                },
                                HustlerBody {
                                    token_id: hustler_id.into(),
                                    slot: HustlerBodyParts::Hair,
                                    value: 0,
                                },
                                HustlerBody {
                                    token_id: hustler_id.into(),
                                    slot: HustlerBodyParts::Beard,
                                    value: 0,
                                },
                            ]
                        .span();
                    // let accessory = hustler_store
                //     .hustler_slot(hustler_id.into(), HustlerSlots::Accessory);

                    // let bushido_store = BushidoStoreTrait::new(world);
                // if accessory.gear_item_id.is_some() {
                //     bushido_store
                //         .progress(
                //             player_id.into(),
                //             Tasks::ELEGANT,
                //             1,
                //             starknet::get_block_timestamp(),
                //         );
                // };
                },
            }

            // create game
            let mut game_config = store.game_config(season_version);
            let mut game = GameImpl::new(
                dope_world,
                game_id,
                player_id,
                season_version,
                game_mode,
                player_name,
                multiplier,
                token_id,
            );

            // save Game
            store.set_game(@game);

            // create & save GameStorePacked
            let game_store = GameStoreImpl::new(store, ref game, ref game_config, ref randomizer);
            game_store.save();

            // mint NFT and store mapping
            let (game_token_contract, _) = world.dns(@"game_token_systems").unwrap();
            let minigame_dispatcher = IMinigameDispatcher { contract_address: game_token_contract };

            let nft_token_id = minigame_dispatcher
                .mint_game(
                    Option::Some(player_name), // player_name
                    Option::None, // settings_id
                    Option::None, // start
                    Option::None, // end
                    Option::None, // objective_ids
                    Option::None, // context
                    Option::None, // client_url
                    Option::None, // renderer_address
                    player_id, // to
                    true // soulbound - NFT cannot be transferred
                );

            // store the GameToken mapping
            world.write_model(@GameToken { token_id: nft_token_id, game_id, player_id });

            // emit GameCreated
            world.emit_event(@game_created);
        }

        fn end_game(self: @ContractState, game_id: u32, actions: Span<super::Actions>) {
            let player_id = get_caller_address();

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            //save & on_game_over
            game_loop::on_game_over(ref game_store, ref store);
        }


        fn travel(
            self: @ContractState,
            game_id: u32,
            next_location: Locations,
            actions: Span<super::Actions>,
        ) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let randomness_config = store.randomness_config();
            let player_id = get_caller_address();

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check if can travel
            assert(game_store.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let game_context = core::poseidon::poseidon_hash_span(
                array![player_id.into(), game_id.into(), 'travel'].span(),
            );
            let mut randomizer = RandomnessHelperTrait::create_randomizer(
                randomness_config, game_context,
            );
            let mut season_settings = store.season_settings(game_store.game.season_version);
            // save next_location
            game_store.player.next_location = next_location;

            // traveling
            let (is_dead, has_encounter) = game_loop::on_travel(
                ref game_store, ref season_settings, ref randomizer,
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, ref store);
            } else {
                if has_encounter {
                    // save & no end turn
                    game_store.save();
                } else {
                    // save & on_turn_end
                    game_loop::on_turn_end(ref game_store, ref randomizer, ref store);
                }
            }
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // #[inline(always)]
        fn assert_not_paused(self: @ContractState) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let ryo_config = store.ryo_config();
            assert(!ryo_config.paused, 'game is paused');
        }

        fn execute_actions(
            self: @ContractState, ref game_store: GameStore, ref actions: Span<super::Actions>,
        ) {
            let mut has_shopped = false;
            let mut is_first_sell = true;
            let mut is_first_buy = true;

            while let Option::Some(action) = actions.pop_front() {
                match action {
                    super::Actions::Trade(trade_action) => {
                        trading::execute_trade(
                            ref game_store, *trade_action, is_first_sell, is_first_buy,
                        );
                        if *trade_action.direction == TradeDirection::Sell {
                            is_first_sell = false;
                        }
                        if *trade_action.direction == TradeDirection::Buy {
                            is_first_sell = false;
                        };
                    },
                    super::Actions::Shop(shop_action) => {
                        assert(has_shopped == false, 'one upgrade by turn');
                        shopping::execute_action(ref game_store, *shop_action);
                        has_shopped = true;
                    },
                };
            };
        }
    }
}
