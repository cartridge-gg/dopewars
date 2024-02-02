import {
  ConfigDocument,
  ConfigQuery,
  DrugConfig,
  DrugConfigEdge,
  DrugConfigMeta,
  DrugConfigMetaEdge,
  ItemConfig,
  ItemConfigEdge,
  ItemConfigMeta,
  ItemConfigMetaEdge,
  LocationConfig,
  LocationConfigEdge,
  LocationConfigMeta,
  LocationConfigMetaEdge,
} from "@/generated/graphql";
import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import { Contract, TypedContract, shortString } from "starknet";
import { createStore } from "zustand";
import { ABI as configAbi } from "../abis/configAbi";
import { drugIcons, itemIcons, locationIcons, statName } from "../helpers";

export type DrugConfigFull = DrugConfig & Omit<DrugConfigMeta, "__typename"> & { icon: JSX.Element };
export type LocationConfigFull = LocationConfig & Omit<LocationConfigMeta, "__typename"> & { icon: JSX.Element };
export type ItemConfigFull = ItemConfig & Omit<ItemConfigMeta, "__typename"> & { icon: JSX.Element, statName: string };

export type LayoutItem = {
  name: string;
  bits: bigint;
  idx: bigint;
};

export type GetConfig = {
  layouts: {
    game_store: Array<LayoutItem>;
    player: Array<LayoutItem>;
  };
};

export type Config = {
  drug: DrugConfigFull[];
  location: LocationConfigFull[];
  item: ItemConfigFull[];
  config: GetConfig;
};

export interface ConfigStore {
  config: Config | undefined;
  isLoading: boolean;

  init: () => void;
  //
  getDrug: (drug: string) => DrugConfigFull;
  getDrugById: (drug_id: number) => DrugConfigFull;
  getLocation: (location: string) => LocationConfigFull;
  getLocationById: (location_id: number) => LocationConfigFull;
  getItemByIds: (slot_id: number, level_id: number) => ItemConfigFull;
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

          const drugConfigEdges = data.drugConfigModels!.edges as DrugConfigEdge[];
          const drugConfig = drugConfigEdges.map((i) => i.node as DrugConfig);

          const drugConfigMetaEdges = data.drugConfigMetaModels!.edges as DrugConfigMetaEdge[];
          const drugConfigMeta = drugConfigMetaEdges.map((i) => i.node as DrugConfigMeta);

          //

          const locationConfigEdges = data.locationConfigModels!.edges as LocationConfigEdge[];
          const locationConfig = locationConfigEdges.map((i) => i.node as LocationConfig);

          const locationConfigMetaEdges = data.locationConfigMetaModels!.edges as LocationConfigMetaEdge[];
          const locationConfigMeta = locationConfigMetaEdges.map((i) => i.node as LocationConfigMeta);

          //

          const itemConfigEdges = data.itemConfigModels!.edges as ItemConfigEdge[];
          const itemConfig = itemConfigEdges.map((i) => i.node as ItemConfig);

          const itemConfigMetaEdges = data.itemConfigMetaModels!.edges as ItemConfigMetaEdge[];
          const itemConfigMeta = itemConfigMetaEdges.map((i) => i.node as ItemConfigMeta);

          /*************************************************** */

          const drugConfigFull = drugConfig.map((i) => {
            const meta = drugConfigMeta.find((m) => m.drug === i.drug);
            return {
              ...i,
              ...meta,
              name: shortString.decodeShortString(meta?.name), // todo: remove when bytes31 is supported
              icon: drugIcons[i.drug],
            } as DrugConfigFull;
          });

          const locationConfigFull = locationConfig.flatMap((i) => {
            if (i.location === "Home") return [];

            const meta = locationConfigMeta.find((m) => m.location === i.location);
            return [
              {
                ...i,
                ...meta,
                name: shortString.decodeShortString(meta?.name), // todo: remove when bytes31 is supported
                icon: locationIcons[i.location],
              },
            ] as LocationConfigFull[];
          });

          const itemConfigFull = itemConfig.map((i) => {
            const meta = itemConfigMeta.find((m) => m.slot === i.slot && m.level === i.level);
            const name = shortString.decodeShortString(meta?.name); // todo: remove when bytes31 is supported
            return {
              ...i,
              ...meta,
              name,
              icon: itemIcons[name],
              statName: statName[i.slot],
            } as ItemConfigFull;
          });

          /*************************************************** */

          // const res = await dojoProvider.callContract("rollyourown::config::config::config", "get_config", []);
          const contractInfos = manifest.contracts.find((i) => i.name === "rollyourown::config::config::config")!;
          const contract: TypedContract<typeof configAbi> = new Contract(
            contractInfos.abi,
            contractInfos.address,
            dojoProvider.provider,
          ).typedv2(configAbi);

          const getConfig = await contract.get_config();

          /*************************************************** */

          const config = {
            drug: drugConfigFull,
            location: locationConfigFull,
            item: itemConfigFull,
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
      return get().config.drug.find((i) => i.drug.toLowerCase() === drug.toLowerCase());
    },
    getDrugById: (drug_id: number): DrugConfigFull => {
      return get().config.drug.find((i) => Number(i.drug_id) === Number(drug_id));
    },
    /****************************************************/
    getLocation: (location: string): LocationConfigFull => {
      return get().config.location.find((i) => i.location.toLowerCase() === location.toLowerCase());
    },
    getLocationById: (location_id: number): LocationConfigFull => {
      return get().config.location.find((i) => Number(i.location_id) === Number(location_id));
    },
    /****************************************************/
    getItemByIds: (slot_id: number, level_id: number): ItemConfigFull => {
      return get().config.item.find((i) => Number(i.slot_id) === slot_id && Number(i.level_id) === level_id);
    },
    /****************************************************/
    getGameStoreLayoutItem: (name: string): LayoutItem => {
      return get().config.config.layouts.game_store.find((i) => i.name === name)!;
    },
    getPlayerLayoutItem: (name: string): LayoutItem => {
      return get().config.config.layouts.player.find((i) => i.name === name)!;
    },
  }));
};
