#[system]
mod travel {
    use starknet::ContractAddress;

    use dojo::world::{Context};

    use rollyourown::PlayerStatus;
    use rollyourown::components::{game::{Game, GameTrait}, location::Location};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::risks::{Risks, RisksTrait};

    use super::market_events;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Traveled: Traveled,
        AdverseEvent: AdverseEvent,
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


    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(ctx: Context, game_id: u32, next_location_id: felt252) -> bool {
        let game = get!(ctx.world, game_id, Game);
        assert(game.tick(), 'game cannot progress');

        let player_id = ctx.origin;
        let mut player: Player = get!(ctx.world, (game_id, player_id).into(), Player);
        assert(player.can_continue(), 'player cannot travel');
        assert(player.location_id != next_location_id, 'already at location');

        // initial travel when game starts has no risk or events
        if player.location_id != 0 {
            let mut risks: Risks = get!(ctx.world, (game_id, next_location_id).into(), Risks);
            let seed = starknet::get_tx_info().unbox().transaction_hash;
            player.status = risks.travel(seed, player.cash, player.drug_count);
            if player.status != PlayerStatus::Normal {
                set!(ctx.world, (player));
                emit!(ctx.world, AdverseEvent { game_id, player_id, player_status: player.status });

                return true;
            }

            //market price fluctuation
            market_events(ctx, game_id);

            player.turns_remaining -= 1;
        }

        player.location_id = next_location_id;
        set!(ctx.world, (player));

        emit!(
            ctx.world,
            Traveled {
                game_id, player_id, from_location: player.location_id, to_location: next_location_id
            }
        );

        false
    }
}

use dojo::world::{Context, IWorld, IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::components::drug::{Drug, DrugTrait};
use rollyourown::components::location::{Location, LocationTrait};
use rollyourown::components::market::{Market, MarketTrait};
use rollyourown::constants::{PRICE_VAR, MIN_PRICE_VAR, MAX_PRICE_VAR, MAX_EXTRA_PRICE_VAR};
use rollyourown::utils::random;

fn market_events(ctx: Context, game_id: u32) {
    let mut locations = LocationTrait::all();
    loop {
        match locations.pop_front() {
            Option::Some(location_id) => {
                let mut seed = starknet::get_tx_info().unbox().transaction_hash;
                seed = pedersen::pedersen(seed, *location_id);

                let mut drugs = DrugTrait::all();
                loop {
                    match drugs.pop_front() {
                        Option::Some(drug_id) => {
                            seed = pedersen::pedersen(seed, *drug_id);
                            let rand = random(seed, 0, 100);
                            let pricing_infos = MarketTrait::get_pricing_info(*drug_id);
                            if rand <= PRICE_VAR.into() {
                                // increase price
                                let market = get!(
                                    ctx.world, (game_id, *location_id, *drug_id), (Market)
                                );

                                let increase_by = random(
                                    seed + 1, MIN_PRICE_VAR.into(), MAX_PRICE_VAR.into()
                                );

                                let market_price = market.cash
                                    / Into::<usize, u128>::into(market.quantity);
                                let target_price = market_price * (100 + increase_by) / 100;
                                if target_price < (pricing_infos.max_price
                                    * (100 + MAX_EXTRA_PRICE_VAR.into())
                                    / 100) {
                                    // increase price by increase_by %
                                    let target_cash = Into::<usize, u128>::into(market.quantity)
                                        * target_price;

                                    // update cash in market
                                    set!(
                                        ctx.world,
                                        (Market {
                                            game_id,
                                            location_id: *location_id,
                                            drug_id: *drug_id,
                                            cash: target_cash,
                                            quantity: market.quantity
                                        })
                                    );
                                }
                            } else if rand >= (100 - PRICE_VAR).into() {
                                // decrease price
                                let market = get!(
                                    ctx.world, (game_id, *location_id, *drug_id), (Market)
                                );

                                let decrease_by = random(
                                    seed + 1, MIN_PRICE_VAR.into(), MAX_PRICE_VAR.into()
                                );

                                let market_price = market.cash
                                    / Into::<usize, u128>::into(market.quantity);
                                let target_price = market_price * (100 - decrease_by) / 100;
                                if target_price > (pricing_infos.min_price
                                    * (100 + MAX_EXTRA_PRICE_VAR.into())
                                    / 100) {
                                    // decrease price by decrease_by %
                                    let target_cash = Into::<usize, u128>::into(market.quantity)
                                        * target_price;

                                    // update cash in market
                                    set!(
                                        ctx.world,
                                        (Market {
                                            game_id,
                                            location_id: *location_id,
                                            drug_id: *drug_id,
                                            cash: target_cash,
                                            quantity: market.quantity
                                        })
                                    );
                                }
                            }
                        },
                        Option::None(()) => {
                            break ();
                        }
                    };
                };
            },
            Option::None(_) => {
                break ();
            }
        };
    };
}
