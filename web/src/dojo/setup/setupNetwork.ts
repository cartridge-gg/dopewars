import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, Contract, TypedContract, num, shortString } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { Config } from "./config";

export type ManifestContract = {
    name: string;
    abi: any
};

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export const getContractByName = (name: string, manifest: any) => {
    let contract = manifest.contracts.find((contract: ManifestContract) => contract.name === name);
    return contract
}

export const getWorldAddress = (manifest: any) => {
    return manifest.world.address
}

export async function setupNetwork(config: Config) {

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(getWorldAddress(config.manifest), config.manifest, config.rpcUrl);

    // Return the setup object.
    return {
        manifest: config.manifest,
        provider,

        // Execute function.
        execute: async (signer: Account, contract_name: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, contract_name, system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        },

        // Call function.
        call: async (signer: Account, contract_name: string, selector: string, call_data: num.BigNumberish[]) => {
            const contract_infos = getContractByName(contract_name, manifest);
            const contract = new Contract(contract_infos.abi, contract_infos.address, signer);
            return contract.call(selector, call_data);
        },
    };
}