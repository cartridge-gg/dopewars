import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";
import { StoreApi, createStore } from "zustand";

import {
  GameStorePacked,
  GameStorePackedDocument,
  GameStorePackedQuery,
  GameStorePackedSubscriptionDocument,
  World__EntityEdge,
  World__Subscription,
} from "@/generated/graphql";
import { Game } from "../class/Game";
import { ConfigStore } from "./config";

export interface GameStore {
  client: GraphQLClient;
  wsClient: Client;
  configStore: StoreApi<ConfigStore>;
  id: string | null;
  game: Game | null;
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
      set({ id: null, game: null, handles: [] });
    },
    subscribe: async (gameId: string, playerId: string) => {
      const { wsClient, handles } = get();
      const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

      await get().execute(gameId, playerId);

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
              return onGameStorePacked({ set, data, configStore: configStore.getState() });
            },
            error: (error) => console.log({ error }),
            complete: () => console.log("complete"),
          },
        ),
      );

      set({ id: id, handles: handles });
    },
    execute: async (gameId: string, playerId: string) => {
      const data = (await client.request(GameStorePackedDocument, {
        gameId: gameId,
        playerId: playerId,
      })) as GameStorePackedQuery;

      const edges = data!.entities!.edges as World__EntityEdge[];
      if (!edges || !edges[0] || !edges[0].node || !edges[0].node.models) return;

      let gameStorePacked = edges[0]?.node.models.find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;
      if (!gameStorePacked) return;

      const game = new Game(configStore.getState(), gameStorePacked);
      set({ game });
    },
  }));
};

const onGameStorePacked = ({ set, data, configStore }: { data: World__Subscription; configStore: ConfigStore }) => {
  if (!data?.entityUpdated?.models) return;

  let gameStorePacked = data?.entityUpdated?.models.find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;
  if (gameStorePacked) {
    set((state) => ({
      game: new Game(configStore.getState(),gameStorePacked),
    }));
  }
};
