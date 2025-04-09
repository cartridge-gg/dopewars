import {
  Dopewars_Game as Game,
  Dopewars_GameConfig as GameConfig,
  Dopewars_GameStorePacked as GameStorePacked,
  Dopewars_SeasonSettings as SeasonSettings,
  World__EntityEdge,
  useAllGameConfigQuery,
  useAllSeasonSettingsQuery,
  useGamesByPlayerQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { GameClass } from "../class/Game";
import { useDojoContext } from "./useDojoContext";
import { Hustlers } from "@/components/hustlers";
import { Drugs } from "../types";
import { Entities, ToriiClient } from "@dojoengine/torii-client";
import { DojoEvent, EventClass } from "../class/Events";
import { TradeDrug, TravelEncounter, TravelEncounterResult } from "@/components/layout/GlobalEvents";

export type PlayerStats = {
  totalGamesPlayed: number;
  totalGamesPaid: number;
  payRate: string;
  totalPaperClaimed: number;
  bestRanking: string;
  gamesByHustler: {
    [Hustlers.Dragon]: number;
    [Hustlers.Monkey]: number;
    [Hustlers.Rabbit]: number;
  };
  mostPlayedHustler: {
    [Hustlers.Dragon]: boolean;
    [Hustlers.Monkey]: boolean;
    [Hustlers.Rabbit]: boolean;
  };
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
  useEffect(() => {
    const init = async () => {
      const entities: Entities = await toriiClient.getEventMessages(
        {
          clause: {
            Keys: {
              keys: [undefined, playerId],
              models: ["dopewars-TradeDrug", "dopewars-TravelEncounter", "dopewars-TravelEncounterResult"],
              pattern_matching: "FixedLen",
            },
          },
          limit: 10000,
          offset: 0,
          dont_include_hashed_keys: true,
          entity_models:[],
          entity_updated_after:0,
          order_by:[]
        },
        true,
      );

      //  console.log(entities);
      const allEvents = Object.values(entities).flatMap((entity) => EventClass.parseEntity(entity));

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
  }, [toriiClient, playerId]);
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
      const gameInfos = (i!.models || []).find((i) => i?.__typename === "dopewars_Game") as Game;
      const gameStorePacked = (i!.models || []).find(
        (i) => i?.__typename === "dopewars_GameStorePacked",
      ) as GameStorePacked;

      if (!gameInfos || !gameStorePacked) return [];
      if (gameInfos.season_version === 0) return [];

      const seasonSettings = allSeasonSettings?.dopewarsSeasonSettingsModels?.edges?.find(
        (i) => i?.node?.season_version === gameInfos.season_version,
      )?.node as SeasonSettings;

      const gameConfig = allGameConfig?.dopewarsGameConfigModels?.edges?.find(
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

    const dragonGames = games.filter((i: GameClass) => i.gameInfos.hustler_id === 0).length;
    const monkeyGames = games.filter((i: GameClass) => i.gameInfos.hustler_id === 1).length;
    const rabbitGames = games.filter((i: GameClass) => i.gameInfos.hustler_id === 2).length;

    const maxPlayed = Math.max(dragonGames, monkeyGames, rabbitGames);

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
      gamesByHustler: {
        [Hustlers.Dragon]: dragonGames,
        [Hustlers.Monkey]: monkeyGames,
        [Hustlers.Rabbit]: rabbitGames,
      },
      mostPlayedHustler: {
        [Hustlers.Dragon]: dragonGames === maxPlayed,
        [Hustlers.Monkey]: monkeyGames === maxPlayed,
        [Hustlers.Rabbit]: rabbitGames === maxPlayed,
      },
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
