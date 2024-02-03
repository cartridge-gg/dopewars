
const main = () => {

    const result = []

    result.push("fn pow2( n: u8 ) -> u256 {")
    result.push("let n: felt252 = n.into();")
    result.push("match n {")

    for (let i = 0n; i < 256n; i++) {
        let two_pow_i = 1n << i;
        let hex = `0x${two_pow_i.toString(16)}`
        result.push(`     ${i} => ${hex}_u256,`)
    }
    result.push("     _ => 0x1_u256,")

    result.push("  }")
    result.push("}")

    let code = result.join('\n')

    console.log(code)
}


main()