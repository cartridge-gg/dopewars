import { Account } from "starknet";
import axios from "axios";

/*
 * Seismic tracks a nonce for each wallet to avoid replay attacks. Note this is
 * NOT the nonce that Ethereum tracks for the wallet.
 */
export async function getNonce(walletClient: Account, seismic_url: string) {
   try {
       const response = await axios.get(
        `${seismic_url}/authentication/nonce`,
        {
            params: {
                address: walletClient.address,
            },
        },
        );
        if (response.status !== 200) {
            console.log("Error: ", response.data);
            throw new Error(
                `Could not get nonce for address: ${response.data}`
            );
        };
        return response.data.nonce;
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }

}

/*
 * Recursively stringifies any BigInts present in a nested object.
 */
export function stringifyBigInts(obj: any): any {
    if (typeof obj !== "object") {
        if (typeof obj === "bigint") {
            return obj.toString();
        }
        return obj;
    }
    const newObj = { ...obj };
    for (const key in newObj) {
        newObj[key] = stringifyBigInts(newObj[key]);
    }
    return newObj;
}
