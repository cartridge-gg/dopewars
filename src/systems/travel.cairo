use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::location::LocationEnum;


#[starknet::interface]
trait ITravel<TContractState> {
    fn travel(self: @TContractState, game_id: u32, next_location_id: LocationEnum) -> bool;
    fn end_game(self: @TContractState, game_id: u32);
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

    use rollyourown::utils::market;
    use rollyourown::utils::settings::{
        RiskSettings, RiskSettingsImpl, DecideSettings, DecideSettingsImpl, EncounterSettings,
        EncounterSettingsImpl
    };
    use rollyourown::utils::risk::{RiskTrait, RiskImpl};
    use rollyourown::utils::math::{MathTrait, MathImplU8};
    use rollyourown::utils::random::{Random, RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};

    use rollyourown::systems::ryo;

    use super::ITravel;
    use super::on_turn_end;

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
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        turn: u32,
        from_location: LocationEnum,
        to_location: LocationEnum,
    }

    #[derive(Drop, starknet::Event)]
    struct AdverseEvent {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        player_status: PlayerStatus,
        health_loss: u8,
        demand_pct: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct AtPawnshop {
        #[key]
        game_id: u32,
        #[key]
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

            let mut randomizer = RandomImpl::new(world);

            // save next_location_id
            player.next_location_id = next_location_id;

            // initial travel when game starts has no risk or events
            if player.turn > 0 {
                let risk_settings = RiskSettingsImpl::get(game.game_mode, @player);

                let encounter_option = risk_settings.travel(world, ref randomizer, @player);

                match encounter_option {
                    Option::Some(encounter) => {
                        // update player status
                        player.status = match encounter.encounter_id {
                            EncounterType::Gang => PlayerStatus::BeingMugged,
                            EncounterType::Cops => PlayerStatus::BeingArrested,
                            EncounterType::Goblin => PlayerStatus::BeingDrugged,
                        };

                        let encounter_settings = EncounterSettingsImpl::get(
                            game.game_mode, @player, encounter.level
                        );

                        // player lose max(encounter_settings.dmg / 3,1)  HP
                        let mut encounter_dmg = if encounter_settings.dmg < 3 {
                            1
                        } else {
                            encounter_settings.dmg / 3
                        };
                        let new_health = player.health.sub_capped(encounter_dmg, 0);
                        let health_loss = player.health - new_health;
                        player.health = new_health;

                        emit!(
                            world,
                            AdverseEvent {
                                game_id,
                                player_id,
                                player_status: player.status,
                                health_loss,
                                demand_pct: encounter.demand_pct
                            }
                        );

                        if player.health == 0 {
                            ryo::game_over(world, ref player);
                        }

                        set!(world, (player));

                        return true;
                    },
                    Option::None => {}
                }
            } else {
                // set hood
                player.hood_id = player.next_location_id;
            }

            on_turn_end(world, ref randomizer, @game, ref player);

            false
        }

        fn end_game(self: @ContractState, game_id: u32) {
            let world = self.world();
            let player_id = get_caller_address();

            let mut player: Player = get!(world, (game_id, player_id).into(), Player);
            assert(player.game_over == false, 'already game_over');
            
            ryo::game_over(self.world(), ref player);

            set!(world, (player));
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
use rollyourown::utils::math::{MathTrait, MathImpl, MathImplU8};
use rollyourown::utils::events::{RawEventEmitterTrait, RawEventEmitterImpl};
use rollyourown::utils::random::{Random};

use super::travel::travel::MarketEvent;

fn on_turn_end(
    world: IWorldDispatcher, ref randomizer: Random, game: @Game, ref player: Player
) -> bool {
    let shop_settings = ShopSettingsImpl::get(*game.game_mode);

    // check if can access pawnshop
    if shop_settings.is_open(@player) {
        if player.status == PlayerStatus::AtPawnshop {
            // exit pawnshop 
            player.status = PlayerStatus::Normal;
        } else {
            // force pawnshop
            player.status = PlayerStatus::AtPawnshop;
            // emit raw event AtPawnshop
            world
                .emit_raw(
                    array![
                        selector!("AtPawnshop"), (*game.game_id).into(), player.player_id.into()
                    ],
                    array![]
                );

            // save player
            set!(world, (player));
            return false;
        };
    }

    // update location
    player.location_id = player.next_location_id;

    let risk_settings = RiskSettingsImpl::get(*game.game_mode, @player);

    // update wanted
    risk_settings.update_wanted(ref player);

    //update HP if not dead
    if player.health > 0 {
        player.health = player.health.add_capped(risk_settings.health_increase_by_turn, 100);
    }

    // update turn
    player.turn += 1;

    // save player
    set!(world, (player));

    // emit raw event Traveled if still alive
    if player.health > 0 {
        world
            .emit_raw(
                array![selector!("Traveled"), (*game.game_id).into(), player.player_id.into()],
                array![
                    (player.turn - 1).into(),
                    player.location_id.into(),
                    player.next_location_id.into()
                ]
            );
    }

    // create lots of events
    // market price variations
    market::market_variations(world, ref randomizer, *game.game_id, player.player_id);

    true
}
