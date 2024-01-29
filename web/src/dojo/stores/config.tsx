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
import { shortString } from "starknet";
import { createStore } from "zustand";
import { drugIcons, locationIcons } from "../helpers";

export type DrugConfigFull = DrugConfig & Omit<DrugConfigMeta, { __typename }> & { icon: JSX.Element };
export type LocationConfigFull = LocationConfig & Omit<LocationConfigMeta, { __typename }> & { icon: JSX.Element };
export type ItemConfigFull = ItemConfig & Omit<ItemConfigMeta, { __typename }> & { icon: JSX.Element };

export type Config = {
  drug: DrugConfigFull[];
  location: LocationConfigFull[];
  item: ItemConfigFull[];
};

export interface ConfigStore {
  config: Config;
  init: () => void;
  // getConfig: () => void;
}

type ConfigStoreProps = {
  client: GraphQLClient;
};

export const createConfigStore = ({ client }: ConfigStoreProps) => {
  return createStore<ConfigStore>((set, get) => ({
    isLoading: false,
    config: undefined,

    init: async () => {
      const init_async = async () => {
        set({ isLoading: true });

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
            return {
              ...i,
              ...meta,
              name: shortString.decodeShortString(meta?.name), // todo: remove when bytes31 is supported
            } as LocationConfigFull;
          });

          /*************************************************** */

          const config = {
            drug: drugConfigFull,
            location: locationConfigFull,
            item: itemConfigFull,
          };

          set({
            config,
          });

          console.log(config);
        } catch (e: any) {
          console.log(e);
        }

        set({ isLoading: false });
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
      return get().config.drug.find((i) => i.drug_id === drug_id);
    },
    /****************************************************/
    getLocation: (location: string): LocationConfigFull => {
      return get().config.location.find((i) => i.location.toLowerCase() === location.toLowerCase());
    },
    getLocationById: (location_id: number): LocationConfigFull => {
      return get().config.location.find((i) => i.location_id === location_id);
    },
    /****************************************************/
  }));
};
