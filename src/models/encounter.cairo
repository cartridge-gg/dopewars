use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::database::introspect::{  Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type};

use rollyourown::models::player::Player;
use rollyourown::models::game::Game;
use rollyourown::utils::settings::{EncounterSettings, EncounterSettingsImpl};
use rollyourown::utils::random::{Random, RandomImpl, RandomTrait};

#[derive(Model, Copy, Drop, Serde)]
struct Encounter {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    encounter_id: EncounterType,
    level: u8,
    health: u8,
    payout: u32,
    demand_pct: u8,
}

#[generate_trait]
impl EncounterImpl of EncounterTrait {
    fn get_or_spawn(
        world: IWorldDispatcher,
        player: @Player,
        ref randomizer: Random,
        encounter_id: EncounterType
    ) -> Encounter {
        let mut encounter = get!(
            world, (*player.game_id, *player.player_id, encounter_id), (Encounter)
        );
        let game = get!(world, (*player.game_id), (Game));

        let encounter_settings = EncounterSettingsImpl::get(
            game.game_mode, player, encounter.level + 1
        );
        if encounter.level == 0 {
            // first meet, spawn new Encounter
            encounter =
                Encounter {
                    game_id: *player.game_id,
                    player_id: *player.player_id,
                    encounter_id,
                    level: encounter_settings.level,
                    health: encounter_settings.health,
                    payout: encounter_settings.payout,
                    demand_pct: RandomDemandTrait::random(ref randomizer)
                };
            set!(world, (encounter));
        } else if encounter.health == 0 {
            // spawn next lvl encounter
            encounter =
                Encounter {
                    game_id: *player.game_id,
                    player_id: *player.player_id,
                    encounter_id,
                    level: encounter_settings.level,
                    health: encounter_settings.health,
                    payout: encounter_settings.payout,
                    demand_pct: RandomDemandTrait::random(ref randomizer)
                };
            set!(world, (encounter));
        }
        encounter
    }
}

struct RandomDemand {}

#[generate_trait]
impl RandomDemandImpl of RandomDemandTrait {
    fn random(ref randomizer: Random) -> u8 {
        let mut rand = randomizer.between::<u8>(0, 100);
        if rand < 2 {
            69
        } else if rand < 20 {
            50
        } else if rand < 50 {
            30
        } else {
            20
        }
    }
}


#[derive(Copy, Drop, Serde, PartialEq)]
enum EncounterType {
    Gang,
    Cops,
}

impl EncounterTypeIntoFelt252 of Into<EncounterType, felt252> {
    fn into(self: EncounterType) -> felt252 {
        match self {
            EncounterType::Gang => 'Gang',
            EncounterType::Cops => 'Cops',
        }
    }
}

impl EncounterTypeIntoU8 of Into<EncounterType, u8> {
    fn into(self: EncounterType) -> u8 {
        match self {
            EncounterType::Gang => 0,
            EncounterType::Cops => 1,
        }
    }
}


impl EncounterTypeIntrospectionImpl of Introspect<EncounterType> {
    #[inline(always)]
    fn size() -> usize {
        1
    }

    #[inline(always)]
    fn layout(ref layout: Array<u8>) {
        layout.append(8);
    }

    #[inline(always)]
    fn ty() -> Ty {
        Ty::Enum(
            Enum {
                name: 'EncounterType',
                attrs: array![].span(),
                children: array![
                    ('Gang', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Cops', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}

