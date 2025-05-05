use dojo::meta::introspect::Introspect;

use rollyourown::{
    config::{hustlers::{ItemSlot}, locations::{Locations}}, models::game_with_token_id::{TokenId},
    packing::game_store::{GameMode}, packing::game_store::{GameStore, GameStoreImpl},
    systems::helpers::{shopping, trading},
};
use starknet::ContractAddress;

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
trait IGameActions<T> {
    fn create_game(
        self: @T, game_mode: GameMode, hustler_id: u16, player_name: felt252, token_id: TokenId,
    );
    fn end_game(self: @T, game_id: u32, actions: Span<Actions>);
    fn travel(self: @T, game_id: u32, next_location: Locations, actions: Span<Actions>);
    fn decide(self: @T, game_id: u32, action: EncounterActions);
}

#[dojo::contract]
mod game {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use dojo::world::{WorldStorage};

    use rollyourown::{
        config::{
            drugs::{Drugs}, encounters::{Encounters}, game::{GameConfig}, locations::{Locations},
            ryo::{RyoConfig}, ryo_address::{RyoAddress},
        },
        constants::{ETHER}, events::{GameCreated, GameWithTokenIdCreated},
        helpers::season_manager::{SeasonManagerTrait},
        interfaces::{
            dope_hustlers::{IDopeHustlersDispatcher, IDopeHustlersDispatcherTrait},
            erc721::{IERC721ABIDispatcher, IERC721ABIDispatcherTrait},
            paper::{IPaperDispatcher, IPaperDispatcherTrait},
        },
        models::{
            game::{Game, GameImpl}, game_store_packed::GameStorePacked,
            game_with_token_id::{
                GameWithTokenId, //  GameWithTokenIdCreatedImpl, GameWithTokenIdCreatedTrait,
                GameWithTokenIdImpl, GameWithTokenIdTrait, TokenId,
            },
            season::{Season},
        },
        packing::{game_store::{GameMode, GameStore, GameStoreImpl}, player::{Player, PlayerImpl}},
        store::{Store, StoreImpl, StoreTrait},
        systems::{
            game::EncounterActions,
            helpers::{game_loop, shopping, trading, traveling, traveling::EncounterOutcomes},
        },
        utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}, random::{Random, RandomImpl}},
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    #[abi(embed_v0)]
    impl GameActionsImpl of super::IGameActions<ContractState> {
        fn create_game(
            self: @ContractState,
            game_mode: GameMode,
            hustler_id: u16,
            player_name: felt252,
            token_id: TokenId,
        ) {
            self.assert_not_paused();
            // assert(game_mode == GameMode::Noob || game_mode == GameMode::Ranked, 'invalid game
            // mode!');

            let mut world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));
            let mut randomizer = RandomImpl::new(random);

            let game_id = world.dispatcher.uuid();

            // get season version
            let mut season_manager = SeasonManagerTrait::new(store);
            let season_version = season_manager.get_current_version();

            // if RANKED
            if game_mode == GameMode::Ranked {
                // pay paper_fee
                season_manager.on_game_start();
            }

            let mut dope_world = self.world(@"dojo");

            let mut game_with_token_id_created = GameWithTokenIdCreated {
                game_id,
                player_id,
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
                        let hash: u256 = poseidon::poseidon_hash_span(
                            array![season_version.into(), i.into()].span(),
                        )
                            .into();
                        let id: felt252 = ((hash % 8000) + 1).try_into().unwrap();
                        if guest_loot_id == id {
                            println!("id: {} i {}", guest_loot_id, i);
                            is_valid = true;
                            break;
                        }
                        i += 1;
                    };

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
                    let dope_hustlers_dispatcher = IDopeHustlersDispatcher {
                        contract_address: dope_world.dns_address(@"DopeHustlers").unwrap(),
                    };

                    game_with_token_id_created
                        .hustler_equipment = dope_hustlers_dispatcher
                        .hustler_equipment(hustler_id.into());

                    game_with_token_id_created
                        .hustler_body = dope_hustlers_dispatcher
                        .hustler_body(hustler_id.into());

                    assert(
                        player_id == erc721_dispatcher.owner_of(hustler_id.into()),
                        'caller is not hustler owner',
                    );
                },
            };

            // create a GameWithTokenId
            let mut game_with_token_id = GameWithTokenIdImpl::new(
                dope_world, store, game_id, player_id, token_id,
            );
            store.set_game_with_token_id(@game_with_token_id);

            // create game
            let mut game_config = store.game_config(season_version);
            let mut game = GameImpl::new(
                game_id, player_id, season_version, game_mode, player_name, hustler_id,
            );

            // save Game
            store.set_game(@game);

            // create & save GameStorePacked
            let game_store = GameStoreImpl::new(
                store, ref game, ref game_config, ref game_with_token_id, ref randomizer,
            );
            game_store.save();

            // emit GameCreated
            world
                .emit_event(
                    @GameCreated {
                        game_id, player_id, game_mode, player_name, hustler_id // , token_id
                    },
                );
            world.emit_event(@game_with_token_id_created);
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

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check if can travel
            assert(game_store.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let mut randomizer = RandomImpl::new(random);
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

        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));

            let ryo_addresses = store.ryo_addresses();
            let player_id = get_caller_address();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(player_id));

            //
            let mut game_store = GameStoreImpl::load(ref store, game_id, player_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let mut randomizer = RandomImpl::new(random);
            let mut season_settings = store.season_settings(game_store.game.season_version);

            // // resolve decision
            let is_dead = traveling::decide(
                ref game_store, ref season_settings, ref randomizer, action,
            );

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, ref store);
            } else {
                // on_turn_end & save
                game_loop::on_turn_end(ref game_store, ref randomizer, ref store);
            };
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

            while let Option::Some(action) = actions.pop_front() {
                match action {
                    super::Actions::Trade(trade_action) => {
                        trading::execute_trade(ref game_store, *trade_action);
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
