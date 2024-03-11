import { Account } from "starknet";
import { getNonce, signTypedDataStarknet } from "./lib/lib"; 

async function getTradeParameters(account: Account, seismic_url: string) {

    let senderNonce = await getNonce(account, seismic_url)

    const tx = {
        nonce: BigInt(senderNonce).toString(),
        player_id: account.address,
        game_id: '0',

    }

    const signature = await signTypedDataStarknet(account, tradeParametersActionTypes, tradeParametersActionTypeLabel, tradeParametersActionDomain, tx) as WeierstrassSignatureType;

    const response = await axios.post(`${process.env.ENDPOINT}/trade/tradeParameters`, {
        tx: stringifyBigInts(tx),
        signature: stringifyBigInts(signature),
    });
    if (response.status !== 200) {
        throw new Error("Could not acquire data availability signature");
    }
    console.log("response: ", response.data);
}

