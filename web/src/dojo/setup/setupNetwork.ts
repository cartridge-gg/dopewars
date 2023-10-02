import { defineContractComponents } from "../generated/contractComponents";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, TypedContract, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';
import { createClientContracts } from "./createClientContracts";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

const contractsByName = {
    lobby: {
        address: "0x817964102f5820f8f352e4127f9a92692b7ab880d8257fe031338f1592d1ee"
    },
    trade: {
        address: "0x592f8b83158a512eb11da9e7e8b6def37df8352d9074841671e5f3ff818bfee"
    },
    travel: {
        address: "0x6cc1f2fb8526e46161b0565e37006e32a62c9cd08498cca4096c19916c7b9d8"
    },
    decide: {
        address: "0x3f9f91a8b85eb22d07033dddca56eb0c35d3a7f88547bdc20b1dfbbab6ab7fa"
    },
    contract: {
        address: "0x74d97f9230afea0478057f475f4f105108d2fa99d8c7ce79f5446ef1031af1c"
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