// FELT PRIME
// 2^251 + 17 * 2^192 + 1
const FELT252_PRIME: u256 = 0x800000000000011000000000000000000000000000000000000000000000001;

use traits::TryInto;

#[derive(Copy, Drop, Serde)]
struct Bits {
    bits: u256,
}

impl BitsDefaultImpl of Default<Bits> {
    fn default() -> Bits {
        Bits {
            bits: 0
        }
    }
}

#[generate_trait]
impl BitsImpl of BitsTrait {
    fn from(bits: felt252) -> Bits {
        Bits { bits: bits.into() }
    }

    fn into_felt(self: @Bits) -> felt252 {
        (*self).bits.try_into().unwrap()
    }

    fn extract(self: @Bits, from: u8, size: u8) -> u256 {
        // shift right with from
        let shifted = shr(*self.bits, from);

        // create mask with size
        let mask = fpow(2, size) - 1;

        // return masked value
        shifted & mask
    }

    fn extract_into<T, +TryInto<u256, T>>(self: @Bits, from: u8, size: u8) -> T {
        let value = self.extract(from, size);
        value.try_into().unwrap()
    }


    fn replace<T, +Into<T, u256>, +TryInto<u256, T>, +Drop<T>, +Destruct<T>>(
        ref self: Bits, from: u8, size: u8, value: T
    ) {
        let prev_value = self.extract_into::<T>(from, size);

        let shifted_prev_value = shl(prev_value.into(), from);
        let shifted_new_value = shl(value.into(), from);

        self.bits -= shifted_prev_value;
        self.bits += shifted_new_value;
    }
}

//
//
//

// use binary search + constants ?
fn fpow(x: u256, n: u8) -> u256 {
    let y = x;
    if n == 0 {
        return 1;
    }
    if n == 1 {
        return x;
    }
    let double = fpow(y * x, n / 2);
    if (n % 2) == 1 {
        return x * double;
    }
    return double;
}

fn shl(x: u256, n: u8) -> u256 {
    x * fpow(2, n)
}

fn shr(x: u256, n: u8) -> u256 {
    x / fpow(2, n)
}

//
//
//

const POW_2_0: u128 = 0x1;
const POW_2_1: u128 = 0x2;
const POW_2_2: u128 = 0x4;
const POW_2_3: u128 = 0x8;
const POW_2_4: u128 = 0x10;
const POW_2_5: u128 = 0x20;
const POW_2_6: u128 = 0x40;
const POW_2_7: u128 = 0x80;
const POW_2_8: u128 = 0x100;
const POW_2_9: u128 = 0x200;
const POW_2_10: u128 = 0x400;
const POW_2_11: u128 = 0x800;
const POW_2_12: u128 = 0x1000;
const POW_2_13: u128 = 0x2000;
const POW_2_14: u128 = 0x4000;
const POW_2_15: u128 = 0x8000;
const POW_2_16: u128 = 0x10000;
const POW_2_17: u128 = 0x20000;
const POW_2_18: u128 = 0x40000;
const POW_2_19: u128 = 0x80000;
const POW_2_20: u128 = 0x100000;
const POW_2_21: u128 = 0x200000;
const POW_2_22: u128 = 0x400000;
const POW_2_23: u128 = 0x800000;
const POW_2_24: u128 = 0x1000000;
const POW_2_25: u128 = 0x2000000;
const POW_2_26: u128 = 0x4000000;
const POW_2_27: u128 = 0x8000000;
const POW_2_28: u128 = 0x10000000;
const POW_2_29: u128 = 0x20000000;
const POW_2_30: u128 = 0x40000000;
const POW_2_31: u128 = 0x80000000;

//
//
//

const MASK_2_0: u128 = 0x0;
const MASK_2_1: u128 = 0x1;
const MASK_2_2: u128 = 0x3;
const MASK_2_3: u128 = 0x7;
const MASK_2_4: u128 = 0xf;
const MASK_2_5: u128 = 0x1f;
const MASK_2_6: u128 = 0x3f;
const MASK_2_7: u128 = 0x7f;
const MASK_2_8: u128 = 0xff;
const MASK_2_9: u128 = 0x1ff;
const MASK_2_10: u128 = 0x3ff;
const MASK_2_11: u128 = 0x7ff;
const MASK_2_12: u128 = 0xfff;
const MASK_2_13: u128 = 0x1fff;
const MASK_2_14: u128 = 0x3fff;
const MASK_2_15: u128 = 0x7fff;
const MASK_2_16: u128 = 0xffff;
const MASK_2_17: u128 = 0x1ffff;
const MASK_2_18: u128 = 0x3ffff;
const MASK_2_19: u128 = 0x7ffff;
const MASK_2_20: u128 = 0xfffff;
const MASK_2_21: u128 = 0x1fffff;
const MASK_2_22: u128 = 0x3fffff;
const MASK_2_23: u128 = 0x7fffff;
const MASK_2_24: u128 = 0xffffff;
const MASK_2_25: u128 = 0x1ffffff;
const MASK_2_26: u128 = 0x3ffffff;
const MASK_2_27: u128 = 0x7ffffff;
const MASK_2_28: u128 = 0xfffffff;
const MASK_2_29: u128 = 0x1fffffff;
const MASK_2_30: u128 = 0x3fffffff;
const MASK_2_31: u128 = 0x7fffffff;
