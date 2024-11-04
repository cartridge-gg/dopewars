import {
  ConfigDocument,
  ConfigQuery,
  Dopewars_DrugConfig as DrugConfig,
  Dopewars_DrugConfigEdge as DrugConfigEdge,
  Dopewars_EncounterStatsConfig as EncounterStatsConfig,
  Dopewars_EncounterStatsConfigEdge as EncounterStatsConfigEdge,
  Dopewars_GameConfig as GameConfig,
  Dopewars_HustlerItemBaseConfig as HustlerItemBaseConfig,
  Dopewars_HustlerItemBaseConfigEdge as HustlerItemBaseConfigEdge,
  Dopewars_HustlerItemTiersConfig as HustlerItemTiersConfig,
  Dopewars_HustlerItemTiersConfigEdge as HustlerItemTiersConfigEdge,
  Dopewars_LocationConfig as LocationConfig,
  Dopewars_LocationConfigEdge as LocationConfigEdge,
  Dopewars_RyoAddress as RyoAddress,
  Dopewars_RyoAddressEdge as RyoAddressEdge,
  Dopewars_RyoConfig as RyoConfig,
  Dopewars_RyoConfigEdge as RyoConfigEdge,
  Dopewars_SeasonSettings as SeasonSettings,
} from "@/generated/graphql";
import { DojoProvider } from "@dojoengine/core";
import { GraphQLClient } from "graphql-request";
import { flow, makeObservable, observable } from "mobx";
import React from "react";
import { Contract, TypedContractV2, shortString } from "starknet";
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
import { CashMode, DrugsMode, EncountersMode, EncountersOddsMode, HealthMode, ItemSlot, TurnsMode } from "../types";

export type DrugConfigFull = Omit<DrugConfig, "name"> & { icon: React.FC; name: string };
export type LocationConfigFull = Omit<LocationConfig, "name"> & { icon: React.FC; name: string };

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

export type HustlerItemBaseConfigFull = HustlerItemBaseConfig & {
  icon: React.FC;
};

export type HustlerConfig = {
  hustler_id: number;
  weapon: HustlerItemConfig;
  clothes: HustlerItemConfig;
  feet: HustlerItemConfig;
  transport: HustlerItemConfig;
};

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
  hustlers: Array<HustlerConfig>;
  ryo_config: RyoConfig;
  season_settings_modes: SeasonSettingsModes;
};

export type Config = {
  ryo: RyoConfig;
  ryoAddress: RyoAddress;
  drug: DrugConfigFull[];
  location: LocationConfigFull[];
  items: HustlerItemBaseConfigFull[];
  tiers: HustlerItemTiersConfig[];
  encounterStats: EncounterStatsConfig[];
  config: GetConfig;
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

    const hustlerItemBaseConfigEdges = data.dopewarsHustlerItemBaseConfigModels!.edges as HustlerItemBaseConfigEdge[];
    const hustlerItemBaseConfig = hustlerItemBaseConfigEdges.map((i) => {
      return {
        ...i.node,
        name: shortString.decodeShortString(i.node?.name),
        icon: itemIcons[shortString.decodeShortString(i.node?.name) as itemsIconsKeys],
      } as HustlerItemBaseConfigFull;
    });

    //

    const hustlerItemTiersConfigEdges = data.dopewarsHustlerItemTiersConfigModels!
      .edges as HustlerItemTiersConfigEdge[];
    const hustlerItemTiersConfig = hustlerItemTiersConfigEdges.map((i) => i.node as HustlerItemTiersConfig);

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
      items: hustlerItemBaseConfig,
      tiers: hustlerItemTiersConfig,
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

  // hustlers

  getHustlerById(id: number): HustlerConfig {
    return this.config?.config.hustlers.find((i) => Number(i.hustler_id) === Number(id))!;
  }

  getHustlerItemByIds(id: number, slot_id: number, level: number): HustlerItemConfigFull {
    const base_config = this.config?.items.find(
      (i) => Number(i.id) === Number(id) && Number(i.slot_id) === Number(slot_id),
    )!;

    const tier = base_config.initial_tier + level;
    const tier_config = this.config?.tiers.find(
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
  }
}
