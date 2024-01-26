import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";
import { createStore } from "zustand";

import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import {
  Drug,
  Encounter,
  Item,
  MarketPacked,
  Player,
  PlayerEntityDocument,
  PlayerEntityQuery,
  PlayerEntityRelatedDataSubscriptionDocument,
  PlayerEntitySubscriptionDocument,
  World__EntityEdge,
  World__Subscription,
} from "@/generated/graphql";

export interface PlayerStore {
  client: GraphQLClient;
  wsClient: Client;
  id: string | null;
  playerEntity: PlayerEntity | null;
  handles: Array<() => void>;
  initPlayerEntity: (gameId: string, playerId: string) => void;
  subscribe: (gameId: string, playerId: string) => void;
  executeQuery: (gameId: string, playerId: string) => void;
  reset: () => void;
}

type PlayerStoreProps = {
  client: GraphQLClient;
  wsClient: Client;
};

export const createPlayerStore = ({ client, wsClient }: PlayerStoreProps) => {
  return createStore<PlayerStore>((set, get) => ({
    client,
    wsClient,
    id: null,
    playerEntity: null,
    handles: [],
    initPlayerEntity: (gameId: string, playerId: string) => {
      if (get().id === null) {
        get().subscribe(gameId, playerId);
      }
    },
    reset: () => {
      for (let unsubscribe of get().handles) {
        unsubscribe();
      }
      // const wsClient = get().wsClient;
      // wsClient && wsClient.dispose();
      set({ id: null, playerEntity: null, handles: [] });
    },
    subscribe: async (gameId: string, playerId: string) => {
      const { wsClient, handles } = get();
      const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

      //load playerEntity
      await get().executeQuery(gameId, playerId);

      //subscribe to playerEntity changes / Markets changes
      handles.push(
        wsClient.subscribe(
          {
            query: PlayerEntitySubscriptionDocument,
            variables: {
              id,
            },
          },
          {
            next: ({ data }) => {
              return onPlayerEntityData({ set, data });
            },
            error: (error) => console.log({ error }),
            complete: () => console.log("complete"),
          },
        ),
      );

      //subscribe to player Drug / Items / Encounter
      for (let drugId of [0, 1, 2, 3, 4, 5]) {
        const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId), BigInt(drugId)]);

        handles.push(
          wsClient.subscribe(
            {
              query: PlayerEntityRelatedDataSubscriptionDocument,
              variables: {
                id,
              },
            },
            {
              next: ({ data }) => {
                return onPlayerEntityRelatedData({  set, data });
              },
              error: (error) => console.log({ error }),
              complete: () => console.log("complete"),
            },
          ),
        );
      }
      
      set({ id: id, handles: handles });
    },
    executeQuery: async (gameId: string, playerId: string) => {
      const data = (await client.request(PlayerEntityDocument, {
        gameId: gameId,
        playerId: playerId,
      })) as PlayerEntityQuery;

      const edges = data!.entities!.edges as World__EntityEdge[];

      if (edges && edges[0] && edges[0].node) {
        const player = PlayerEntity.create(data?.entities?.edges as World__EntityEdge[]);
        set({ playerEntity: player });
      }
    },
  }));
};

const onPlayerEntityData = ({  set, data }: { data: World__Subscription }) => {
  if (!data?.entityUpdated?.models) return;

  let playerUpdate = data?.entityUpdated?.models.find((i) => i?.__typename === "Player") as Player;
  if (playerUpdate) {
    set((state) => ({
      playerEntity: state.playerEntity?.update(playerUpdate),
    }));
  }

  let marketUpdate = data?.entityUpdated?.models.find((i) => i?.__typename === "MarketPacked") as MarketPacked;
  if (marketUpdate && marketUpdate.packed) {
    set((state) => ({
      playerEntity: state.playerEntity?.updateMarkets(marketUpdate),
    }));
  }
};

const onPlayerEntityRelatedData = ({  set, data }: { data: World__Subscription }) => {
  if (!data?.entityUpdated?.models) return;

  for (let model of data?.entityUpdated?.models) {
    if (model && model.__typename === "Drug") {
      set((state) => ({
        playerEntity: state.playerEntity?.updateDrug(model as unknown as Drug),
      }));
    }

    if (model && model.__typename === "Item") {
      set((state) => ({
        playerEntity: state.playerEntity?.updateItem(model as unknown as Item),
      }));
    }

    if (model && model.__typename === "Encounter") {
      set((state) => ({
        playerEntity: state.playerEntity?.updateEncounter(model as unknown as Encounter),
      }));
    }
  }
};
