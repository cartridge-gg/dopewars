import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";
import { StoreApi, createStore } from "zustand";

import {
  GameOverEventsDocument,
  GameOverEventsQuery,
  HallOfFameDocument,
  HallOfFameQuery,
  Leaderboard,
  World__Event,
  World__EventEdge,
  World__ModelEdge
} from "@/generated/graphql";
import { formatEther } from "@/utils/ui";
import { GameOverData, parseEvent } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { ConfigStore } from "./config";

export interface RyoStore {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
  version: string | null;
  leaderboardEntries: GameOverData[] | null;
  hallOfFame: Leaderboard[] | null;
  init: (version: string) => void;
  subscribe: (version: string) => void;
  execute: (version: string) => void;
  reset: () => void;
}

type RyoStoreProps = {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
};

export const createRyoStore = ({ client, wsClient, configStore }: RyoStoreProps) => {
  return createStore<RyoStore>((set, get) => ({
    client,
    wsClient,
    configStore,
    version: null,
    leaderboardEntries: null,
    hallOfFame: null,
    init: (version: string) => {
      if (get().version === null) {
        get().subscribe(version);
      }
    },
    reset: () => {
      // for (let unsubscribe of get().handles) {
      //   unsubscribe();
      // }
      set({ version: null, leaderboardEntries: null, hallOfFame: null });
    },
    subscribe: async (version: string) => {
      const { wsClient } = get();

      await get().execute(version);

      set({ version: version });
    },
    execute: async (version: string) => {
      const gameEventsData = (await client.request(GameOverEventsDocument, {
        gameOverSelector: WorldEvents.GameOver,
        // @ts-ignore
        version: `0x${version.toString(16)}`,
      })) as GameOverEventsQuery;

      const hallOfFameData = (await client.request(HallOfFameDocument, {})) as HallOfFameQuery;

      // parse GameOverData
      const eventsEdges = gameEventsData.events?.edges as World__EventEdge[];
      const eventsNodes = eventsEdges.map((i: World__EventEdge) => i.node as World__Event);
      const parsedEvents = eventsNodes.map((i: World__Event) => {
        return parseEvent(i) as GameOverData;
      });

      // parse hallOfFameData
      const hallOfFameEdges = hallOfFameData.leaderboardModels?.edges as World__ModelEdge[];
      const hallOfFameNodes = hallOfFameEdges.map((i: World__ModelEdge) => i.node as Leaderboard);
      const hallOfFame = hallOfFameNodes.map((i: Leaderboard) => {
        return {
          ...i,
          paper_balance: formatEther(i.paper_balance),
        } as Leaderboard;
      });

      const sortedEvents = parsedEvents.sort((a, b) => b.cash - a.cash);
      const sortedHallOfFame = hallOfFame.sort((a, b) => a.version - b.version);

      set({ leaderboardEntries: sortedEvents, hallOfFame: sortedHallOfFame });
    },
  }));
};
