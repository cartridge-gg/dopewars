import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";
import { StoreApi, createStore } from "zustand";

import {
  Game,
  GameByIdDocument,
  GameByIdQuery,
  GameEventsDocument,
  GameEventsQuery,
  GameEventsSubscriptionDocument,
  GameStorePacked,
  GameStorePackedDocument,
  GameStorePackedQuery,
  GameStorePackedSubscriptionDocument,
  World__EntityEdge,
  World__Event,
  World__EventEdge,
  World__ModelEdge,
  World__Subscription,
} from "@/generated/graphql";
import { EventClass } from "../class/Events";
import { GameClass } from "../class/Game";
import { ConfigStore } from "./config";

export interface GameStore {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
  id: string | null;
  game: GameClass | null;
  gameEvents: EventClass | null;
  gameInfos: Game | null;
  handles: Array<() => void>;
  init: (gameId: string, playerId: string) => void;
  subscribe: (gameId: string, playerId: string) => void;
  execute: (gameId: string, playerId: string) => void;
  reset: () => void;
}

type GameStoreProps = {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
};

export const createGameStore = ({ client, wsClient, configStore }: GameStoreProps) => {
  return createStore<GameStore>((set, get) => ({
    client,
    wsClient,
    configStore,
    id: null,
    game: null,
    gameEvents: null,
    gameInfos: null,
    handles: [],
    init: (gameId: string, playerId: string) => {
      if (get().id === null) {
        get().subscribe(gameId, playerId);
      }
    },
    reset: () => {
      for (let unsubscribe of get().handles) {
        unsubscribe();
      }
      set({ id: null, game: null, gameInfos: null, handles: [] });
    },
    subscribe: async (gameId: string, playerId: string) => {
      const { wsClient, handles } = get();
      const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

      await get().execute(gameId, playerId);

      // subscribe to GameStorePacked updates
      handles.push(
        wsClient.subscribe(
          {
            query: GameStorePackedSubscriptionDocument,
            variables: {
              id,
            },
          },
          {
            next: ({ data }) => {
              return onGameStorePacked({
                set,
                data: data as World__Subscription,
                configStore,
                gameInfos: get().gameInfos!,
              });
            },
            error: (error) => console.log({ error }),
            complete: () => console.log("complete"),
          },
        ),
      );

      // subscribe to GameEvents updates
      handles.push(
        wsClient.subscribe(
          {
            query: GameEventsSubscriptionDocument,
            variables: {
              gameId: `0x${Number(gameId).toString(16)}`,
            },
          },
          {
            next: ({ data }) => {
              return onGameEvent({
                get,
                set,
                data: data as World__Subscription,
                configStore,
                gameInfos: get().gameInfos!,
              });
            },
            error: (error) => console.log({ error }),
            complete: () => console.log("complete"),
          },
        ),
      );

      set({ id: id, handles: handles });
    },
    execute: async (gameId: string, playerId: string) => {
      // gameInfos dont change, no need to subscribe to updates
      const gameInfosData = (await client.request(GameByIdDocument, {
        gameId: Number(gameId),
      })) as GameByIdQuery;

      const gameData = (await client.request(GameStorePackedDocument, {
        gameId: gameId,
        playerId: playerId,
      })) as GameStorePackedQuery;

      const gameEventsData = (await client.request(GameEventsDocument, {
        gameId: gameId,
        playerId: playerId,
      })) as GameEventsQuery;

      // parse gameInfosData
      const gameEdges = gameInfosData!.gameModels!.edges as World__ModelEdge[];
      if (!gameEdges || !gameEdges[0] || !gameEdges[0].node) return;
      let gameInfos = gameEdges[0].node as Game;
      if (!gameInfos) return;

      // parse gameData
      const edges = gameData!.entities!.edges as World__EntityEdge[];
      if (!edges || !edges[0] || !edges[0].node || !edges[0].node.models) return;

      // parse gameStorePacked
      let gameStorePacked = edges[0]?.node.models.find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;
      if (!gameStorePacked) return;

      // parse gameEvent
      const eventsEdges = gameEventsData.events?.edges as World__EventEdge[];
      const eventsNodes = eventsEdges.map((i) => i.node as World__Event);

      const game = new GameClass(configStore.getState(), gameInfos, gameStorePacked);
      const gameEvents = new EventClass(configStore.getState(), gameInfos, eventsNodes);

      set({ game, gameInfos, gameEvents });
    },
  }));
};

const onGameStorePacked = ({
  set,
  data,
  configStore,
  gameInfos,
}: {
  set:any,
  data: World__Subscription;
  configStore: StoreApi<ConfigStore>;
  gameInfos: Game;
}) => {
  if (!data?.entityUpdated?.models) return;

  let gameStorePacked = data?.entityUpdated?.models.find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;
  if (gameStorePacked) {
    set((state: GameStore) => ({
      game: new GameClass(configStore.getState(), gameInfos, gameStorePacked),
    }));
  }
};

const onGameEvent = ({
  get,
  set,
  data,
  configStore,
  gameInfos,
}: {
  get:any,
  set:any,
  data: World__Subscription;
  configStore: StoreApi<ConfigStore>;
  gameInfos: Game;
}) => {
  if (!data?.eventEmitted) return;

  const worldEvent = data.eventEmitted as World__Event;
  get().gameEvents.addEvent(worldEvent);

  console.log(get().gameEvents);
};
