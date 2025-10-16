import {
  ConfigDocument,
  ConfigQuery,
  Dopewars_DrugConfig as DrugConfig,
  Dopewars_DrugConfigEdge as DrugConfigEdge,
  Dopewars_EncounterStatsConfig as EncounterStatsConfig,
  Dopewars_EncounterStatsConfigEdge as EncounterStatsConfigEdge,
  Dopewars_GameConfig as GameConfig,
  Dopewars_LocationConfig as LocationConfig,
  Dopewars_LocationConfigEdge as LocationConfigEdge,
  Dopewars_RyoAddress as RyoAddress,
  Dopewars_RyoAddressEdge as RyoAddressEdge,
  Dopewars_RyoConfig as RyoConfig,
  Dopewars_RyoConfigEdge as RyoConfigEdge,
  Dopewars_SeasonSettings as SeasonSettings,
  Dopewars_DopewarsItemTier as DopewarsItemTier,
  Dopewars_DopewarsItemTierEdge as DopewarsItemTierEdge,
  Dopewars_DopewarsItemTierConfig as DopewarsItemTierConfig,
  Dopewars_DopewarsItemTierConfigEdge as DopewarsItemTierConfigEdge,
  Dope_ComponentValueEventEdge as ComponentValueEventEdge,
  Dope_ComponentValueEvent as ComponentValueEvent,
} from "@/generated/graphql";
import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import { flow, makeObservable, observable } from "mobx";
import React, { ReactNode } from "react";
import { Contract, TypedContractV2, shortString, RpcProvider } from "starknet";
import { ABI as configAbi } from "../abis/configAbi";
import { drugIcons, drugIconsKeys, locationIcons, locationIconsKeys } from "../helpers";
import { CashMode, DrugsMode, EncountersMode, EncountersOddsMode, HealthMode, ItemSlot, TurnsMode } from "../types";
import { GearItem } from "@/dope/helpers";

export type DrugConfigFull = Omit<DrugConfig, "name"> & { icon: React.FC; name: string };
export type LocationConfigFull = Omit<LocationConfig, "name"> & { icon: React.FC; name: string };

export type LayoutItem = {
  name: string;
  bits: bigint;
  idx: bigint;
};

// export type HustlerItemConfig = {
//   slot: ItemSlot;
//   level: number;
//   base: HustlerItemBaseConfig;
//   tier: HustlerItemTiersConfig;
// };

// export type HustlerItemConfigFull = HustlerItemConfig & {
//   icon: React.FC;
//   upgradeName: string;
// };

// export type HustlerItemBaseConfigFull = HustlerItemBaseConfig & {
//   icon: React.FC;
// };

export type GearItemFull = {
  gearItem: GearItem;
  name: string;
  tier: number;
  levels: {
    cost: number;
    stat: number;
  }[];
};

// export type HustlerConfig = {
//   hustler_id: number;
//   weapon: HustlerItemConfig;
//   clothes: HustlerItemConfig;
//   feet: HustlerItemConfig;
//   transport: HustlerItemConfig;
// };

export type SeasonSettingsModes = {
  cash_modes: Array<CashMode>;
  health_modes: Array<HealthMode>;
  turns_modes: Array<TurnsMode>;
  //
  encounters_modes: Array<EncountersMode>;
  encounters_odds_modes: Array<EncountersOddsMode>;
  drugs_modes: Array<DrugsMode>;
};

export type GetConfig = {
  layouts: {
    game_store: Array<LayoutItem>;
    player: Array<LayoutItem>;
  };
  // hustlers: Array<HustlerConfig>;
  ryo_config: RyoConfig;
  season_settings_modes: SeasonSettingsModes;
};

export type Config = {
  ryo: RyoConfig;
  ryoAddress: RyoAddress;
  drug: DrugConfigFull[];
  location: LocationConfigFull[];
  // items: HustlerItemBaseConfigFull[];
  // tiers: HustlerItemTiersConfig[];
  encounterStats: EncounterStatsConfig[];
  config: GetConfig;

  componentValues: ComponentValueEvent[];
  dopewarsItemsTiers: DopewarsItemTier[];
  dopewarsItemsTierConfigs: DopewarsItemTierConfig[];
};

type ConfigStoreProps = {
  client: GraphQLClient;
  dojoProvider: DojoProvider;
  rpcProvider: RpcProvider;
  manifest: any;
};

export class ConfigStoreClass {
  client: GraphQLClient;
  dojoProvider: DojoProvider;
  rpcProvider: RpcProvider;
  manifest: any;

  config: Config | undefined = undefined;

  isLoading = false;
  isInitialized = false;
  error: any | undefined = undefined;

  constructor({ client, dojoProvider, rpcProvider, manifest }: ConfigStoreProps) {
    // console.log("new ConfigStoreClass");

    this.client = client;
    this.dojoProvider = dojoProvider;
    this.rpcProvider = rpcProvider;
    this.manifest = manifest;

    makeObservable(this, {
      config: observable,
      isLoading: observable,
      init: flow,
    });
  }

  *init(): Generator<any, any, any> {
    this.isInitialized = false;

    this.config = undefined;

    const data = (yield this.client.request(ConfigDocument, {})) as ConfigQuery;

    /*************************************************** */

    const ryoConfigEdges = data.dopewarsRyoConfigModels!.edges as RyoConfigEdge[];
    const ryoConfig = ryoConfigEdges[0]!.node as RyoConfig;

    const ryoAddressEdges = data.dopewarsRyoAddressModels!.edges as RyoAddressEdge[];
    const ryoAddress = ryoAddressEdges[0]!.node as RyoAddress;

    /*************************************************** */

    const drugConfigEdges = data.dopewarsDrugConfigModels!.edges as DrugConfigEdge[];
    const drugConfig = drugConfigEdges.map((i) => i.node as DrugConfig);

    //

    const locationConfigEdges = data.dopewarsLocationConfigModels!.edges as LocationConfigEdge[];
    const locationConfig = locationConfigEdges.map((i) => i.node as LocationConfig);

    //

    //

    const encounterStatsConfigEdges = data.dopewarsEncounterStatsConfigModels!.edges as EncounterStatsConfigEdge[];
    const encounterStatsConfig = encounterStatsConfigEdges.map((i) => i.node as EncounterStatsConfig);

    /*************************************************** */

    const drugConfigFull = drugConfig.map((i) => {
      return {
        ...i,
        name: shortString.decodeShortString(i?.name?.value),
        icon: drugIcons[i.drug as drugIconsKeys],
      } as DrugConfigFull;
    });

    const locationConfigFull = locationConfig.flatMap((i) => {
      if (i.location === "Home") return [];

      return [
        {
          ...i,
          name: shortString.decodeShortString(i?.name?.value),
          icon: locationIcons[i.location as locationIconsKeys],
        },
      ] as LocationConfigFull[];
    });

    /*************************************************** */
    const dopewarsItemsTiersEdges = data.dopewarsDopewarsItemTierModels?.edges as DopewarsItemTierEdge[];
    const dopewarsItemsTiers = dopewarsItemsTiersEdges.map((i) => i.node as DopewarsItemTier);

    const dopewarsItemsTierConfigsEdges = data.dopewarsDopewarsItemTierConfigModels
      ?.edges as DopewarsItemTierConfigEdge[];
    const dopewarsItemsTierConfigs = dopewarsItemsTierConfigsEdges.map((i) => i.node as DopewarsItemTierConfig);

    const componentValuesEdges = data.dopeComponentValueEventModels?.edges as ComponentValueEventEdge[];
    const componentValues = componentValuesEdges.map((i) => {
      const node = i.node as ComponentValueEvent;
      return {
        ...node,
        component_id: Number(node.component_id),
        collection_id: shortString.decodeShortString(node.collection_id),
        component_slug: shortString.decodeShortString(node.component_slug),
      };
    });

    // console.log(componentValues);

    /*************************************************** */

    // Make direct RPC call to avoid "pending" block ID issue
    const configContractAddress = this.manifest.contracts.find((c: any) => c.tag === "dopewars-config")?.address;
    const getConfigResult = yield this.rpcProvider.callContract(
      {
        contractAddress: configContractAddress,
        entrypoint: "get_config",
        calldata: [],
      },
      "latest",
    );

    // For now, provide a fallback config with empty layouts
    // TODO: Fix the config parsing once we understand the exact format

    // Hardcoded fallback based on the Cairo GameStoreLayout enum
    // This matches the structure from src/packing/game_store_layout.cairo
    const getConfig: GetConfig = {
      layouts: {
        game_store: [
          { name: "Markets", idx: BigInt(0), bits: BigInt(144) },
          { name: "Items", idx: BigInt(144), bits: BigInt(8) },
          { name: "Drugs", idx: BigInt(152), bits: BigInt(16) },
          { name: "Wanted", idx: BigInt(168), bits: BigInt(18) },
          { name: "Player", idx: BigInt(186), bits: BigInt(64) },
        ],
        player: [
          { name: "Cash", idx: BigInt(0), bits: BigInt(30) },
          { name: "Health", idx: BigInt(30), bits: BigInt(7) },
          { name: "Turn", idx: BigInt(37), bits: BigInt(6) },
          { name: "Status", idx: BigInt(43), bits: BigInt(2) },
          { name: "PrevLocation", idx: BigInt(45), bits: BigInt(3) },
          { name: "Location", idx: BigInt(48), bits: BigInt(3) },
          { name: "NextLocation", idx: BigInt(51), bits: BigInt(3) },
          { name: "DrugLevel", idx: BigInt(54), bits: BigInt(3) },
          { name: "Reputation", idx: BigInt(57), bits: BigInt(7) },
        ],
      },
      ryo_config: {} as RyoConfig,
      season_settings_modes: {} as SeasonSettingsModes,
    };

    console.log("Parsed config:", {
      layouts: getConfig.layouts,
      gameStoreItems: getConfig.layouts.game_store?.length || 0,
      playerItems: getConfig.layouts.player?.length || 0,
    });

    /*************************************************** */

    this.config = {
      ryo: ryoConfig,
      ryoAddress: ryoAddress,
      drug: drugConfigFull,
      location: locationConfigFull,

      componentValues,
      dopewarsItemsTiers,
      dopewarsItemsTierConfigs,

      encounterStats: encounterStatsConfig,
      /// @ts-ignore
      config: getConfig as GetConfig,
    };

    this.isInitialized = true;
    // console.log("config:", this.config);
  }

  getDrug(drugs_mode: string, drug: string): DrugConfigFull {
    return this.config?.drug.find((i) => i.drugs_mode === drugs_mode && i.drug.toLowerCase() === drug.toLowerCase())!;
  }

  getDrugById(drugs_mode: string, drug_id: number): DrugConfigFull {
    return this.config?.drug.find((i) => i.drugs_mode === drugs_mode && Number(i.drug_id) === Number(drug_id))!;
  }

  getLocation(location: string): LocationConfigFull {
    return this.config?.location.find((i) => i.location.toLowerCase() === location.toLowerCase())!;
  }

  getLocationById(location_id: number): LocationConfigFull {
    return this.config?.location.find((i) => Number(i.location_id) === Number(location_id))!;
  }

  // layout

  getGameStoreLayoutItem(name: string): LayoutItem {
    // return this.config?.config.layouts.game_store.find((i) => shortString.decodeShortString(i.name) === name)!;
    return this.config?.config.layouts.game_store.find((i) => i.name === name)!;
  }
  getPlayerLayoutItem(name: string): LayoutItem {
    // return this.config?.config.layouts.player.find((i) => shortString.decodeShortString(i.name) === name)!;
    return this.config?.config.layouts.player.find((i) => i.name === name)!;
  }

  // loot

  getGearItemFull(gearItem: GearItem): GearItemFull {
    const tier = this.getGearItemTier(gearItem)?.tier;
    const tierConfig = this.config?.dopewarsItemsTierConfigs.find(
      (i) => i.slot_id === gearItem.slot && i.tier === tier,
    )!;

    const item = this.config?.componentValues.find(
      (i) => i.collection_id === "DopeGear" && i.component_id === gearItem.slot && i.id === gearItem.item,
    );

    return {
      gearItem,
      name: item?.value,
      tier,
      levels: tierConfig?.levels!.map((i) => {
        return { cost: Number(i?.cost), stat: Number(i?.stat) };
      }),
    };
  }

  getGearItemTier(gearItem: GearItem) {
    return this.config?.dopewarsItemsTiers.find((i) => i.slot_id === gearItem.slot && i.item_id === gearItem.item);
  }
}
