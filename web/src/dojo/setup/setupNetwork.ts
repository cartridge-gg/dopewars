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
        address: "0x581dd49a99c06024f1bd40e92cb1eb1ae7dcc584b9d8322ba0e3f902889ecac"
    },
    trade: {
        address: "0x32fb88c2241725cfa617712d42d11bc11b1297818076cf9e82f37bad910c587"
    },
    travel: {
        address: "0x2ad0c7b3ac6aa6c846837405c7a8959f15e1491a2cf7af7dda32b10317a11b8"
    },
    decide: {
        address: "0x21caf3ecac3d59b37ee58688de218be4dd80f993aad3efa2eb34c6ec3e45d1b"
    },
    contract: {
        address: "0x4aea0c9d5578c7099425bfc6d3c9b23daf544cc57bd5af6d9dc6031ce975c5"
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