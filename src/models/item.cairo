use starknet::ContractAddress;
use dojo::database::introspect::{
    Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type
};

#[derive(Model, Copy, Drop, Serde)]
struct Item {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    #[key]
    item_id: ItemEnum,
    level: u8,
    name: felt252,
    value: usize,
    tier: ItemTier,
    stat: ItemEnum,
    newName: ItemName,
}

#[derive(Copy, Drop, Serde, PartialEq)]
enum ItemEnum {
    Attack, // allow to fight cops/ gangs
    Defense, // reduced dmgs taken by %
    Transport, // increase drug nb transportable
    Speed, // increase run away chances by %
// Style
}

#[derive(Copy, Drop, Serde, Introspect)]
enum ItemTier {
    Tier1,
    Tier2,
    Tier3,
    Tier4,
    Tier5,
    Tier6,
}

#[derive(Copy, Drop, Serde, Introspect)]
enum ItemName {
    Chain,
    BaseballBat,
    AK47,
    BloodStainedShirt,
    TrenchCoat,
    BulletProofVest,
    AllBlackSneakers,
    AthleticTrainers,
    WorkBoots,
    PlasticBag,
}

trait ItemMeta {
    fn initial_tier(self: ItemName) -> ItemTier;
    fn impacting_stat(self: ItemName) -> ItemEnum;
    fn name(self: ItemName) -> felt252;
}

impl ItemMetaImpl of ItemMeta {
    fn initial_tier(self: ItemName) -> ItemTier {
        match self {
            ItemName::Chain => ItemTier::Tier1,
            ItemName::BaseballBat => ItemTier::Tier2,
            ItemName::AK47 => ItemTier::Tier3,
            ItemName::BloodStainedShirt => ItemTier::Tier1,
            ItemName::TrenchCoat => ItemTier::Tier2,
            ItemName::BulletProofVest => ItemTier::Tier3,
            ItemName::AllBlackSneakers => ItemTier::Tier2,
            ItemName::AthleticTrainers => ItemTier::Tier2,
            ItemName::WorkBoots => ItemTier::Tier2,
            ItemName::PlasticBag => ItemTier::Tier2,
        }
    }

    fn impacting_stat(self: ItemName) -> ItemEnum {
        match self {
            ItemName::Chain => ItemEnum::Attack,
            ItemName::BaseballBat => ItemEnum::Attack,
            ItemName::AK47 => ItemEnum::Attack,
            ItemName::BloodStainedShirt => ItemEnum::Defense,
            ItemName::TrenchCoat => ItemEnum::Defense,
            ItemName::BulletProofVest => ItemEnum::Defense,
            ItemName::AllBlackSneakers => ItemEnum::Speed,
            ItemName::AthleticTrainers => ItemEnum::Speed,
            ItemName::WorkBoots => ItemEnum::Speed,
            ItemName::PlasticBag => ItemEnum::Transport,
        }
    }

    fn name(self: ItemName) -> felt252 {
        match self {
            ItemName::Chain => 'Chain',
            ItemName::BaseballBat => 'Baseball Bat',
            ItemName::AK47 => 'AK 47',
            ItemName::BloodStainedShirt => 'Blood Stained Shirt',
            ItemName::TrenchCoat => 'Trench Coat',
            ItemName::BulletProofVest => 'Bullet Proof Vest',
            ItemName::AllBlackSneakers => 'All-Black Sneakers',
            ItemName::AthleticTrainers => 'Athletic Trainers',
            ItemName::WorkBoots => 'Work Boots',
            ItemName::PlasticBag => 'Plastic Bag',
        }
    }
}

impl ItemEnumIntoFelt252 of Into<ItemEnum, felt252> {
    fn into(self: ItemEnum) -> felt252 {
        match self {
            ItemEnum::Attack => 'Attack',
            ItemEnum::Defense => 'Defense',
            ItemEnum::Transport => 'Transport',
            ItemEnum::Speed => 'Speed',
        }
    }
}

impl ItemEnumIntoU32 of Into<ItemEnum, u32> {
    fn into(self: ItemEnum) -> u32 {
        match self {
            ItemEnum::Attack => 0,
            ItemEnum::Defense => 1,
            ItemEnum::Transport => 2,
            ItemEnum::Speed => 3,
        }
    }
}


impl LocationEnumIntrospectionImpl of Introspect<ItemEnum> {
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
                name: 'ItemEnum',
                attrs: array![].span(),
                children: array![
                    ('Attack', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Defense', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Transport', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('Speed', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
                    .span()
            }
        )
    }
}


#[generate_trait]
impl ItemImpl of ItemTrait {
    fn all() -> Span<ItemEnum> {
        let mut items = array![
            ItemEnum::Attack, ItemEnum::Defense, ItemEnum::Transport, ItemEnum::Speed,
        ];
        items.span()
    }
}

