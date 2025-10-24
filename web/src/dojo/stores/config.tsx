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
import { Contract, ProviderInterface, shortString } from "starknet";
import { ABI as configAbi } from "../abis/configAbi";
import { drugIcons, drugIconsKeys, locationIcons, locationIconsKeys } from "../helpers";
import {
  CashMode,
  DrugsMode,
  EncountersMode,
  EncountersOddsMode,
  HealthMode,
  ItemSlot,
  TurnsMode,
  // WantedMode,
} from "../types";
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
  // wanted_modes: Array<WantedMode>;
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

    const configContractAddress = this.manifest.contracts.find((c: any) => c.tag === "dopewars-config")?.address;
    if (!configContractAddress) {
      throw new Error("Config contract address not found in manifest");
    }

    const provider = this.dojoProvider.provider as unknown as ProviderInterface;
    const getConfigRaw = (yield this.fetchConfigWithLatestBlock(provider, configContractAddress)) as {
      layouts: { game_store: Array<any>; player: Array<any> };
      ryo_config: any;
      season_settings_modes: any;
    };

    const toBigInt = (value: any): bigint => {
      if (typeof value === "bigint") {
        return value;
      }
      if (typeof value === "number") {
        return BigInt(value);
      }
      if (typeof value === "string") {
        if (value.startsWith("0x")) {
          return BigInt(value);
        }
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
          return BigInt(0);
        }
        return BigInt(parsed);
      }
      return BigInt(value ?? 0);
    };

    const decodeLayoutName = (value: any): string => {
      if (typeof value === "string" && !value.startsWith("0x")) {
        return value;
      }

      const hex =
        typeof value === "string"
          ? value.startsWith("0x")
            ? value
            : `0x${toBigInt(value).toString(16)}`
          : `0x${toBigInt(value).toString(16)}`;

      try {
        return shortString.decodeShortString(hex);
      } catch {
        return hex;
      }
    };

    const mapLayout = (items: Array<any>): Array<LayoutItem> =>
      items.map((item) => ({
        name: decodeLayoutName(item.name),
        idx: toBigInt(item.idx),
        bits: toBigInt(item.bits),
      }));

    const toBool = (value: any): boolean => {
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        return value === "0x1" || value === "1";
      }
      return Boolean(Number(value ?? 0));
    };

    const toNumber = (value: any): number => Number(value ?? 0);

    const mapModes = <T extends Record<string, string>>(
      values: Array<any> | undefined,
      enumObj: T,
    ): Array<T[keyof T]> => {
      const options = Object.values(enumObj) as Array<T[keyof T]>;

      return (values ?? []).map((value) => {
        if (typeof value === "string" && !value.startsWith("0x")) {
          return value as T[keyof T];
        }
        const index = Number(value);
        return options[index] ?? (options[0] as T[keyof T]);
      });
    };

    const rawRyoConfig = getConfigRaw.ryo_config ?? {};

    const getConfig: GetConfig = {
      layouts: {
        game_store: mapLayout(getConfigRaw.layouts?.game_store ?? []),
        player: mapLayout(getConfigRaw.layouts?.player ?? []),
      },
      ryo_config: {
        ...rawRyoConfig,
        key: toNumber(rawRyoConfig.key),
        initialized: toBool(rawRyoConfig.initialized),
        paused: toBool(rawRyoConfig.paused),
        season_version: toNumber(rawRyoConfig.season_version),
        season_duration: toNumber(rawRyoConfig.season_duration),
        season_time_limit: toNumber(rawRyoConfig.season_time_limit),
        paper_fee: toNumber(rawRyoConfig.paper_fee),
        paper_reward_launderer: toNumber(rawRyoConfig.paper_reward_launderer),
        treasury_fee_pct: toNumber(rawRyoConfig.treasury_fee_pct),
        treasury_balance: toNumber(rawRyoConfig.treasury_balance),
      } as RyoConfig,
      season_settings_modes: {
        cash_modes: mapModes(getConfigRaw.season_settings_modes?.cash_modes, CashMode),
        health_modes: mapModes(getConfigRaw.season_settings_modes?.health_modes, HealthMode),
        turns_modes: mapModes(getConfigRaw.season_settings_modes?.turns_modes, TurnsMode),
        encounters_modes: mapModes(getConfigRaw.season_settings_modes?.encounters_modes, EncountersMode),
        encounters_odds_modes: mapModes(
          getConfigRaw.season_settings_modes?.encounters_odds_modes,
          EncountersOddsMode,
        ),
        drugs_modes: mapModes(getConfigRaw.season_settings_modes?.drugs_modes, DrugsMode),
        // wanted_modes: mapModes(getConfigRaw.season_settings_modes?.wanted_modes, WantedMode),
      },
    };

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

  /** jinius
   * Dojo's typed `call` helper defaults to `block_id: "pending"`, which our RPC gateway
   * (and several hosted providers) currently reject. To stay aligned with upstream data
   * structures while avoiding the `block_id` failure we issue the call manually with
   * `blockIdentifier: "latest"`.
   *
   * NOTE: When the upstream gateway accepts `pending` again we can revert to the
   * original `dojoProvider.call` path (see commented block below) and delete this helper.
   */
  private async fetchConfigWithLatestBlock(
    provider: ProviderInterface,
    configContractAddress: string,
  ): Promise<any> {
    const configContract = new Contract(configAbi, configContractAddress, provider);
    return configContract.call("get_config", [], { blockIdentifier: "latest" });
  }

  // Legacy approach kept for reviewers/context:
  // const getConfig = await this.dojoProvider.call("dopewars", {
  //   contractName: "config",
  //   entrypoint: "get_config",
  //   calldata: [],
  // });
}
