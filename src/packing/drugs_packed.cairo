use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use rollyourown::{
    config::{drugs::{Drugs}},
    utils::bits::{Bits, BitsImpl, BitsDefaultImpl, BitsTrait, BitsMathImpl},
    models::game::{Game, GameMode, GameImpl},
};

// 16 bits : 3 bits for Drugs, 13 bits for quantity
#[derive(Copy, Drop, Serde)]
struct DrugsPacked {
    packed: felt252
}

#[derive(Copy, Drop)]
struct DrugsUnpacked {
    drug: Drugs,
    quantity: u32,
}


#[generate_trait]
impl DrugsPackedImpl of DrugsPackedTrait {
    fn new() -> DrugsPacked {
        DrugsPacked { packed: 0 }
    }

    fn get(self: @DrugsPacked) -> DrugsUnpacked {
        let mut bits = BitsImpl::from_felt(*self.packed);

        let drug: Drugs = bits.extract_into::<u8>(0, 3).into();
        let quantity: u32 = bits.extract_into::<u32>(3, 13).into();

        DrugsUnpacked { drug, quantity }
    }

    fn set(ref self: DrugsPacked, drugs_unpacked: DrugsUnpacked) {
        let mut bits = BitsDefaultImpl::default();

        bits.replace::<u8>(0, 3, drugs_unpacked.drug.into());
        bits.replace::<u32>(3, 13, drugs_unpacked.quantity.into());

        self.packed = bits.into_felt();
    }
}

