use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait ITravel<TContractState> {
    fn travel(
        self: @TContractState, world: IWorldDispatcher, game_id: u32, next_location_id: felt252
    ) -> bool;
}


#[starknet::contract]
mod travel {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use rollyourown::PlayerStatus;
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::location::{Location, LocationTrait};
    use rollyourown::models::player::{Player, PlayerTrait};
    use rollyourown::models::risks::{Risks, RisksTrait};
    use rollyourown::models::drug::{Drug, DrugTrait};
    use rollyourown::models::market::{Market, MarketTrait};


    use rollyourown::utils::random;
    use rollyourown::utils::market;


    use super::ITravel;

    #[storage]
    struct Storage {}

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
        from_location: felt252,
        to_location: felt252,
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
        location_id: felt252,
        drug_id: felt252,
        increase: bool,
    }


    #[external(v0)]
    impl TravelImpl of ITravel<ContractState> {
        // 1. Verify the caller owns the player.
        // 2. Determine if a random travel event occurs and apply it if necessary.
        // 3. Update the players location to the next_location_id.
        // 4. Update the new locations supply based on random events.
        fn travel(
            self: @ContractState, world: IWorldDispatcher, game_id: u32, next_location_id: felt252
        ) -> bool {
            let game = get!(world, game_id, Game);
            assert(game.tick(), 'game cannot progress');

            let player_id = get_caller_address();
            let mut player: Player = get!(world, (game_id, player_id).into(), Player);
            assert(player.can_continue(), 'player cannot travel');
            assert(player.location_id != next_location_id, 'already at location');

            // initial travel when game starts has no risk or events
            if player.location_id != 0 {
                let mut risks: Risks = get!(world, (game_id, next_location_id).into(), Risks);
                let mut seed = random::seed();

                player.status = risks.travel(seed, player.cash, player.drug_count);
                if player.status != PlayerStatus::Normal {
                    set!(world, (player));
                    emit!(world, AdverseEvent { game_id, player_id, player_status: player.status });

                    return true;
                }

                // market price variations
                let mut market_events = market::market_variations(world, game_id);
                // emit events 
                loop {
                    match market_events.pop_front() {
                        Option::Some(event) => {
                            emit!(
                                world,
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

                player.turns_remaining -= 1;
            }

            player.location_id = next_location_id;
            set!(world, (player));

            emit!(
                world,
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

