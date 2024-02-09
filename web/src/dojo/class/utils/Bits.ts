export default class Bits {

    static mask(size: bigint): bigint {
        return BigInt(Bits.pow(2n, size) - 1n);
    }

    static extract(bits: bigint, from: bigint, size: bigint): bigint {
        const mask = Bits.mask(size);
        const shifted = BigInt(bits) >> from;
        return BigInt(shifted & mask);
    }

    static pow(base: bigint, exponent: bigint) {
        return base ** exponent;
    }

}