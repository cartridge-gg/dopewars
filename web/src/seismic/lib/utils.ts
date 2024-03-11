import { Account } from "starknet";

/*
 * Seismic tracks a nonce for each wallet to avoid replay attacks. Note this is
 * NOT the nonce that Ethereum tracks for the wallet.
 */
export async function getNonce(walletClient: Account, seismic_url: string) {
    const response = await fetch(`${seismic_url}/authentication/nonce`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: walletClient.address,
        })
    if (!response.ok) {  
      throw new Error(`Could not get nonce for address ${walletClient.address}`);
    }

    const data = await response.json();
    return data.nonce; 
}
