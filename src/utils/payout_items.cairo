use dojo::world::WorldStorage;

use dope_contracts::dope_gear::dope_gear_store::{GearStoreImpl, GearStoreTrait};
use dope_contracts::dope_hustlers::dope_hustlers_models::{HustlerSlots};
use dope_contracts::dope_hustlers::dope_hustlers_store::{HustlerStoreImpl, HustlerStoreTrait};

pub fn add_items_payout(
    ref dope_world: WorldStorage,
    ref ids: Array<u256>,
    ref values: Array<u256>,
    ref hustler_count: u8,
    season: u16,
    position: u16,
) {
    // deterministic so we could display season rewards on front
    let seed = core::poseidon::poseidon_hash_span(array![season.into(), position.into()].span());

    // rank 1,2,3  get a hustler
    if position < 4 {
        hustler_count += 1;
    }

    let mut hustler_store = HustlerStoreImpl::new(dope_world);
    let mut gear_store = GearStoreImpl::new(dope_world);

    if position == 1 { // full augmented set from XXX + CROWN
        let mut slots = hustler_store.get_all_slots();
        let mut maybe_suffix = Option::None;

        for slot in slots {
            let mut gear_item = gear_store
                .random_gear_item_id(
                    seed.into(), slot, Option::Some(21),
                ); // 21 = get all suffix/prefixes/augmented

            // force match set from XXX
            if let Option::Some(suffix) = maybe_suffix {
                gear_item.suffix = suffix;
            } else {
                maybe_suffix = Option::Some(gear_item.suffix);
            }

            // if accessory -> force crown
            if slot == HustlerSlots::Accessory {
                gear_item.item = 0; // crown id
            }

            let gear_item_id: u256 = gear_item.into();
            // append to arrays
            ids.append(gear_item_id);
            values.append(1);
        }
    } else if position == 2 { // set from XXX
        let mut slots = array![
            HustlerSlots::Weapon,
            HustlerSlots::Clothe,
            HustlerSlots::Foot,
            HustlerSlots::Vehicle,
            HustlerSlots::Accessory,
        ];
        let mut maybe_suffix = Option::None;

        for slot in slots {
            let mut gear_item = gear_store
                .random_gear_item_id(seed.into(), slot, Option::Some(15)); // 15 = get a suffix

            // force match set from XXX
            if let Option::Some(suffix) = maybe_suffix {
                gear_item.suffix = suffix;
            } else {
                maybe_suffix = Option::Some(gear_item.suffix);
            }

            // if accessory -> force NOT crown/mr fax/sausage
            if slot == HustlerSlots::Accessory && gear_item.item < 3 {
                gear_item.item = 27; // paper id
            }

            let gear_item_id: u256 = gear_item.into();
            // append to arrays
            ids.append(gear_item_id);
            values.append(1);
        }
    } else if position == 3 { // full random
        let mut slots = array![
            HustlerSlots::Weapon,
            HustlerSlots::Clothe,
            HustlerSlots::Foot,
            HustlerSlots::Vehicle,
            HustlerSlots::Accessory,
        ];

        for slot in slots {
            let mut gear_item = gear_store
                .random_gear_item_id(seed.into(), slot, Option::None); // None = full random

            // if accessory ->force NOT crown/mr fax/sausage
            if slot == HustlerSlots::Accessory && gear_item.item < 3 {
                gear_item.item = 27; // paper id
            }
            let gear_item_id: u256 = gear_item.into();

            // append to arrays
            ids.append(gear_item_id);
            values.append(1);
        }
    } else { // random accessory
        let mut gear_item = gear_store
            .random_gear_item_id(
                seed.into(), HustlerSlots::Accessory, Option::None,
            ); // None = full random

        // force NOT crown
        if gear_item.item < 3 {
            gear_item.item = 27; // paper id
        }

        let gear_item_id: u256 = gear_item.into();

        // append to arrays
        ids.append(gear_item_id);
        values.append(1);
    }
}
