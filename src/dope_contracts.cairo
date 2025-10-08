pub mod dope_hustlers {
    pub mod dope_hustlers_models {
        pub mod HustlerSlots {
            pub const Clothe: felt252 = 'Clothe';
            pub const Vehicle: felt252 = 'Vehicle';
            pub const Drug: felt252 = 'Drug';
            pub const Waist: felt252 = 'Waist';
            pub const Foot: felt252 = 'Foot';
            pub const Weapon: felt252 = 'Weapon';
            pub const Hand: felt252 = 'Hand';
            pub const Neck: felt252 = 'Neck';
            pub const Ring: felt252 = 'Ring';
            pub const Accessory: felt252 = 'Accessory';
        }

        pub mod HustlerBodyParts {
            pub const Gender: felt252 = 'Gender';
            pub const Body: felt252 = 'Body';
            pub const Hair: felt252 = 'Hair';
            pub const Beard: felt252 = 'Beard';
        }

        #[derive(Debug, Drop, Serde, Introspect)]
        #[dojo::model]
        pub struct HustlerBody {
            #[key]
            pub token_id: felt252,
            #[key]
            pub slot: felt252,
            pub value: u8,
        }


        #[derive(Debug, Drop, Serde, Introspect, DojoStore)]
        #[dojo::model]
        pub struct HustlerSlot {
            #[key]
            pub token_id: felt252,
            #[key]
            pub slot: felt252,
            pub gear_item_id: DojoOption,
        }

        #[derive(Debug, Drop, Copy, Clone, Serde, Introspect, Default, DojoStore)]
        pub enum DojoOption {
            #[default]
            None,
            Some: u256,
        }

        #[derive(Debug, Drop, Copy, Clone, Serde, Introspect)]
        pub struct HustlerSlotOption {
            pub token_id: felt252,
            pub slot: felt252,
            pub gear_item_id: Option<u256>,
        }


        pub impl HustlerSlotIntoHuslterSlotOptionImpl of Into<HustlerSlot, HustlerSlotOption> {
            fn into(self: HustlerSlot) -> HustlerSlotOption {
                HustlerSlotOption {
                    token_id: self.token_id,
                    slot: self.slot,
                    gear_item_id: match self.gear_item_id {
                        DojoOption::None => Option::None,
                        DojoOption::Some(value) => Option::Some(value),
                    },
                }
            }
        }

        pub impl HustlerSlotOptionIntoHuslterSlotImpl of Into<HustlerSlotOption, HustlerSlot> {
            fn into(self: HustlerSlotOption) -> HustlerSlot {
                HustlerSlot {
                    token_id: self.token_id,
                    slot: self.slot,
                    gear_item_id: match self.gear_item_id {
                        Option::None => DojoOption::None,
                        Option::Some(value) => DojoOption::Some(value),
                    },
                }
            }
        }
    }
}
