import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";
import { StoreApi, createStore } from "zustand";

import { GameOverEventsDocument, GameOverEventsQuery, World__Event, World__EventEdge } from "@/generated/graphql";
import { GameOverData, parseEvent } from "../events";
import { WorldEvents } from "../generated/contractEvents";
import { ConfigStore } from "./config";

export interface RyoStore {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
  version: string | null;
  leaderboard: GameOverData[] | null;
  handles: Array<() => void>;
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
    leaderboard: null,
    handles: [],
    init: (version: string) => {
      if (get().version === null) {
        get().subscribe(version);
      }
    },
    reset: () => {
      for (let unsubscribe of get().handles) {
        unsubscribe();
      }
      set({ version: null, leaderboard: null, handles: [] });
    },
    subscribe: async (version: string) => {
      const { wsClient, handles } = get();

      await get().execute(version);

      // // subscribe to GameEvents updates
      // handles.push(
      //   wsClient.subscribe(
      //     {
      //       query: GameEventsSubscriptionDocument,
      //       variables: {
      //         gameId: `0x${Number(gameId).toString(16)}`,
      //       },
      //     },
      //     {
      //       next: ({ data }) => {
      //         return onGameEvent({get, set, data, configStore, gameInfos: get().gameInfos });
      //       },
      //       error: (error) => console.log({ error }),
      //       complete: () => console.log("complete"),
      //     },
      //   ),
      // );

      set({ version: version, handles: handles });
    },
    execute: async (version: string) => {
      const gameEventsData = (await client.request(GameOverEventsDocument, {
        gameOverSelector: WorldEvents.GameOver,
        // @ts-ignore
        version: `0x${version.toString(16)}`,
      })) as GameOverEventsQuery;

      // parse GameOverData
      const eventsEdges = gameEventsData.events?.edges as World__EventEdge[];
      const eventsNodes = eventsEdges.map((i: World__EventEdge) => i.node as World__Event);
      const parsedEvents = eventsNodes.map((i: World__Event) => {
        return parseEvent(i) as GameOverData;
      });
      const sortedEvents = parsedEvents.sort((a, b) => b.cash - a.cash);
      set({ leaderboard: sortedEvents });
    },
  }));
};

// const onGameEvent = ({
//   get,
//   set,
//   data,
//   configStore,
//   gameInfos,
// }: {
//   data: World__Subscription;
//   configStore: StoreApi<ConfigStore>;
//   gameInfos: Game;
// }) => {
//   if (!data?.eventEmitted) return;

//   const worldEvent = data.eventEmitted as World__Event;
//   get().gameEvents.addEvent(worldEvent)

//   console.log(get().gameEvents)

// };
