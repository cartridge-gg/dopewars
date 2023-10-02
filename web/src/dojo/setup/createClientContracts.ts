import { SetupNetworkResult, getContractByName } from "./setupNetwork";
import { AccountInterface, Contract, ProviderInterface } from "starknet";

export type ClientContracts = ReturnType<typeof createClientContracts>;

export function createClientContracts(provider: ProviderInterface | AccountInterface, manifest: any) {

    return manifest.contracts.map(contract => {
        const name = contract.name
        const address = getContractByName(name, manifest).address
        const instance = new Contract(contract.abi, address, provider);

        return {
            name,
            address,
            contract: instance
        }
    })

}