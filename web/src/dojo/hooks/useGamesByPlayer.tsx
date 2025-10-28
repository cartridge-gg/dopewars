import {
  Dopewars_V0_Game as Game,
  Dopewars_V0_GameConfig as GameConfig,
  Dopewars_V0_GameStorePacked as GameStorePacked,
  Dopewars_V0_SeasonSettings as SeasonSettings,
  World__EntityEdge,
  useAllGameConfigQuery,
  useAllSeasonSettingsQuery,
  useGamesByPlayerQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { GameClass } from "../class/Game";
import { useDojoContext } from "./useDojoContext";
import { Drugs } from "../types";
import { Entities, ToriiClient } from "@dojoengine/torii-client";
import { DojoEvent, EventClass } from "../class/Events";
import { TradeDrug, TravelEncounter, TravelEncounterResult } from "@/components/layout/GlobalEvents";
import { num } from "starknet";
import { DW_GRAPHQL_MODEL_NS, DW_NS } from "../constants";

export type PlayerStats = {
  totalGamesPlayed: number;
  totalGamesPaid: number;
  payRate: string;
  totalPaperClaimed: number;
  bestRanking: string;

  totalCopsEncounter: number;
  totalGangEncounter: number;
  totalFight: number;
  totalRun: number;
  totalPay: number;
  tradedDrugs: {
    [Drugs.Ludes]: number;
    [Drugs.Speed]: number;
    [Drugs.Weed]: number;
    [Drugs.Shrooms]: number;
    [Drugs.Acid]: number;
    [Drugs.Ketamine]: number;
    [Drugs.Heroin]: number;
    [Drugs.Cocaine]: number;
  };
  averageReputation: number;
};

export interface GamesByPlayerInterface {
  isFetched: boolean;
  games: GameClass[];
  onGoingGames: GameClass[];
  endedGames: GameClass[];
  playerStats?: PlayerStats;
}

export interface PlayerGameInfosInterface {
  allTradedDrug: TradeDrug[];
  allTravelEncounters: TravelEncounter[];
  allTravelEncounterResults: TravelEncounterResult[];
}

export const usePlayerGameInfos = (toriiClient: ToriiClient, playerId: string): PlayerGameInfosInterface => {
  const [allTradedDrug, setAllTradedDrug] = useState<TradeDrug[]>([]);
  const [allTravelEncounters, setAllTravelEncounters] = useState<TravelEncounter[]>([]);
  const [allTravelEncounterResults, setAllTravelEncounterResults] = useState<TravelEncounterResult[]>([]);
  const {
    chains: { selectedChain },
  } = useDojoContext();
  useEffect(() => {
    const init = async () => {
      const entities = await toriiClient.getEventMessages({
        world_addresses: [selectedChain.manifest.world.address],
        clause: {
          Keys: {
            keys: [undefined, num.toHex64(playerId)],
            models: [`${DW_NS}-TradeDrug`, `${DW_NS}-TravelEncounter`, `${DW_NS}-TravelEncounterResult`],
            pattern_matching: "FixedLen",
          },
        },
        pagination: {
          limit: 10_000,
          cursor: undefined,
          direction: "Forward",
          order_by: [],
        },
        no_hashed_keys: true,
        models: [`${DW_NS}-TradeDrug`, `${DW_NS}-TravelEncounter`, `${DW_NS}-TravelEncounterResult`],
        historical: true,
      });

      console.log(entities);
      const allEvents = EventClass.parseEntities(entities.items);

      setAllTradedDrug(allEvents.filter((i) => i.eventName === "TradeDrug").map((i) => i.event as TradeDrug));
      setAllTravelEncounters(
        allEvents.filter((i) => i.eventName === "TravelEncounter").map((i) => i.event as TravelEncounter),
      );
      setAllTravelEncounterResults(
        allEvents.filter((i) => i.eventName === "TravelEncounterResult").map((i) => i.event as TravelEncounterResult),
      );
    };

    if (toriiClient && Number(playerId) !== 0) {
      init();
    }
  }, [toriiClient, playerId, selectedChain]);
  return {
    allTradedDrug,
    allTravelEncounters: allTravelEncounters,
    allTravelEncounterResults: allTravelEncounterResults,
  };
};

export const useGamesByPlayer = (toriiClient: ToriiClient, playerIdRaw: string): GamesByPlayerInterface => {
  const playerId = `0x${BigInt(playerIdRaw).toString(16)}`; // remove leading zero..
  const { data, isFetched } = useGamesByPlayerQuery({
    playerId,
  });

  const { data: allSeasonSettings } = useAllSeasonSettingsQuery({});
  const { data: allGameConfig } = useAllGameConfigQuery({});

  const { allTradedDrug, allTravelEncounters, allTravelEncounterResults } = usePlayerGameInfos(toriiClient, playerId);

  const { configStore } = useDojoContext();

  const games = useMemo(() => {
    if (!data || !allGameConfig || !allSeasonSettings) return [];

    const edges = data?.entities?.edges as World__EntityEdge[];
    const nodes = (edges || []).map((i) => i.node);

    const games = nodes.flatMap((i) => {
      const gameInfos = (i!.models || []).find((i) => i?.__typename === `${DW_NS}_Game`) as Game;
      const gameStorePacked = (i!.models || []).find(
        (i) => i?.__typename === `${DW_NS}_GameStorePacked`,
      ) as GameStorePacked;

      if (!gameInfos || !gameStorePacked) return [];
      if (gameInfos.season_version === 0) return [];

      // @ts-ignore
      gameInfos.token_id_type = gameInfos.token_id?.option;
      // @ts-ignore
      gameInfos.token_id = Number(gameInfos.token_id![gameInfos.token_id?.option as keyof typeof gameInfos.token_id]);

      const seasonSettings = allSeasonSettings?.[`${DW_GRAPHQL_MODEL_NS}SeasonSettingsModels`]?.edges?.find(
        (i) => i?.node?.season_version === gameInfos.season_version,
      )?.node as SeasonSettings;

      const gameConfig = allGameConfig?.[`${DW_GRAPHQL_MODEL_NS}GameConfigModels`]?.edges?.find(
        (i) => i?.node?.season_version === gameInfos.season_version,
      )?.node as GameConfig;

      return [new GameClass(configStore, gameInfos, seasonSettings, gameConfig, gameStorePacked)];
    });

    return games;
  }, [data, allSeasonSettings, allGameConfig, configStore]);

  const onGoingGames = useMemo(() => {
    return games.filter((i: GameClass) => !i.gameInfos.game_over);
  }, [games]);

  const endedGames = useMemo(() => {
    return games.filter((i: GameClass) => i.gameInfos.game_over);
  }, [games]);

  const playerStats = useMemo(() => {
    if (!games || !allTravelEncounters || !allTravelEncounterResults || !allTradedDrug) return undefined;

    //  return games.filter((i: GameClass) => i.gameInfos.game_over);
    const paidGames = games.filter((i: GameClass) => i.gameInfos.claimable > 0);
    const totalGamesPlayed = games.length;
    const totalGamesPaid = paidGames.length;
    const payRate = `${Number((totalGamesPaid / totalGamesPlayed) * 100).toFixed(2) || 0}%`;
    const totalPaperClaimed = paidGames.map((i: GameClass) => i.gameInfos.claimable || 0).reduce((p, c) => p + c, 0);
    const orderedRanks = games
      .flatMap((i: GameClass) => (i.gameInfos.position > 0 ? [i.gameInfos.position] : []))
      .sort((a, b) => a - b);
    const bestRanking = orderedRanks.length > 0 ? orderedRanks[0] : "Noob";

    const totalCopsEncounter = allTravelEncounters.filter((i) => i.encounter === "Cops").length || 0;
    const totalGangEncounter = allTravelEncounters.filter((i) => i.encounter === "Gang").length || 0;
    const totalFight = allTravelEncounterResults.filter((i) => i.action === "Fight").length || 0;
    const totalRun = allTravelEncounterResults.filter((i) => i.action === "Run").length || 0;
    const totalPay = allTravelEncounterResults.filter((i) => i.action === "Pay").length || 0;

    const averageReputation =
      games.map((i) => i.player.reputation).reduce((p, c) => p + c, 0) / (games.length > 0 ? games.length : 1);

    return {
      totalGamesPlayed,
      totalGamesPaid,
      payRate,
      totalPaperClaimed,
      bestRanking,

      totalCopsEncounter,
      totalGangEncounter,
      totalFight,
      totalRun,
      totalPay,
      tradedDrugs: {
        [Drugs.Ludes]: getTradeTotal(allTradedDrug, Drugs.Ludes),
        [Drugs.Speed]: getTradeTotal(allTradedDrug, Drugs.Speed),
        [Drugs.Weed]: getTradeTotal(allTradedDrug, Drugs.Weed),
        [Drugs.Shrooms]: getTradeTotal(allTradedDrug, Drugs.Shrooms),
        [Drugs.Acid]: getTradeTotal(allTradedDrug, Drugs.Acid),
        [Drugs.Ketamine]: getTradeTotal(allTradedDrug, Drugs.Ketamine),
        [Drugs.Heroin]: getTradeTotal(allTradedDrug, Drugs.Heroin),
        [Drugs.Cocaine]: getTradeTotal(allTradedDrug, Drugs.Cocaine),
      },
      averageReputation,
    };
  }, [games, allTravelEncounters, allTravelEncounterResults, allTradedDrug]);

  return {
    games: games || [],
    onGoingGames: onGoingGames || [],
    endedGames: endedGames || [],
    playerStats: playerStats || undefined,
    isFetched,
  };
};

const getTradeTotal = (allTradedDrugByPlayer: TradeDrug[], drug: Drugs) => {
  return allTradedDrugByPlayer
    .filter((i) => i.drug_id === drug && !i.is_buy)
    .map((i) => i.price * i.quantity)
    .reduce((p, c) => p + c, 0);
};
