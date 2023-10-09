import { defineContractComponents } from "../generated/contractModels";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, TypedContract, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';
import { createClientContracts } from "./createClientContracts";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

const contractsByName = {
    lobby: {
        address: "0x4c255cc7009a5be276b412e9b83ab201ca65484d4a73bac3d125546c5a20b40"
    },
    trade: {
        address: "0x544b787f0c0c98f716314961cdba1fda89e88b66ce8f2d09e48886eff6df74e"
    },
    travel: {
        address: "0x319a74baf856f1a349bb49d22bab20cde4f9e34d7623084b2f79f975d00f1f3"
    },
    decide: {
        address: "0x71080eecd6f87d3ebe60db725c447d44712b842baecb75c95fbeada2acbce96"
    },
    shop: {
        address: "0x16c3f315a1af66ca67385c8e9c399e232a135c3e57e0f7129629bdbca456978"
    },
}

export const getContractByName = (name: string, manifest: any) => {
    return contractsByName[name]
    // return manifest.contracts.find((contract) => contract.name === name);
}

export async function setupNetwork(manifest: any) {

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(process.env.NEXT_PUBLIC_WORLD_ADDRESS, process.env.NEXT_PUBLIC_RPC_ENDPOINT);

    // // Utility function to get the SDK.
    // const createGraphSdk = () => getSdk(new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT));

    // Return the setup object.
    return {
        manifest,
        provider,
        world,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Create client contracts based on the network setup.
        //contracts: createClientContracts(provider.provider, manifest),

        // // Define the graph SDK instance.
        // graphSdk: createGraphSdk(),

        // Execute function.
        execute: async (signer: Account, contract: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, getContractByName(contract, manifest)?.address || "", system, call_data);
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
        call: async (selector: string, call_data: num.BigNumberish[]) => {
            return provider.call(selector, call_data);
        },
    };
}