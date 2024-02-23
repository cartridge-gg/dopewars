use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorld, IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    models::game::{Game}, 
    traits::{Enumerable, Packable, Packer, Unpacker},
    config::{locations::Locations, game::GameConfigImpl,  drugs::{Drugs}},
    utils::{
        bits::{Bits, BitsImpl, BitsTrait, BitsDefaultImpl},
        random::{Random, RandomImpl},
        events::{RawEventEmitterTrait, RawEventEmitterImpl},
    },
    packing::{
        game_store::{GameStore},
        player_layout::{PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl},
        drugs_packed::{DrugsPacked, DrugsPackedImpl},
        encounters_packed::{EncountersPacked, EncountersPackedImpl, Encounters},
    },
};


// TODO : move 
#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum PlayerStatus {
    Normal,
    BeingArrested,
    BeingMugged,
}

impl PlayerStatusIntoFelt252 of Into<PlayerStatus, felt252> {
    fn into(self: PlayerStatus) -> felt252 {
        match self {
            PlayerStatus::Normal => 'Normal',
            PlayerStatus::BeingArrested => 'BeingArrested',
            PlayerStatus::BeingMugged => 'BeingMugged',
        }
    }
}

impl PlayerStatusIntoU8 of Into<PlayerStatus, u8> {
    fn into(self: PlayerStatus) -> u8 {
        match self {
            PlayerStatus::Normal => 0,
            PlayerStatus::BeingArrested => 1,
            PlayerStatus::BeingMugged => 2,
        }
    }
}

impl U8IntoPlayerStatus of Into<u8, PlayerStatus> {
    fn into(self: u8) -> PlayerStatus {
        let self252: felt252 = self.into();
        match self252 {
            0 => PlayerStatus::Normal,
            1 => PlayerStatus::BeingArrested,
            2 => PlayerStatus::BeingMugged,
            _ => PlayerStatus::Normal,
        }
    }
}

//
//
//

#[derive(Copy, Drop, Serde)]
struct Player {
    world: IWorldDispatcher,
    game: Game,
    //
    cash: u32,
    health: u8,
    turn: u8,
    status: PlayerStatus,
    prev_location: Locations,
    location: Locations,
    next_location: Locations,
    drug_level: u8,
}



#[generate_trait]
impl PlayerImpl of PlayerTrait {
    fn new(world: IWorldDispatcher, game: Game) -> Player {
        // create initial player state with game_config
        let game_config = GameConfigImpl::get(world);
        Player {
            world,
            game,
            //
            cash: game_config.cash,
            health: game_config.health,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
            drug_level:0,
        }
    }

    fn with(world: IWorldDispatcher, game: Game) -> Player {
        // create initial player state with world, game
        Player {
            world,
            game,
            //
            cash: 0,
            health: 0,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
            drug_level:0,
        }
    }

    fn is_dead(self: Player) -> bool {
        self.health == 0 
    }

    fn can_continue(self: Player) -> bool {
        if self.health == 0 {
            return false;
        }
        if self.status != PlayerStatus::Normal {
            return false;
        }

        if self.turn == self.game.max_turns {
            return false;
        }
        if self.game.game_over {
            return false;
        }

        true
    }

    fn can_trade(self: Player) -> bool {
        if self.health == 0 {
            return false;
        }
        if self.status != PlayerStatus::Normal {
            return false;
        }

        if self.game.game_over {
            return false;
        }

        true
    }

    fn can_trade_drug(self: Player, drug: Drugs) -> bool {
        let drug_id: u8 = drug.into();
        drug_id >= self.drug_level && drug_id < 4 + self.drug_level
    }

    #[inline(always)]
    fn can_decide(self: Player) -> bool {
        self.status == PlayerStatus::BeingArrested || self.status == PlayerStatus::BeingMugged
    }

    fn level_up_drug(ref self: Player, drugs_packed: DrugsPacked, encounters_packed: EncountersPacked) {
        if self.drug_level == 2 { return ;};

        let drugs = drugs_packed.get();

        let cops_level = encounters_packed.get_encounter_level(Encounters::Cops);
        let gang_level = encounters_packed.get_encounter_level(Encounters::Gang);

        if self.drug_level < 1 && cops_level + gang_level > 4 {
            // check if not carrying Ludes
            if drugs.drug != Drugs::Ludes || (drugs.drug == Drugs::Ludes && drugs.quantity == 0 ){
                // Ludes -> Heroin
                self.drug_level = 1;
                // gibe player some HP ?
                self.health += 2;
            }
        } else if self.drug_level < 2 && cops_level + gang_level > 8 {
            // check if not carrying Speed or Ludes
            if (drugs.drug != Drugs::Speed || (drugs.drug == Drugs::Speed && drugs.quantity == 0 )) ||
                (drugs.drug != Drugs::Ludes || (drugs.drug == Drugs::Ludes && drugs.quantity == 0 )) {
                // Speed -> Cocaine
                self.drug_level = 2;
                // gibe player some HP ?
                self.health += 5;
            }
        }
    }

    fn hustle(self: Player,ref game_store: GameStore, ref randomizer: Random) {

        let og_id = randomizer.between::<u16>(0, 30_000);

         // emit raw event MeetOG 
        if og_id < 500 {
            game_store
                .world
                .emit_raw(
                    array![
                        selector!("MeetOG"),
                        Into::<u32, felt252>::into(game_store.game.game_id),
                        Into::<starknet::ContractAddress, felt252>::into(game_store.game.player_id).into()
                    ],
                    array![
                        Into::<u16, felt252>::into(og_id),
                    ]
                );
        };
    }
}

//
//
//

// pack 
impl PlayerPackerImpl of Packer<Player, felt252> {
    fn pack(self: Player) -> felt252 {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = PlayerLayoutEnumerableImpl::all();

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    match *item {
                        PlayerLayout::Cash => {
                            bits.replace::<u32>(item.idx(), item.bits(), self.cash);
                        },
                        PlayerLayout::Health => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.health);
                        },
                        PlayerLayout::Turn => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.turn);
                        },
                        PlayerLayout::Status => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.status.into());
                        },
                        PlayerLayout::PrevLocation => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.prev_location.into());
                        },
                        PlayerLayout::Location => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.location.into());
                        },
                        PlayerLayout::NextLocation => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.next_location.into());
                        },
                        PlayerLayout::DrugLevel => {
                            bits.replace::<u8>(item.idx(), item.bits(), self.drug_level.into());
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        bits.into_felt()
    }
}

// unpack 
impl PlayerUnpackerImpl of Unpacker<felt252, Player> {
    fn unpack(
        self: felt252, world: IWorldDispatcher, game: Game,
    ) -> Player {
        let mut player = PlayerImpl::with(world, game);
        let mut layout = PlayerLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self);

        loop {
            match layout.pop_front() {
                Option::Some(item) => {
                    match *item {
                        PlayerLayout::Cash => {
                            player.cash = bits.extract_into::<u32>(item.idx(), item.bits());
                        },
                        PlayerLayout::Health => {
                            player.health = bits.extract_into::<u8>(item.idx(), item.bits());
                        },
                        PlayerLayout::Turn => {
                            player.turn = bits.extract_into::<u8>(item.idx(), item.bits());
                        },
                        PlayerLayout::Status => {
                            player.status = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                        },
                        PlayerLayout::PrevLocation => {
                            player
                                .prev_location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                        PlayerLayout::Location => {
                            player
                                .location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                        PlayerLayout::NextLocation => {
                            player
                                .next_location = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                        PlayerLayout::DrugLevel => {
                            player
                                .drug_level = bits
                                .extract_into::<u8>(item.idx(), item.bits())
                                .into();
                        },
                    };
                },
                Option::None => { break; },
            };
        };

        player
    }
}

