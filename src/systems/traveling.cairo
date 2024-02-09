use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::{
    models::game::{Game},
    utils::{
        random::{Random, RandomImpl}, math::{MathTrait, MathImplU8},
        events::{RawEventEmitterTrait, RawEventEmitterImpl}
    },
    config::{items::{ItemConfig, ItemSlot, ItemConfigImpl, ItemLevel}, locations::{Locations}},
    packing::{
        game_store::{GameStore}, player::{PlayerImpl, PlayerStatus},
        wanted_packed::{WantedPacked, WantedPackedImpl}, items_packed::{ItemsPackedImpl},
        encounters_packed::{Encounters},
    },
    systems::game::EncounterActions
};


fn on_travel(ref game_store: GameStore, ref randomizer: Random) -> bool {
    // get wanted level at destination 0-7
    let wanted = game_store.wanted.get(game_store.player.next_location);

    if wanted > 3 {
        let encounter_id = if randomizer.bool() {
            Encounters::Gang
        } else {
            Encounters::Cops
        };
        let health_loss = 5;
        let demand_pct = 20;

        // update player status
        game_store.player.status = match encounter_id {
            Encounters::Cops => PlayerStatus::BeingArrested,
            Encounters::Gang => PlayerStatus::BeingMugged,
        };

        // player lose health
        game_store.player.health = game_store.player.health.sub_capped(health_loss, 0);

        // emit TravelEncounter
        game_store
            .world
            .emit_raw(
                array![
                    selector!("TravelEncounter"),
                    Into::<u32, felt252>::into(game_store.game_id),
                    Into::<starknet::ContractAddress, felt252>::into(game_store.player_id).into()
                ],
                array![
                    Into::<Encounters, u8>::into(encounter_id).into(),
                    Into::<u8, felt252>::into(health_loss),
                    Into::<u8, felt252>::into(demand_pct),
                ],
            );

        // todo check if dead

        return true;
    }

    false
}


fn decide(ref game_store: GameStore, ref randomizer: Random, action: EncounterActions) {

    match action {
        EncounterActions::Run => { on_run(ref game_store, ref randomizer); },
        EncounterActions::Pay => { on_pay(ref game_store, ref randomizer); },
        EncounterActions::Fight => { on_fight(ref game_store, ref randomizer); },
    };

    game_store.player.status = PlayerStatus::Normal;

}

fn on_run(ref game_store: GameStore, ref randomizer: Random) {}
fn on_fight(ref game_store: GameStore, ref randomizer: Random) {}
fn on_pay(ref game_store: GameStore, ref randomizer: Random) {}
