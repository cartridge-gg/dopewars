use rollyourown::{
    systems::game::{Actions},
    config::locations::{Locations}
};
use starknet::ContractAddress;

#[starknet::interface]
trait ITravel<T> {
    fn travel(self: @T, game_id: u32, next_location: Locations, actions: Span<Actions>);
}

#[dojo::contract]
mod travel {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::event::EventStorage;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use dojo::world::{WorldStorage};

    use rollyourown::{
        config::{
            ryo::{RyoConfig}, ryo_address::{RyoAddress},
            locations::{Locations},
        },
        packing::{game_store::{GameStore, GameStoreImpl}, player::{Player, PlayerImpl}},
        store::{Store, StoreImpl, StoreTrait},
        systems::{
            game::{Actions, EncounterActions},
            helpers::{game_loop, shopping, trading, traveling, traveling::EncounterOutcomes},
        },
        utils::{bytes16::{Bytes16, Bytes16Impl, Bytes16Trait}, random::{Random, RandomImpl}},
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    #[abi(embed_v0)]
    impl TravelImpl of super::ITravel<ContractState> {
        fn travel(self: @ContractState, game_id: u32, next_location: Locations, actions: Span<Actions>) {
            // ensure caller is the game system
            let world = self.world(@"dopewars");
            let (game_system_address, _) = world.dns(@"game").unwrap();
            assert!(
                get_caller_address() == game_system_address,
                "caller must be the game system",
            );

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
            self: @ContractState, ref game_store: GameStore, ref actions: Span<Actions>,
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
