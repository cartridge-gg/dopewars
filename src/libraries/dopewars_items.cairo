use rollyourown::config::hustlers::ItemSlot;


#[derive(Debug, Drop, Clone, Serde, Introspect)]
pub struct ItemTierConfig {
    pub stat: u16,
    pub cost: u32,
}

#[starknet::interface]
pub trait IDopewarsItems<T> {
    fn get_item_tier(self: @T, slot_id: u8, item_id: u8) -> u8;
    fn get_tier_config(self: @T, slot_id: u8, tier: u8) -> Array<ItemTierConfig>;
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct DopewarsItemTier {
    #[key]
    pub slot_id: u8,
    #[key]
    pub item_id: u8,
    pub tier: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct DopewarsItemTierConfig {
    #[key]
    pub slot_id: u8,
    #[key]
    pub tier: u8,
    pub levels: Array<ItemTierConfig>,
}

#[dojo::library]
pub mod DopewarsItems {
    use super::{IDopewarsItems, ItemTierConfig};

    #[abi(embed_v0)]
    pub impl DopewarsItemsImpl of IDopewarsItems<ContractState> {
        fn get_item_tier(self: @ContractState, slot_id: u8, item_id: u8) -> u8 {
            match slot_id {
                0 => {
                    match item_id {
                        0 => 3, // 'Pocket Knife', // 0
                        1 => 2, // 'Chain', // 1
                        2 => 3, // 'Knife', // 2
                        3 => 3, // 'Crowbar', // 3
                        4 => 1, // 'Handgun', // 4
                        5 => 1, // 'AK47', // 5
                        6 => 2, // 'Shovel', // 6
                        7 => 2, // 'Baseball Bat', // 7
                        8 => 3, // 'Tire Iron', // 8
                        9 => 3, // 'Police Baton', // 9
                        10 => 2, // 'Pepper Spray', // 10
                        11 => 3, // 'Razor Blade', // 11
                        12 => 1, // 'Drone', // 12
                        13 => 2, // 'Taser', // 13
                        14 => 3, // 'Brass Knuckles', // 14
                        15 => 1, // 'Shotgun', // 15
                        16 => 1, // 'Glock', // 16
                        17 => 1, // 'Uzi' // 17
                        _ => panic!("invalid weapon id"),
                    }
                },
                1 => {
                    match item_id {
                        0 => 3, // 'White T Shirt', // 0
                        1 => 3, // 'Black T Shirt', // 1
                        2 => 2, // 'White Hoodie', // 2
                        3 => 2, // 'Black Hoodie', // 3
                        4 => 1, // 'Bulletproof Vest', // 4
                        5 => 1, // '3 Piece Suit', // 5
                        6 => 3, // 'Checkered Shirt', // 6
                        7 => 3, // 'Bikini', // 7
                        8 => 2, // 'Golden Shirt', // 8
                        9 => 2, // 'Leather Vest', // 9
                        10 => 1, // 'Blood Stained Shirt', // 10
                        11 => 1, // 'Police Uniform', // 11
                        12 => 1, // 'Combat Jacket', // 12
                        13 => 2, // 'Basketball Jersey', // 13
                        14 => 2, // 'Track Suit', // 14
                        15 => 1, // 'Trenchcoat', // 15
                        16 => 1, // 'White Tank Top', // 16
                        17 => 1, // 'Black Tank Top', // 17
                        18 => 3, // 'Shirtless', // 18
                        19 => 3, // 'Naked' // 19
                        _ => panic!("invalid clothe id"),
                    }
                },
                2 => {
                    match item_id {
                        0 => 1, // 'Dodge', // 0
                        1 => 1, // 'Porsche', // 1
                        2 => 3, // 'Tricycle', // 2
                        3 => 3, // 'Scooter', // 3
                        4 => 2, // 'ATV', // 4
                        5 => 3, // 'Push Bike', // 5
                        6 => 2, // 'Electric Scooter', // 6
                        7 => 3, // 'Golf Cart', // 7
                        8 => 2, // 'Chopper', // 8
                        9 => 3, // 'Rollerblades', // 9
                        10 => 1, // 'Lowrider', // 10
                        11 => 1, // 'Camper', // 11
                        12 => 1, // 'Rolls Royce', // 12
                        13 => 2, // 'BMW M3', // 13
                        14 => 3, // 'Bike', // 14
                        15 => 2, // 'C63 AMG', // 15
                        16 => 1, // 'G Wagon' // 16
                        _ => panic!("invalid transport id"),
                    }
                },
                3 => panic!("invalid slot"),
                4 => panic!("invalid slot"),
                5 => {
                    match item_id {
                        0 => 1, // 'Black Air Force 1s', // 0
                        1 => 1, // 'White Forces', // 1
                        2 => 1, // 'Air Jordan 1 Chicagos', // 2
                        3 => 1, // 'Gucci Tennis 84', // 3
                        4 => 1, // 'Air Max 95', // 4
                        5 => 2, // 'Timberlands', // 5
                        6 => 1, // 'Reebok Classics', // 6
                        7 => 3, // 'Flip Flops', // 7
                        8 => 1, // 'Nike Cortez', // 8
                        9 => 3, // 'Dress Shoes', // 9
                        10 => 2, // 'Converse All Stars', // 10
                        11 => 2, // 'White Slippers', // 11
                        12 => 2, // 'Gucci Slides', // 12
                        13 => 3, // 'Alligator Dress Shoes', // 13
                        14 => 3, // 'Socks', // 14
                        15 => 3, // 'Open Toe Sandals', // 15
                        16 => 3, // 'Barefoot' // 16
                        _ => panic!("invalid feet id"),
                    }
                },
                _ => panic!("invalid slot"),
            }
        }

        fn get_tier_config(self: @ContractState, slot_id: u8, tier: u8) -> Array<ItemTierConfig> {
            match slot_id {
                0 => {
                    // Weapon
                    match tier {
                        0 => panic!("invalid tier"),
                        1 => array![
                            ItemTierConfig { stat: 10, cost: 0 },
                            ItemTierConfig { stat: 25, cost: 1_050 },
                            ItemTierConfig { stat: 50, cost: 17_500 },
                            ItemTierConfig { stat: 80, cost: 210_000 },
                        ],
                        2 => array![
                            ItemTierConfig { stat: 12, cost: 0 },
                            ItemTierConfig { stat: 28, cost: 1_120 },
                            ItemTierConfig { stat: 45, cost: 11_900 },
                            ItemTierConfig { stat: 70, cost: 175_000 },
                        ],
                        3 => array![
                            ItemTierConfig { stat: 14, cost: 0 },
                            ItemTierConfig { stat: 30, cost: 1_120 },
                            ItemTierConfig { stat: 40, cost: 7_000 },
                            ItemTierConfig { stat: 60, cost: 140_000 },
                        ],
                        _ => panic!("invalid tier"),
                    }
                },
                1 => {
                    // Clothe
                    match tier {
                        0 => panic!("invalid tier"),
                        1 => array![
                            ItemTierConfig { stat: 10, cost: 0 },
                            ItemTierConfig { stat: 22, cost: 960 },
                            ItemTierConfig { stat: 48, cost: 20_800 },
                            ItemTierConfig { stat: 75, cost: 216_000 },
                        ],
                        2 => array![
                            ItemTierConfig { stat: 12, cost: 0 },
                            ItemTierConfig { stat: 26, cost: 1_120 },
                            ItemTierConfig { stat: 45, cost: 15_200 },
                            ItemTierConfig { stat: 70, cost: 200_000 },
                        ],
                        3 => array![
                            ItemTierConfig { stat: 14, cost: 0 },
                            ItemTierConfig { stat: 30, cost: 1_280 },
                            ItemTierConfig { stat: 42, cost: 9_600 },
                            ItemTierConfig { stat: 65, cost: 184_000 },
                        ],
                        _ => panic!("invalid tier"),
                    }
                },
                2 => {
                    // Vehicle
                    match tier {
                        0 => panic!("invalid tier"),
                        1 => array![
                            ItemTierConfig { stat: 900, cost: 0 },
                            ItemTierConfig { stat: 1300, cost: 800 },
                            ItemTierConfig { stat: 3200, cost: 38_000 },
                            ItemTierConfig { stat: 5500, cost: 253_000 },
                        ],
                        2 => array![
                            ItemTierConfig { stat: 1000, cost: 0 },
                            ItemTierConfig { stat: 1500, cost: 1_000 },
                            ItemTierConfig { stat: 3000, cost: 30_000 },
                            ItemTierConfig { stat: 5000, cost: 220_000 },
                        ],
                        3 => array![
                            ItemTierConfig { stat: 1100, cost: 0 },
                            ItemTierConfig { stat: 1700, cost: 1_200 },
                            ItemTierConfig { stat: 2800, cost: 22_000 },
                            ItemTierConfig { stat: 4500, cost: 187_000 },
                        ],
                        _ => panic!("invalid tier"),
                    }
                },
                3 => panic!("invalid slot"),
                4 => panic!("invalid slot"),
                5 => {
                    // Foot
                    match tier {
                        0 => panic!("invalid tier"),
                        1 => array![
                            ItemTierConfig { stat: 6, cost: 0 },
                            ItemTierConfig { stat: 14, cost: 880 },
                            ItemTierConfig { stat: 36, cost: 24_200 },
                            ItemTierConfig { stat: 54, cost: 198_000 },
                        ],
                        2 => array![
                            ItemTierConfig { stat: 8, cost: 0 },
                            ItemTierConfig { stat: 18, cost: 1_100 },
                            ItemTierConfig { stat: 33, cost: 16_500 },
                            ItemTierConfig { stat: 50, cost: 187_000 },
                        ],
                        3 => array![
                            ItemTierConfig { stat: 10, cost: 0 },
                            ItemTierConfig { stat: 22, cost: 1_320 },
                            ItemTierConfig { stat: 30, cost: 8_800 },
                            ItemTierConfig { stat: 46, cost: 176_000 },
                        ],
                        _ => panic!("invalid tier"),
                    }
                },
                _ => panic!("invalid slot"),
            }
        }
    }
}
