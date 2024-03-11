import { TypedData, Account, Signature, StarkNetDomain } from "starknet";

/*
 * Sign typed data according to EIP712. For use on Starknet.
 */
export async function signTypedDataStarknet(
    walletClient: Account,
    types: any,
    primaryType: string,
    domain: StarkNetDomain,
    message: any,
): Promise<Signature> {
    let typedDataToValidate = getStarknetTypedDataWithMessage(types, primaryType, domain, message);
    return walletClient.signMessage(
        typedDataToValidate
    );
}

/*
 * helper function to construct TypedData as specified in EIP712.
 */
export function getStarknetTypedData(
    types: any,
    primaryType: string,    
    domain:  StarkNetDomain,
): {types: any, primaryType: string, domain: StarkNetDomain }   {
    return {
        types, 
        primaryType, 
        domain,
    }
}

/*
 * helper function to construct TypedData as specified in EIP712, including the message.
 */
export function getStarknetTypedDataWithMessage(
    types: any,
    primaryType: string, 
    domain:  StarkNetDomain,
    message: any,
): TypedData {
    const typedDataWithoutMessage = getStarknetTypedData(types, primaryType, domain)
    return {
        ...typedDataWithoutMessage,
        message
    }
}