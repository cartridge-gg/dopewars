use starknet::ContractAddress;

#[starknet::interface]
pub trait ILaundromat<T> {
    fn register_score(self: @T, token_id: u64, prev_game_id: u32, prev_player_id: ContractAddress);
    fn launder(self: @T, season_version: u16);

    fn claim(self: @T, player_id: ContractAddress, token_ids: Span<u64>);
    fn claim_treasury(self: @T);
    fn supercharge_jackpot(self: @T, season_version: u16, amount_eth: u32);
}

#[dojo::contract]
pub mod laundromat {
    use dojo::world;
    use achievement::store::StoreTrait as BushidoStoreTrait;
    use dojo::event::EventStorage;
    use dojo::world::WorldStorageTrait;
    use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
    use game_components_minigame::libs::{assert_token_ownership, post_action};
    // use dojo::world::WorldStorageTrait;
    // use dope_contracts::dope_gear::dope_gear_ext::{GearItem};
    // use dope_contracts::dope_gear::interface::{IDopeGearABIDispatcher,
    // IDopeGearABIDispatcherTrait};
    // use dope_contracts::dope_hustlers::interface::{
    //     IDopeHustlersABIDispatcher, IDopeHustlersABIDispatcherTrait,
    // };
    // use dope_contracts::helpers::is_og;
    use rollyourown::achievements::achievements_v1::Tasks;
    use rollyourown::{
        constants::{ETHER, MAX_MULTIPLIER}, events::{Claimed, NewSeason},
        helpers::season_manager::{SeasonManagerImpl, SeasonManagerTrait},
        interfaces::{paper::{IPaperDispatcher, IPaperDispatcherTrait}},
        // libraries::dopewars_items::{IDopewarsItemsDispatcherTrait,
        // IDopewarsItemsLibraryDispatcher},
        models::{game::{Game, GameImpl, GameTrait// TokenId
        }, season::{SeasonImpl, SeasonTrait}},
        packing::game_store::{GameStoreImpl}, store::{StoreImpl, StoreTrait},
        utils::{
            // payout_items::{add_items_payout},
            payout_structure::{get_payed_count}, random::{RandomImpl},
            randomness_helper::{RandomnessHelperTrait},
            sorted_list::{SortedListImpl, SortedListTrait},
        },
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    // use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};

    #[abi(embed_v0)]
    impl LaundromatImpl of super::ILaundromat<ContractState> {
        fn register_score(
            self: @ContractState, token_id: u64, prev_game_id: u32, prev_player_id: ContractAddress,
        ) {
            let token_address = self._get_game_token_address();
            assert_token_ownership(token_address, token_id);

            let world = self.world(@"dopewars");

            let mut store = StoreImpl::new(world);

            let mut game = store.game_by_token_id(token_id);
            let season = store.season(game.season_version);

            // check if valid game
            assert(game.exists(), 'invalid game');
            // check if ranked game
            assert(game.is_ranked(), 'game is not ranked');
            // check dat game exists & is game_over
            assert(game.game_over, 'game is not over');
            // check not already registered
            assert(!game.registered, 'already registered');
            // check if season is still opened
            assert(season.is_open(), 'season has closed');

            // register final_score
            let mut game_store = GameStoreImpl::load(ref store, game.game_id, game.player_id);
            game.final_score = game_store.player.cash;
            game.registered = true;
            store.set_game(@game);

            // handle new highscore & season version
            let mut season_manager = SeasonManagerTrait::new(store);
            season_manager.on_register_score(ref game_store);

            // retrieve Season SortedList
            let list_id = game.season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);

            // add Game to sorted_list
            sorted_list.add(ref store, game, (prev_game_id, prev_player_id));

            // quests
            let bushido_store = BushidoStoreTrait::new(world);

            if game_store.player.health == 1 {
                bushido_store
                    .progress(
                        game.player_id.into(), Tasks::SURVIVOR, 1, starknet::get_block_timestamp(),
                    );
            }

            if game_store.player.reputation == 100 {
                bushido_store
                    .progress(game.player_id.into(), Tasks::FAMOUS, 1, starknet::get_block_timestamp());
            }

            if game.multiplier == MAX_MULTIPLIER {
                bushido_store
                    .progress(
                        game.player_id.into(), Tasks::HIGH_STAKES, 1, starknet::get_block_timestamp(),
                    );
            }
            // if let TokenId::HustlerId(huster_id) = game.token_id {
        //     // if is_og(huster_id.into()) {
        //     //     bushido_store
        //     //         .progress(player_id.into(), Tasks::OG, 1,
        //     starknet::get_block_timestamp());
        //     // }

            //     let weapon_id: u256 = (*game.equipment_by_slot.at(0)).into();
        //     let clothe_id: u256 = (*game.equipment_by_slot.at(1)).into();
        //     let foot_id: u256 = (*game.equipment_by_slot.at(2)).into();
        //     let vehicle_id: u256 = (*game.equipment_by_slot.at(3)).into();

            //     let weapon: GearItem = weapon_id.into();
        //     let clothe: GearItem = clothe_id.into();
        //     let foot: GearItem = foot_id.into();
        //     let vehicle: GearItem = vehicle_id.into();

            //     if weapon.suffix > 0
        //         && weapon.suffix == clothe.suffix
        //         && weapon.suffix == foot.suffix
        //         && weapon.suffix == vehicle.suffix {
        //         bushido_store
        //             .progress(
        //                 player_id.into(), Tasks::GEAR_FROM, 1,
        //                 starknet::get_block_timestamp(),
        //             );
        //     }

            //     let items_disp = IDopewarsItemsLibraryDispatcher {
        //         class_hash: world.dns_class_hash(@"DopewarsItems_v0").unwrap(),
        //     };

            //     let weapon_tier = items_disp.get_item_tier(weapon.slot, weapon.item);
        //     let clothe_tier = items_disp.get_item_tier(clothe.slot, clothe.item);
        //     let foot_tier = items_disp.get_item_tier(foot.slot, foot.item);
        //     let vehicle_tier = items_disp.get_item_tier(vehicle.slot, vehicle.item);

            //     if weapon_tier == clothe_tier
        //         && weapon_tier == foot_tier
        //         && weapon_tier == vehicle_tier {
        //         let task = match weapon_tier {
        //             0 => panic!("invalid tier"),
        //             1 => Tasks::FULL_LATE,
        //             2 => Tasks::FULL_MID,
        //             3 => Tasks::FULL_EARLY,
        //             _ => panic!("invalid tier"),
        //         };
        //         bushido_store
        //             .progress(player_id.into(), task, 1, starknet::get_block_timestamp());
        //     }
        // }

            // Update token state
            post_action(token_address, game.minigame_token_id);
        }

        fn launder(self: @ContractState, season_version: u16) {
            let world = self.world(@"dopewars");
            let mut store = StoreImpl::new(world);

            let randomness_config = store.randomness_config();
            let _player_id = get_caller_address();

            // around 276k steps / 10
            // almost free now, compute all in one
            let process_batch_size = 100;

            let season = store.season(season_version);

            let mut ryo_config = store.ryo_config();

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if close
            assert(!season.is_open(), 'season is still opened');

            // retrieve Season SortedList
            let list_id = season_version.into();
            let mut sorted_list = SortedListImpl::get(@store, list_id);

            // set process_max_size & total_stake_mul then lock list
            if !sorted_list.locked {
                let process_max_size = get_payed_count(sorted_list.size);
                let stake_adj_paper_balance = sorted_list
                    .calc_stake_adj_paper_balance::<Game>(ref store, process_max_size);
                sorted_list.lock(ref store, process_max_size, stake_adj_paper_balance);
            }

            // if not process, process batch_size items
            if !sorted_list.processed {
                sorted_list.process::<Game>(ref store, process_batch_size);
            }

            // if process, create new season
            if sorted_list.processed {
                // retrieve next season
                let next_season = store.season(season_version + 1);

                // check if not already created
                if !next_season.exists() {
                    // update current version
                    ryo_config.season_version += 1;

                    store.save_ryo_config(@ryo_config);

                    // create new season
                    let game_context = core::poseidon::poseidon_hash_span(
                        array![season_version.into(), 'launder'].span(),
                    );
                    let mut randomizer = RandomnessHelperTrait::create_randomizer(
                        randomness_config, game_context,
                    );
                    let mut season_manager = SeasonManagerTrait::new(store);
                    season_manager.new_season(ref randomizer, ryo_config.season_version);

                    // emit NewSeason
                    store
                        .world
                        .emit_event(
                            @NewSeason {
                                key: ryo_config.season_version,
                                season_version: ryo_config.season_version,
                            },
                        );
                } else {
                    assert(false, 'launder already ended');
                }
            }

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let paper_reward_launderer: u256 = ryo_config.paper_reward_launderer.into() * ETHER;

            // reward launderer with some clean paper
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_reward_launderer);
        }

        fn claim(self: @ContractState, player_id: ContractAddress, token_ids: Span<u64>) {
            let world = self.world(@"dopewars");
            let mut _dope_world = self.world(@"dope");

            let mut store = StoreImpl::new(world);

            // Verify caller is player_id
            let caller = get_caller_address();
            assert(caller == player_id, 'caller must be player_id');

            let mut token_ids = token_ids;

            // // check max batch size
            // assert(token_ids.len() <= 10, 'too much token_ids');

            let mut _gear_ids: Array<u256> = array![];
            let mut _gear_ids_values: Array<u256> = array![];
            let mut _hustler_count = 0;

            // let hustler_dispatcher = IDopeHustlersABIDispatcher {
            //     contract_address: dope_world.dns_address(@"DopeHustlers").unwrap(),
            // };
            // let gear_dispatcher = IDopeGearABIDispatcher {
            //     contract_address: dope_world.dns_address(@"DopeGear").unwrap(),
            // };

            let bushido_store = BushidoStoreTrait::new(world);
            let mut total_claimable = 0;
            let token_address = self._get_game_token_address();

            while let Option::Some(token_id) = token_ids.pop_front() {
                assert_token_ownership(token_address, *token_id);

                let mut game = store.game_by_token_id(*token_id);

                // retrieve Season SortedList
                let list_id = game.season_version.into();
                let mut sorted_list = SortedListImpl::get(@store, list_id);

                // check season status
                assert(sorted_list.locked, 'season has not ended');
                assert(sorted_list.processed, 'need more launder');

                // any other check missing ?
                assert(game.registered, 'unregistered game');
                assert(game.position > 0, 'invalid position');
                assert(!game.claimed, 'already claimed');

                total_claimable = total_claimable + game.claimable;

                // update claimed & save
                game.claimed = true;
                store.set_game(@game);

                // // add items rewards ids
                // add_items_payout(
                //     ref dope_world,
                //     ref gear_ids,
                //     ref gear_ids_values,
                //     ref hustler_count,
                //     game.season_version,
                //     game.position,
                // );

                // emit Claimed event
                store
                    .world
                    .emit_event(
                        @Claimed {
                            game_id: game.game_id,
                            player_id,
                            season_version: game.season_version,
                            paper: game.claimable,
                            rank: game.position,
                        },
                    );

                if game.position == 1 {
                    bushido_store
                        .progress(
                            player_id.into(), Tasks::KINGPIN, 1, starknet::get_block_timestamp(),
                        );
                }
            }

            bushido_store
                .progress(
                    player_id.into(),
                    Tasks::PAPER,
                    total_claimable.into(),
                    starknet::get_block_timestamp(),
                );

            // retrieve paper address
            let paper_address = store.ryo_addresses().paper;
            let total_claimable: u256 = total_claimable.into() * ETHER;

            // transfer reward to player_id
            IPaperDispatcher { contract_address: paper_address }
                .transfer(player_id, total_claimable);
            // // mint gear items
        // gear_dispatcher
        //     .mint_batch(player_id, gear_ids.span(), gear_ids_values.span(), array![].span());

            // // mint hustlers
        // while hustler_count > 0 {
        //     hustler_dispatcher.mint_hustler_to(player_id);
        //     hustler_count -= 1;
        // }
        }

        fn claim_treasury(self: @ContractState) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let mut ryo_config = store.ryo_config();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable: u256 = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            store.save_ryo_config(@ryo_config);

            let ryo_addresses = store.ryo_addresses();
            // transfer claimable to treasury
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer(ryo_addresses.treasury, claimable);
        }

        fn supercharge_jackpot(self: @ContractState, season_version: u16, amount_eth: u32) {
            let mut store = StoreImpl::new(self.world(@"dopewars"));
            // retrieve season
            let mut season = store.season(season_version);

            // check if exists
            assert(season.exists(), 'invalid season_version');
            // check if still open
            assert(season.is_open(), 'season has ended');

            // update season paper_balance & save
            season.paper_balance += amount_eth;
            store.save_season(@season);

            // retrieve paper address
            let ryo_addresses = store.ryo_addresses();
            let amount = amount_eth.into() * ETHER;

            // transfer paper_fee_ether from donnator to laundromat ( donnator approved laundromat
            // contract to spend paper before)
            IPaperDispatcher { contract_address: ryo_addresses.paper }
                .transfer_from(get_caller_address(), get_contract_address(), amount);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _get_game_token_address(self: @ContractState) -> starknet::ContractAddress {
            let world = self.world(@"dopewars");
            let (game_token_systems_address, _) = world.dns(@"game_token_system_v0").unwrap();
            let minigame_dispatcher = IMinigameDispatcher {
                contract_address: game_token_systems_address,
            };
            minigame_dispatcher.token_address()
        }
    }

}
