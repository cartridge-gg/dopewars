import { shortString } from "starknet";

export interface StarknetEIP712DomainType {
    name: string;
    version: string | undefined;
    chainId: number;
}

interface EIP712DomainTypeElement {
    name: string;
    type: string;
}
export interface EIP712Types {
    EIP712Domain: EIP712DomainTypeElement[];
    [key: string]: any;
}

export const EIP712DomainSpecStarknet = [
    { name: "name", type: "string" },
    { name: "version", type: "felt" },
    { name: "chainId", type: "felt" },
];

/*
 * A streamlined version of createEIP712Types() that doesn't enforce having a
 * wrapper tx object.
 */
export function createEIP712TypesNoBodyStarknet(
    name: string,
    spec: { name: string; type: string }[],
) {
    return {
        StarkNetDomain: EIP712DomainSpecStarknet,
        [name]: spec,
    };
}

/*
 * All the domain separators used in signing typed data, for starknet.
 */
export function createStarknetEIP712DomainType(name: string) {
    return { 
        name,
        version: process.env.VERSION,
        chainId: typeof process.env.CHAIN_ID === 'string' ? shortString.encodeShortString(process.env.CHAIN_ID) : Number(process.env.CHAIN_ID),
    };
}

