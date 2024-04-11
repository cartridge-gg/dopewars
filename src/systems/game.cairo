use starknet::ContractAddress;
use rollyourown::{
    config::{locations::{Locations}, hustlers::{ItemSlot}}, packing::game_store::{GameMode},
    systems::{trading, shopping}, packing::game_store::{GameStore, GameStoreImpl}
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
    fn claim(self: @T, season: u16);
    fn claim_treasury(self: @T);
}


#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    use rollyourown::{
        config::{
            drugs::{Drugs}, locations::{Locations}, game::{GameConfig, GameConfigImpl},
            ryo::{RyoConfig, RyoConfigManager, RyoConfigManagerTrait},
            ryo_address::{RyoAddress, RyoAddressManager, RyoAddressManagerTrait},
        },
        models::{
            game_store_packed::GameStorePacked, game::{Game, GameImpl}, leaderboard::{Leaderboard}
        },
        packing::{
            game_store::{GameStore, GameStoreImpl, GameStorePackerImpl, GameMode},
            player::{Player, PlayerImpl},
        },
        systems::{
            trading, shopping, traveling, traveling::EncounterOutcomes, game_loop,
            game::EncounterActions, leaderboard::{LeaderboardManagerTrait}
        },
        utils::{random::{Random, RandomImpl}, bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}},
        interfaces::paper::{IPaperDispatcher, IPaperDispatcherTrait},
        constants::{ETHER},
    };


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
        MeetOG: MeetOG,
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
        attack: u8,
        health: u8,
        level: u8,
        health_loss: u8,
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
        dmg_dealt: Array<(u8,u8)>,
        dmg_taken: Array<(u8,u8)>,
        cash_earnt: u32,
        cash_loss: u32,
        drug_id: u8,
        drug_loss: Array<u32>,
        turn_loss: u8,
        escaped_with_item: bool,
        rep_pos:u8,
        rep_neg:u8,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct MeetOG {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        #[key]
        og_id: u16,
    }

    #[derive(Drop, Serde, starknet::Event)]
    struct GameOver {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        #[key]
        leaderboard_version: u16,
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

            let world = self.world();
            let game_id = world.uuid();
            let player_id = get_caller_address();

            // get leaderboard version & pay paper_fee
            let leaderboard_manager = LeaderboardManagerTrait::new(world);
            let leaderboard_version = leaderboard_manager.on_game_start();

            let game_config = GameConfigImpl::get(world);
            let game = Game {
                game_id,
                player_id,
                player_name: Bytes16Impl::from(player_name),
                hustler_id,
                leaderboard_version,
                game_mode,// TODO: remove
                max_turns: game_config.max_turns, // TODO: remove?
                max_wanted_shopping: game_config.max_wanted_shopping, // TODO: remove?
                max_rounds: game_config.max_rounds, // TODO: remove?
                game_over: false
            };

            // save Game
            set!(world, (game));

            // create GameStorePacked
            let game_store = GameStoreImpl::new(world, game);
            let game_store_packed = game_store.pack();

            // save GameStorePacked
            set!(world, (game_store_packed));

            // emit GameCreated
            emit!(world, (Event::GameCreated(GameCreated { game_id, player_id, game_mode, player_name, hustler_id })));
        }

        fn end_game(self: @ContractState, game_id: u32, actions: Span<super::Actions>) {
            let world = self.world();
            let player_id = get_caller_address();

            let game = GameImpl::get(world, game_id, player_id);
            let mut game_store = GameStoreImpl::get(world, game);

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            //save & on_game_over
            game_loop::on_game_over(ref game_store);
        }

        fn travel(
            self: @ContractState,
            game_id: u32,
            next_location: Locations,
            actions: Span<super::Actions>,
        ) {
            let world = self.world();
            let player_id = get_caller_address();

            let game = GameImpl::get(world, game_id, player_id);
            let mut game_store = GameStoreImpl::get(world, game);

            // check if can travel
            assert(game_store.player.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let mut randomizer = RandomImpl::new(world);

            // save next_location
            game_store.player.next_location = next_location;

            // traveling
            let (is_dead, has_encounter) = game_loop::on_travel(ref game_store, ref randomizer);

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store);
            } else {
                if has_encounter {
                    // save & no end turn
                    let game_store_packed = game_store.pack();
                    set!(world, (game_store_packed));
                } else {
                    // save & on_turn_end
                    game_loop::on_turn_end(ref game_store, ref randomizer,);
                }
            }
        }

        fn decide(self: @ContractState, game_id: u32, action: super::EncounterActions,) {
            let world = self.world();
            let player_id = get_caller_address();

            let game = GameImpl::get(world, game_id, player_id);
            let mut game_store = GameStoreImpl::get(world, game);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let mut randomizer = RandomImpl::new(world);

            // resolve decision
            let is_dead = traveling::decide(ref game_store, ref randomizer, action);

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store);
            } else {
                // on_turn_end & save
                game_loop::on_turn_end(ref game_store, ref randomizer,);
            };
        }

        fn claim(self: @ContractState, season: u16) {
            let world = self.world();
            let mut leaderboard = get!(world, (season), (Leaderboard));

            // check not claimed
            assert(!leaderboard.claimed, 'already claimed!');

            // check if caller is winner
            assert(leaderboard.player_id == get_caller_address(), 'you aint dat OG!');

            let leaderboard_manager = LeaderboardManagerTrait::new(world);
            let current_version = leaderboard_manager.get_current_version();

            // check if season has end
            assert(season < current_version, 'season has not ended yet!');

            // any other check missing ?

            // update claimed & save
            leaderboard.claimed = true;
            set!(world, (leaderboard));

            // retrieve paper address 
            let paper_address = RyoAddressManagerTrait::new(world).paper();
            let paper_jackpot_eth: u256 = leaderboard.paper_balance.into() * ETHER;

            // transfer reward
            IPaperDispatcher { contract_address: paper_address }
                .transfer(get_caller_address(), paper_jackpot_eth);
        }

         fn claim_treasury(self: @ContractState) {
            // check if owner ???   TODO: check if ok
            // self.assert_caller_is_owner();
           
            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let mut ryo_config = ryo_config_manager.get();

            assert(ryo_config.treasury_balance > 0, 'nothin to claim');

            // calc claimable amount
            let claimable_eth: u256  = ryo_config.treasury_balance.into() * ETHER;

            // reset treasury_balance
            ryo_config.treasury_balance = 0;
            ryo_config_manager.set(ryo_config);
         
            let ryo_addresses_manager = RyoAddressManagerTrait::new(self.world());

            // transfer claimable_eth to treasury
            IPaperDispatcher { contract_address: ryo_addresses_manager.paper() }
                .transfer(ryo_addresses_manager.treasury(), claimable_eth);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn assert_not_paused(self: @ContractState) {
            let ryo_config_manager = RyoConfigManagerTrait::new(self.world());
            let ryo_config = ryo_config_manager.get();
            assert(!ryo_config.paused, 'game is paused');
        }

        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            assert(
                self.world().is_owner(get_caller_address(), get_contract_address().into()),
                'not owner'
            );
        }

        fn execute_actions(
            self: @ContractState, ref game_store: GameStore, ref actions: Span<super::Actions>
        ) {
            let mut has_shopped = false;
            loop {
                match actions.pop_front() {
                    Option::Some(action) => {
                        match action {
                            super::Actions::Trade(tradeAction) => {
                                trading::execute_trade(ref game_store, *tradeAction);
                            },
                            super::Actions::Shop(shopAction) => {
                                assert(has_shopped == false, 'one upgrade by turn');
                                shopping::execute_action(ref game_store, *shopAction);
                                has_shopped = true;
                            },
                        };
                    },
                    Option::None => { break; },
                };
            };
        // TODO handle price impact ?
        }
    }
}
