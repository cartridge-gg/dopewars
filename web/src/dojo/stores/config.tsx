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
import { Contract, TypedContractV2, shortString } from "starknet";
import { ABI as configAbi } from "../abis/configAbi";
import {
  drugIcons,
  drugIconsKeys,
  locationIcons,
  locationIconsKeys,
} from "../helpers";
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
  manifest: any;
};

export class ConfigStoreClass {
  client: GraphQLClient;
  dojoProvider: DojoProvider;
  manifest: any;

  config: Config | undefined = undefined;

  isLoading = false;
  isInitialized = false;
  error: any | undefined = undefined;

  constructor({ client, dojoProvider, manifest }: ConfigStoreProps) {
    // console.log("new ConfigStoreClass");

    this.client = client;
    this.dojoProvider = dojoProvider;
    this.manifest = manifest;

    makeObservable(this, {
      config: observable,
      isLoading: observable,
      init: flow,
    });
  }

  *init() {
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
      // if (i.location === "Home") return [];
      if (i.location_id === 0) return [];

      return [
        {
          ...i,
          name: shortString.decodeShortString(i?.name?.value),
          icon: locationIcons[i.location as locationIconsKeys],
        },
      ] as LocationConfigFull[];
    });

    console.log(locationConfigFull)
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

    ///@ts-ignore
    const getConfig = yield this.dojoProvider.call("dopewars", {
      contractName: "config",
      entrypoint: "get_config",
      calldata: [],
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
