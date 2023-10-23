import { GraphQLClient, gql } from "graphql-request";
import { Client, createClient } from "graphql-ws";
import { create } from "zustand";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import {
  EntityEdge,
  Player,
  PlayerEntityDocument,
  PlayerEntityQuery,
  PlayerEntitySubscriptionDocument,
} from "@/generated/graphql";

export interface PlayerEntityStore {
  client: Client | null;
  wsClient: GraphQLClient | null;
  id: string | null;
  playerEntity: PlayerEntity | null;
  initPlayerEntity: (gameId: string, playerId: string) => void;
  unsubscribe: () => void;
  reset: () => void;
}

export const usePlayerEntityStore = create<PlayerEntityStore>((set, get) => ({
  client: null,
  wsClient: null,
  id: null,
  playerEntity: null,
  initPlayerEntity: (gameId: string, playerId: string) => {
    if (!get().client) {
      set({
        client: new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!),
      });
    }
    if (!get().wsClient) {
      set({
        wsClient: createClient({
          url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS!,
        }),
      });
    }

    if (get().id === null) {
      subscribe(gameId, playerId);
    }
  },
  unsubscribe: () => {},
  reset: () => {
    get().unsubscribe();
    get().client?.terminate();
    set({ client: null, wsClient: null, id: null, playerEntity: null });
  },
}));

const subscribe = async (gameId: string, playerId: string) => {
  const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);
  usePlayerEntityStore.setState({ id: id });

  const data = await executeQuery(gameId, playerId);
  const unsubscribe = usePlayerEntityStore.getState().wsClient!.subscribe(
    {
      query: PlayerEntitySubscriptionDocument,
      variables: {
        id,
      },
    },
    {
      next: ({ data }) => {
        console.log("next : ", data);

        // update player
        const player = usePlayerEntityStore.getState().playerEntity!;
        player.update(data.entityUpdated.models[0] as Player);

        usePlayerEntityStore.setState({ playerEntity: player });

        // force to load drugs & items
        executeQuery(gameId, playerId);
        //console.log(data)
      },
      error: (error) => console.log({ error }),
      complete: () => console.log("complete"),
    },
  );

  usePlayerEntityStore.setState({ unsubscribe: unsubscribe });
};

const executeQuery = async (gameId: string, playerId: string) => {
  const data = (await usePlayerEntityStore
    .getState()
    .client!.request(PlayerEntityDocument, {
      gameId: gameId,
      playerId: playerId,
    })) as PlayerEntityQuery;

  const edges = data!.entities!.edges as EntityEdge[];

  if (edges && edges[0] && edges[0].node) {
    const player = PlayerEntity.create(data?.entities?.edges as EntityEdge[]);
    usePlayerEntityStore.setState({ playerEntity: player });
  }
};
