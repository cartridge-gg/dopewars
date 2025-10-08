use rollyourown::config::drugs::Drugs;
use rollyourown::config::game::GameConfig;
use rollyourown::config::locations::Locations;
use rollyourown::packing::drugs_packed::DrugsPackedImpl;
use rollyourown::packing::game_store::{GameStore, GameStoreTrait};
use rollyourown::packing::markets_packed::{MarketsPackedImpl, MarketsPackedTrait};
use rollyourown::packing::player_layout::{
    PlayerLayout, PlayerLayoutEnumerableImpl, PlayerLayoutPackableImpl,
};
use rollyourown::traits::{Packable, Packer};
use rollyourown::utils::bits::{BitsDefaultImpl, BitsImpl, BitsTrait};
use rollyourown::utils::math::{MathImpl, MathTrait};
use rollyourown::utils::random::{Random, RandomImpl};


// TODO : move
#[derive(Copy, Drop, Serde, PartialEq, IntrospectPacked)]
pub enum PlayerStatus {
    Normal,
    BeingArrested,
    BeingMugged,
}

pub impl PlayerStatusIntoFelt252 of Into<PlayerStatus, felt252> {
    fn into(self: PlayerStatus) -> felt252 {
        match self {
            PlayerStatus::Normal => 'Normal',
            PlayerStatus::BeingArrested => 'BeingArrested',
            PlayerStatus::BeingMugged => 'BeingMugged',
        }
    }
}

pub impl PlayerStatusIntoU8 of Into<PlayerStatus, u8> {
    fn into(self: PlayerStatus) -> u8 {
        match self {
            PlayerStatus::Normal => 0,
            PlayerStatus::BeingArrested => 1,
            PlayerStatus::BeingMugged => 2,
        }
    }
}

pub impl U8IntoPlayerStatus of Into<u8, PlayerStatus> {
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
pub struct Player {
    pub cash: u32,
    pub health: u8,
    pub turn: u8,
    pub status: PlayerStatus,
    pub prev_location: Locations,
    pub location: Locations,
    pub next_location: Locations,
    pub drug_level: u8,
    pub reputation: u8,
    pub traded_million: bool // TODO: remove or find another use ?
}


#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn new(ref game_config: GameConfig) -> Player {
        // create initial player state with game_config
        Player {
            cash: game_config.cash,
            health: game_config.health,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
            drug_level: 0,
            reputation: 0,
            traded_million: false,
        }
    }

    fn empty() -> Player {
        Player {
            cash: 0,
            health: 0,
            turn: 0,
            status: PlayerStatus::Normal,
            prev_location: Locations::Home,
            location: Locations::Home,
            next_location: Locations::Home,
            drug_level: 0,
            reputation: 0,
            traded_million: false,
        }
    }

    #[inline(always)]
    fn is_dead(self: Player) -> bool {
        self.health == 0
    }


    #[inline(always)]
    fn can_trade_drug(self: Player, drug: Drugs) -> bool {
        let drug_id: u8 = drug.into();
        drug_id >= self.drug_level && drug_id < 4 + self.drug_level
    }

    #[inline(always)]
    fn can_decide(self: Player) -> bool {
        self.status == PlayerStatus::BeingArrested || self.status == PlayerStatus::BeingMugged
    }

    #[inline(always)]
    fn health_loss(ref self: Player, amount: u8) {
        self.health = self.health.sub_capped(amount, 0);
    }

    fn level_up_drug(ref self: Player, ref game_store: GameStore, ref randomizer: Random) {
        // level up each rep_drug_step capped to 4
        let mut drug_level: u8 = MathImpl::min(
            self.reputation / game_store.game_config().rep_drug_step, 4,
        );

        // check if already the right level
        if self.drug_level == drug_level {
            return;
        }

        // get drugs
        let drugs = game_store.drugs.get();

        // level up
        if self.drug_level < drug_level {
            // check if not carrying drug to be disabled
            if drugs.quantity > 0 && drugs.drug.into() < drug_level {
                return;
            }
        }

        // level down
        if self.drug_level > drug_level {
            // check if not carrying drug to be disabled
            if drugs.quantity > 0 && drugs.drug.into() >= drug_level + 4 {
                return;
            }
        }

        // update drug level
        game_store.player.drug_level = drug_level;

        // TODO: fix lvl up / down
        // randomize price for new drug
        let drug_slot = drug_level.sub_capped(1, 0);
        game_store.markets.shuffle_drug_prices(ref randomizer, drug_slot);
    }
}

//
//
//

// pack
pub impl PlayerPackerImpl of Packer<Player, felt252> {
    fn pack(self: Player) -> felt252 {
        let mut bits = BitsDefaultImpl::default();
        let mut layout = PlayerLayoutEnumerableImpl::all();

        while let Option::Some(item) = layout.pop_front() {
            match *item {
                PlayerLayout::Cash => { bits.replace::<u32>(item.idx(), item.bits(), self.cash); },
                PlayerLayout::Health => {
                    bits.replace::<u8>(item.idx(), item.bits(), self.health);
                },
                PlayerLayout::Turn => { bits.replace::<u8>(item.idx(), item.bits(), self.turn); },
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
                PlayerLayout::Reputation => {
                    bits.replace::<u8>(item.idx(), item.bits(), self.reputation.into());
                },
            }
        }

        bits.into_felt()
    }
}

// unpack
#[generate_trait]
pub impl PlayerUnpackerImpl of PlayerUnpackerTrait {
    fn unpack(self: felt252) -> Player {
        let mut player = PlayerImpl::empty();
        let mut layout = PlayerLayoutEnumerableImpl::all();
        let bits = BitsImpl::from_felt(self);

        while let Option::Some(item) = layout.pop_front() {
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
                    player.prev_location = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                },
                PlayerLayout::Location => {
                    player.location = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                },
                PlayerLayout::NextLocation => {
                    player.next_location = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                },
                PlayerLayout::DrugLevel => {
                    player.drug_level = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                },
                PlayerLayout::Reputation => {
                    player.reputation = bits.extract_into::<u8>(item.idx(), item.bits()).into();
                },
            };
        }

        player
    }
}

