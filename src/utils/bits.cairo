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
        Bits { bits: 0 }
    }
}

#[generate_trait]
impl BitsImpl of BitsTrait {
    fn from(bits: u256) -> Bits {
        Bits { bits }
    }

    fn from_felt(bits: felt252) -> Bits {
        Bits { bits: bits.into() }
    }

    fn into_felt(self: @Bits) -> felt252 {
        (*self).bits.try_into().unwrap()
    }

    fn extract(self: @Bits, from: u8, size: u8) -> u256 {
        // shift right with from
        let shifted = BitsMathImpl::shr(*self.bits, from);

        // create mask with size
        let mask = BitsMathImpl::mask(size);

        // return masked value
        shifted & mask
    }

    fn extract_into<T, +TryInto<u256, T>>(self: @Bits, from: u8, size: u8) -> T {
        let value = self.extract(from, size);
        value.try_into().unwrap()
    }


    // !! value MUST fit into size of bit otherwise it overflow !!
    fn replace<T, +Into<T, u256>, +TryInto<u256, T>, +Drop<T>, +Destruct<T>>(
        ref self: Bits, from: u8, size: u8, value: T
    ) {
        let prev_value = self.extract_into::<T>(from, size);

        let shifted_prev_value = BitsMathImpl::shl(prev_value.into(), from);
        let shifted_new_value = BitsMathImpl::shl(value.into(), from);

        self.bits -= shifted_prev_value;
        self.bits += shifted_new_value;
    }
}

//
//
//

#[generate_trait]
impl BitsMathImpl of BitsMathTrait {

    fn fpow(x: u256, n: u8) -> u256 {
        let y = x;
        if n == 0 {
            return 1;
        }
        if n == 1 {
            return x;
        }
        let double = BitsMathImpl::fpow(y * x, n / 2);
        if (n % 2) == 1 {
            return x * double;
        }
        return double;
    }
   
    fn mask<T, +TryInto<u256, T>, +Drop<T>, +Destruct<T>>(size: u8) -> T {
        let mask = BitsMathImpl::fpow(2, size) - 1;
        mask.try_into().unwrap()
    }

    fn shl(x: u256, n: u8) -> u256 {
        x * BitsMathImpl::fpow(2, n)
    }

    fn shr(x: u256, n: u8) -> u256 {
        x / BitsMathImpl::fpow(2, n)
    }
}

//
//
//

#[cfg(test)]
mod tests {
    use core::traits::TryInto;
    use debug::PrintTrait;
    use rollyourown::utils::bits::BitsTrait;
    use super::{Bits, BitsDefaultImpl, BitsImpl, FELT252_PRIME, BitsMathImpl};

    #[test]
    #[available_gas(100000000)]
    fn test_bits_default() {
        let mut bits = BitsDefaultImpl::default();
        assert(bits.into_felt() == 0, 'should be 0');
    }


    #[test]
    #[should_panic]
    #[available_gas(100000000)]
    fn test_bits_from_prime() {
        let mut bits = BitsImpl::from(FELT252_PRIME);
        let _fail = bits.into_felt();
    }

    #[test]
    #[available_gas(100000000)]
    fn test_bits_from_prime_minus_1() {
        let mut bits = BitsImpl::from(FELT252_PRIME - 1);
        let _max = bits.into_felt();
    }

    #[test]
    #[available_gas(100000000)]
    fn test_bits_max_251() {
        let max_251 = BitsMathImpl::fpow(2, 251) - 1;
        let mut bits = BitsImpl::from(max_251);
        let _max = bits.into_felt();
    }


}

