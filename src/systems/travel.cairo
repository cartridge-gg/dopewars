use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::location::LocationEnum;

#[starknet::interface]
trait ITravel<TContractState> {
    fn travel(self: @TContractState, game_id: u32, next_location_id: LocationEnum) -> bool;
}

#[dojo::contract]
mod travel {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::location::{Location, LocationTrait, LocationEnum};
    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
    use rollyourown::models::drug::{Drug, DrugTrait, DrugEnum};
    use rollyourown::models::market::{Market, MarketTrait};
    use rollyourown::models::encounter::{Encounter, EncounterType};


    use rollyourown::utils::random;
    use rollyourown::utils::market;
    use rollyourown::utils::settings::{
        RiskSettings, RiskSettingsImpl, DecideSettings, DecideSettingsImpl, EncounterSettings,
        EncounterSettingsImpl
    };
    use rollyourown::utils::risk::{RiskTrait, RiskImpl};

    use super::ITravel;
    use super::on_turn_end;

    #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            self.world_dispatcher.read()
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Traveled: Traveled,
        AdverseEvent: AdverseEvent,
        MarketEvent: MarketEvent,
        AtPawnshop: AtPawnshop,
    }

    #[derive(Drop, starknet::Event)]
    struct Traveled {
        game_id: u32,
        player_id: ContractAddress,
        from_location: LocationEnum,
        to_location: LocationEnum,
    }

    #[derive(Drop, starknet::Event)]
    struct AdverseEvent {
        game_id: u32,
        player_id: ContractAddress,
        player_status: PlayerStatus,
        health_loss: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct AtPawnshop {
        game_id: u32,
        player_id: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct MarketEvent {
        game_id: u32,
        location_id: LocationEnum,
        drug_id: DrugEnum,
        increase: bool,
    }

    #[external(v0)]
    impl TravelImpl of ITravel<ContractState> {
        // 1. Verify the caller owns the player.
        // 2. Determine if a random travel event occurs and apply it if necessary.
        // 3. Update the players location to the next_location_id.
        // 4. Update the new locations supply based on random events.
        fn travel(self: @ContractState, game_id: u32, next_location_id: LocationEnum) -> bool {
            let world = self.world();
            let game = get!(world, game_id, Game);
            assert(game.tick(), 'game cannot progress');

            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id).into(), Player);

            assert(player.can_continue(), 'player cannot travel');
            assert(next_location_id != LocationEnum::Home, 'cannot travel to Home');
            assert(player.location_id != next_location_id, 'already at location');

            // save next_location_id
            player.next_location_id = next_location_id;

            // initial travel when game starts has no risk or events
            if player.turn > 0 {
                let mut seed = random::seed();
                let risk_settings = RiskSettingsImpl::get(game.game_mode, @player);

                let encounter_option = risk_settings.travel(world, seed, @player);

                match encounter_option {
                    Option::Some(encounter) => {
                        // update player status
                        player.status = match encounter.encounter_id {
                            EncounterType::Gang => PlayerStatus::BeingMugged,
                            EncounterType::Cops => PlayerStatus::BeingArrested
                        };

                        let encounter_settings = EncounterSettingsImpl::get(
                            @player, encounter.level
                        );

                        //player lose some HP
                        let mut health_loss = if (encounter_settings.dmg / 2) >= player.health {
                            player.health - 1
                        } else {
                            encounter_settings.dmg / 2
                        };
                        player.health -= health_loss;

                        set!(world, (player));
                        emit!(
                            world,
                            AdverseEvent {
                                game_id, player_id, player_status: player.status, health_loss
                            }
                        );

                        return true;
                    },
                    Option::None => {}
                }

                on_turn_end(world, @game, ref player);
            } else {
                on_turn_end(world, @game, ref player);
            }

            set!(world, (player));

            false
        }
    }
}

use rollyourown::models::game::{Game};
use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
use rollyourown::utils::settings::{RiskSettings, RiskSettingsImpl};
use rollyourown::utils::settings::{ShopSettings, ShopSettingsImpl};
use rollyourown::utils::shop::ShopImpl;
use rollyourown::utils::risk::{RiskTrait, RiskImpl};
use rollyourown::utils::market;
use super::travel::travel::MarketEvent;

fn on_turn_end(world: IWorldDispatcher, game: @Game, ref player: Player) -> bool {
    let shop_settings = ShopSettingsImpl::get(*game.game_mode);

    // check if can access pawnshop
    if shop_settings.is_open(@player) {
        if player.status == PlayerStatus::AtPawnshop {
            // exit pawnshop 
            player.status = PlayerStatus::Normal;
        } else {
            // force pawnshop
            player.status = PlayerStatus::AtPawnshop;

            // emit raw event
            let mut keys = array![selector!("AtPawnshop")];
            let mut values: Array<felt252> = array![
                (*game.game_id).into(), player.player_id.into()
            ];
            world.emit(keys, values.span());

            return false;
        };
    }

    // update location
    player.location_id = player.next_location_id;

    //  emit!(
    //             world,
    //             Traveled {
    //                 game_id,
    //                 player_id,
    //                 from_location: player.location_id,
    //                 to_location: next_location_id
    //             }
    //         );

    let risk_settings = RiskSettingsImpl::get(*game.game_mode, @player);

    // market price variations
    market::market_variations(world, *game.game_id, player.player_id);

    // update wanted
    risk_settings.update_wanted(ref player);

    // update HP if not dead
    if player.health > 0 {
        if player.health + 1 >= 100 {
            player.health = 100;
        } else {
            player.health += 1;
        }
    }

    // update turn
    player.turn += 1;

    true
}
