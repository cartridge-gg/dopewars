use starknet::ContractAddress;
use rollyourown::{
    config::{locations::{Locations}, items::{ItemSlot}}, packing::game_store::{GameMode},
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
trait IGame<T> {
    fn create_game(self: @T, game_mode: GameMode, avatar_id: u8, player_name: felt252);
    fn end_game(self: @T, game_id: u32, actions: Span<Actions>, player_name: felt252);
    fn travel(
        self: @T,
        game_id: u32,
        next_location: Locations,
        actions: Span<Actions>,
        player_name: felt252
    );
    fn decide(self: @T, game_id: u32, action: EncounterActions, player_name: felt252);
}

#[dojo::contract]
mod game {
    use starknet::{ContractAddress, get_caller_address};

    use rollyourown::{
        config::{drugs::{Drugs}, locations::{Locations}, game::{GameConfig, GameConfigImpl}},
        models::{game_store_packed::GameStorePacked, game::{Game}},
        packing::{
            game_store::{GameStore, GameStoreImpl, GameStorePackerImpl, GameMode},
            encounters_packed::{Encounters}, player::{Player, PlayerImpl},
        },
        systems::{
            trading, shopping, traveling, traveling::EncounterOutcomes, game_loop,
            game::EncounterActions, leaderboard::{LeaderboardManagerTrait}
        },
        utils::random::{Random, RandomImpl},
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
        dmg_dealt: u8,
        dmg_taken: u8,
        cash_earnt: u32,
        cash_loss: u32,
        drug_id: u8,
        drug_loss: u32,
    }

    //
    //
    //

    #[derive(Drop, Serde, starknet::Event)]
    struct GameOver {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        #[key]
        leaderboard_version: u16,
        player_name: felt252,
        avatar_id: u8,
        turn: u8,
        cash: u32,
        health: u8,
    }


    #[abi(embed_v0)]
    impl GameImpl of super::IGame<ContractState> {
        fn create_game(
            self: @ContractState, game_mode: GameMode, avatar_id: u8, player_name: felt252
        ) {
            self.assert_valid_name(player_name);
            let game_id = self.world().uuid();
            let player_id = get_caller_address();

            // get leaderboard version
            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            let leaderboard_version = leaderboard_manager.on_game_start();

            let game_config = GameConfigImpl::get(self.world());
            let game = Game {
                game_id,
                player_id,
                leaderboard_version,
                game_mode,
                max_turns: game_config.max_turns,
                max_wanted_shopping: game_config.max_wanted_shopping,
                avatar_id,
                game_over: false
            };

            // save Game
            set!(self.world(), (game));

            // create GameStorePacked
            let game_store = GameStoreImpl::new(
                self.world(), game_id, player_id, game_mode, avatar_id
            );
            let game_store_packed = game_store.pack();

            // save GameStorePacked
            set!(self.world(), (game_store_packed));

            // emit GameCreated
            emit!(self.world(), GameCreated { game_id, player_id, game_mode, player_name });
        }

        fn end_game(
            self: @ContractState, game_id: u32, actions: Span<super::Actions>, player_name: felt252
        ) {
            self.assert_valid_name(player_name);
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            //save & on_game_over
            game_loop::on_game_over(ref game_store, player_name);
        }

        fn travel(
            self: @ContractState,
            game_id: u32,
            next_location: Locations,
            actions: Span<super::Actions>,
            player_name: felt252
        ) {
            self.assert_valid_name(player_name);
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            // check if can travel
            assert(game_store.player.can_continue(), 'player cannot travel');
            assert(next_location != Locations::Home, 'cannot travel to Home');
            assert(game_store.player.location != next_location, 'already at location');

            // execute actions (trades & shop)
            let mut actions = actions;
            self.execute_actions(ref game_store, ref actions);

            let mut randomizer = RandomImpl::new(self.world());

            // save next_location
            game_store.player.next_location = next_location;

            // traveling
            let (is_dead, has_encounter) = game_loop::on_travel(ref game_store, ref randomizer);

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, player_name);
            } else {
                if has_encounter {
                    // save & no end turn
                    let game_store_packed = game_store.pack();
                    set!(self.world(), (game_store_packed));
                } else {
                    // save & on_turn_end
                    game_loop::on_turn_end(ref game_store, ref randomizer,);
                }
            }
        }

        fn decide(
            self: @ContractState,
            game_id: u32,
            action: super::EncounterActions,
            player_name: felt252
        ) {
            self.assert_valid_name(player_name);
            let player_id = get_caller_address();

            let mut game_store = GameStoreImpl::get(self.world(), game_id, player_id);

            // check player status
            assert(game_store.player.can_decide(), 'player cannot decide');

            let mut randomizer = RandomImpl::new(self.world());

            // resolve decision
            let is_dead = traveling::decide(ref game_store, ref randomizer, action);

            // check if dead
            if is_dead {
                // save & gameover RIP
                game_loop::on_game_over(ref game_store, player_name);
            } else {
                // on_turn_end & save
                game_loop::on_turn_end(ref game_store, ref randomizer,);
            };
        }
    }
    #[generate_trait]
    impl InternalImpl<ContractState> of InternalTrait<ContractState> {
        fn assert_valid_name(self: @ContractState, name: felt252) {
            let name_256: u256 = name.into();
            assert(name_256 > 0xffff, 'Name too short');
            assert(name_256 < 0xffffffffffffffffffffffffffffffffffffffff, 'Name too long');
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