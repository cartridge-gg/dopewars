use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::location::LocationEnum;


#[starknet::interface]
trait ITravel<TContractState> {
    fn travel(self: @TContractState, game_id: u32, next_location_id: LocationEnum) -> bool;
}


#[starknet::contract]
mod travel {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::location::{Location, LocationTrait, LocationEnum};
    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
    use rollyourown::models::risks::{Risks, RisksTrait};
    use rollyourown::models::drug::{Drug, DrugTrait, DrugEnum};
    use rollyourown::models::market::{Market, MarketTrait};

    use rollyourown::utils::random;
    use rollyourown::utils::market;
    use rollyourown::utils::settings::{RiskSettings, RiskSettingsImpl};


    use super::ITravel;

    #[storage]
    struct Storage {
        world_dispatcher: IWorldDispatcher,
    }

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
            let game = get!(self.world(), game_id, Game);
            assert(game.tick(), 'game cannot progress');

            let player_id = get_caller_address();
            let mut player: Player = get!(self.world(), (game_id, player_id).into(), Player);
            assert(player.can_continue(), 'player cannot travel');
            assert(next_location_id != LocationEnum::Home, 'no way back');
            assert(player.location_id != next_location_id, 'already at location');

            // initial travel when game starts has no risk or events
            if player.location_id != LocationEnum::Home {
                let mut risks: Risks = get!(
                    self.world(), (game_id, next_location_id).into(), Risks
                );
                let mut seed = random::seed();
                let risk_settings = RiskSettingsImpl::get(game.game_mode);

                player.status = risks.travel(seed, risk_settings, player.cash, player.drug_count);
                if player.status != PlayerStatus::Normal {
                    set!(self.world(), (player));
                    emit!(
                        self.world(),
                        AdverseEvent { game_id, player_id, player_status: player.status }
                    );

                    return true;
                }

                // market price variations
                let mut market_events = market::market_variations(self.world(), game_id, player_id);
                // emit events 
                loop {
                    match market_events.pop_front() {
                        Option::Some(event) => {
                            emit!(
                                self.world(),
                                MarketEvent {
                                    game_id: *event.game_id,
                                    location_id: *event.location_id,
                                    drug_id: *event.drug_id,
                                    increase: *event.increase,
                                }
                            );
                        },
                        Option::None => {
                            break;
                        }
                    };
                };

                if player.wanted > risk_settings.wanted_decrease_by_turn {
                    player.wanted -=risk_settings.wanted_decrease_by_turn
                }

                player.turn += 1;
                
            }

            player.location_id = next_location_id;
            set!(self.world(), (player));

            emit!(
                self.world(),
                Traveled {
                    game_id,
                    player_id,
                    from_location: player.location_id,
                    to_location: next_location_id
                }
            );

            false
        }
    }
}

