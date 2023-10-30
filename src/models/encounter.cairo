use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::database::schema::{
    Enum, Member, Ty, Struct, SchemaIntrospection, serialize_member, serialize_member_type
};

use rollyourown::models::player::Player;
use rollyourown::utils::settings::{EncounterSettings, EncounterSettingsImpl};

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
    payout: u128,
}

#[generate_trait]
impl EncounterImpl of EncounterTrait {
    fn get_or_spawn(
        world: IWorldDispatcher, player: @Player, encounter_id: EncounterType
    ) -> Encounter {
        let mut encounter = get!(
            world, (*player.game_id, *player.player_id, encounter_id), (Encounter)
        );

        let encounter_settings = EncounterSettingsImpl::get(player, encounter.level + 1);
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
                };
            set!(world, (encounter));
        }
        encounter
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


impl EncounterTypeIntrospectionImpl of SchemaIntrospection<EncounterType> {
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

