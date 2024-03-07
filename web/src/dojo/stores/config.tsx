import {
  ConfigDocument,
  ConfigQuery,
  DrugConfig,
  DrugConfigEdge,
  HustlerItemBaseConfig,
  HustlerItemBaseConfigEdge,
  HustlerItemTiersConfig,
  HustlerItemTiersConfigEdge,
  LocationConfig,
  LocationConfigEdge,
  RyoConfig,
  RyoConfigEdge,
} from "@/generated/graphql";
import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import React from "react";
import { Contract, TypedContractV2, shortString } from "starknet";
import { createStore } from "zustand";
import { ABI as configAbi } from "../abis/configAbi";
import {
  drugIcons,
  drugIconsKeys,
  itemIcons,
  itemUpgrades,
  itemsIconsKeys,
  locationIcons,
  locationIconsKeys,
} from "../helpers";
import { ItemSlot } from "../types";

export type DrugConfigFull = DrugConfig & { icon: React.FC };
export type LocationConfigFull = LocationConfig & { icon: React.FC };

export type LayoutItem = {
  name: string;
  bits: bigint;
  idx: bigint;
};

export type HustlerItemConfig = {
  slot: ItemSlot;
  level: number;
  base: HustlerItemBaseConfig;
  tier: HustlerItemTiersConfig;
};

export type HustlerItemConfigFull = HustlerItemConfig & {
  icon: React.FC;
  upgradeName: string;
};

export type HustlerConfig = {
  hustler_id: number;
  weapon: HustlerItemConfig;
  clothes: HustlerItemConfig;
  feet: HustlerItemConfig;
  transport: HustlerItemConfig;
};

export type GetConfig = {
  layouts: {
    game_store: Array<LayoutItem>;
    player: Array<LayoutItem>;
  };
  hustlers: Array<HustlerConfig>;
};

export type Config = {
  ryo: RyoConfig;
  drug: DrugConfigFull[];
  location: LocationConfigFull[];
  items: HustlerItemBaseConfig[];
  tiers: HustlerItemTiersConfig[];
  config: GetConfig;
};

export interface ConfigStore {
  config: Config | undefined;
  isLoading: boolean;

  init: () => void;
  //
  getDrug: (drug: string) => DrugConfigFull;
  getDrugById: (drug_id: number) => DrugConfigFull;
  //
  getLocation: (location: string) => LocationConfigFull;
  getLocationById: (location_id: number) => LocationConfigFull;
  //
  getGameStoreLayoutItem: (name: string) => LayoutItem;
  getPlayerLayoutItem: (name: string) => LayoutItem;
  //
  getHustlerById: (id: number) => HustlerConfig;
  //
  getHustlerItemByIds: (id: number, slot_id: number, level: number) => HustlerItemConfigFull;
}

type ConfigStoreProps = {
  client: GraphQLClient;
  dojoProvider: DojoProvider;
  manifest: any;
};

export const createConfigStore = ({ client, dojoProvider, manifest }: ConfigStoreProps) => {
  return createStore<ConfigStore>((set, get) => ({
    isLoading: false,
    config: undefined,

    init: async () => {
      const init_async = async () => {
        set({ ...get(), isLoading: true });

        try {
          const data = (await client.request(ConfigDocument, {})) as ConfigQuery;

          /*************************************************** */

          const ryoConfigEdges = data.ryoConfigModels!.edges as RyoConfigEdge[];
          const ryoConfig = ryoConfigEdges[0]!.node as RyoConfig;

          /*************************************************** */

          const drugConfigEdges = data.drugConfigModels!.edges as DrugConfigEdge[];
          const drugConfig = drugConfigEdges.map((i) => i.node as DrugConfig);

          //

          const locationConfigEdges = data.locationConfigModels!.edges as LocationConfigEdge[];
          const locationConfig = locationConfigEdges.map((i) => i.node as LocationConfig);

          //

          const hustlerItemBaseConfigEdges = data.hustlerItemBaseConfigModels!.edges as HustlerItemBaseConfigEdge[];
          const hustlerItemBaseConfig = hustlerItemBaseConfigEdges.map((i) => {
            return {
              ...i.node,
              name: shortString.decodeShortString(i.node?.name),
            } as HustlerItemBaseConfig;
          });

          //

          const hustlerItemTiersConfigEdges = data.hustlerItemTiersConfigModels!.edges as HustlerItemTiersConfigEdge[];
          const hustlerItemTiersConfig = hustlerItemTiersConfigEdges.map((i) => i.node as HustlerItemTiersConfig);

          /*************************************************** */

          const drugConfigFull = drugConfig.map((i) => {
            return {
              ...i,
              name: shortString.decodeShortString(i?.name), // todo: remove when bytes31 is supported
              icon: drugIcons[i.drug as drugIconsKeys],
            } as DrugConfigFull;
          });

          const locationConfigFull = locationConfig.flatMap((i) => {
            if (i.location === "Home") return [];

            return [
              {
                ...i,
                name: shortString.decodeShortString(i?.name), // todo: remove when bytes31 is supported
                icon: locationIcons[i.location as locationIconsKeys],
              },
            ] as LocationConfigFull[];
          });

          /*************************************************** */

          // const res = await dojoProvider.callContract("rollyourown::config::config::config", "get_config", []);
          const contractInfos = manifest.contracts.find((i: any) => i.name === "rollyourown::config::config::config")!;

          const contract: TypedContractV2<typeof configAbi> = new Contract(
            contractInfos.abi,
            contractInfos.address,
            dojoProvider.provider,
          ).typedv2(configAbi);

          const getConfig = await contract.get_config();

          /*************************************************** */

          const config = {
            ryo: ryoConfig,
            drug: drugConfigFull,
            location: locationConfigFull,
            items: hustlerItemBaseConfig,
            tiers: hustlerItemTiersConfig,
            /// @ts-ignore
            config: getConfig as GetConfig,
          };

          set({
            ...get(),
            config,
            isLoading: false,
          });

          console.log(config);
        } catch (e: any) {
          console.log(e);
          set({ isLoading: false });
        }
      };

      if (!get().config && !get().isLoading) {
        init_async();
      }
    },
    /****************************************************/
    getDrug: (drug: string): DrugConfigFull => {
      return get().config?.drug.find((i) => i.drug.toLowerCase() === drug.toLowerCase())!;
    },
    getDrugById: (drug_id: number): DrugConfigFull => {
      return get().config?.drug.find((i) => Number(i.drug_id) === Number(drug_id))!;
    },
    /****************************************************/
    getLocation: (location: string): LocationConfigFull => {
      return get().config?.location.find((i) => i.location.toLowerCase() === location.toLowerCase())!;
    },
    getLocationById: (location_id: number): LocationConfigFull => {
      return get().config?.location.find((i) => Number(i.location_id) === Number(location_id))!;
    },
    /****************************************************/
    getGameStoreLayoutItem: (name: string): LayoutItem => {
      // return get().config?.config.layouts.game_store.find((i) => shortString.decodeShortString(i.name) === name)!;
      return get().config?.config.layouts.game_store.find((i) => i.name === name)!;
    },
    getPlayerLayoutItem: (name: string): LayoutItem => {
      // return get().config?.config.layouts.player.find((i) => shortString.decodeShortString(i.name) === name)!;
      return get().config?.config.layouts.player.find((i) => i.name === name)!;
    },
    /****************************************************/
    getHustlerById: (id: number): HustlerConfig => {
      return get().config?.config.hustlers.find((i) => Number(i.hustler_id) === Number(id))!;
    },
    /****************************************************/
    getHustlerItemByIds: (id: number, slot_id: number, level: number): HustlerItemConfigFull => {
      const base_config = get().config?.items.find(
        (i) => Number(i.id) === Number(id) && Number(i.slot_id) === Number(slot_id),
      )!;

      // // TODO remove with starknet.js 6
      const tier = base_config.initial_tier + level;
      const tier_config = get().config?.tiers.find(
        (i) => Number(i.slot_id) === Number(slot_id) && Number(i.tier) === Number(tier),
      )!;

      return {
        slot: slot_id as ItemSlot,
        level,
        base: base_config,
        tier: tier_config,
        // @ts-ignore
        upgradeName: itemUpgrades[Number(slot_id) as ItemSlot][Number(id)][Number(level)] || "Original",
        icon: itemIcons[base_config.name as itemsIconsKeys],
      };
    },
  }));
};
