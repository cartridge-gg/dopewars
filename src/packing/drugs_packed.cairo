use rollyourown::{
    config::{drugs::{Drugs}}, models::game::{GameImpl},
    utils::bits::{BitsDefaultImpl, BitsImpl, BitsMathImpl, BitsTrait},
};

// 16 bits : 3 bits for Drugs, 13 bits for quantity
#[derive(Copy, Drop, Serde)]
pub struct DrugsPacked {
    pub packed: felt252,
}

#[derive(Copy, Drop)]
pub struct DrugsUnpacked {
    pub drug: Drugs,
    pub quantity: u32,
}


#[generate_trait]
pub impl DrugsPackedImpl of DrugsPackedTrait {
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

