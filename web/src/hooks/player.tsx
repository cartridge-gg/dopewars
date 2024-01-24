import { GraphQLClient, gql } from "graphql-request";
import { Client, createClient } from "graphql-ws";
import { create } from "zustand";
import { getEntityIdFromKeys } from "@dojoengine/utils";

import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import {
  World__EntityEdge,
  Player,
  Drug,
  Item,
  PlayerEntityDocument,
  PlayerEntityRelatedDataSubscriptionDocument,
  PlayerEntityQuery,
  PlayerEntitySubscriptionDocument,
  World__Subscription,
  Encounter,
  MarketPacked,
} from "@/generated/graphql";
import { isUint16Array } from "util/types";

export interface PlayerEntityStore {
  client: GraphQLClient | null;
  wsClient: Client | null;
  id: string | null;
  playerEntity: PlayerEntity | null;
  initPlayerEntity: (gameId: string, playerId: string) => void;
  unsubscribers: Array<() => void>;
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
  unsubscribers: [],
  reset: () => {
    for (let unsubscribe of get().unsubscribers) {
      unsubscribe();
    }
    const wsClient = get().wsClient;
    wsClient && wsClient.dispose();
    set({ client: null, wsClient: null, id: null, playerEntity: null, unsubscribers: [] });
  },
}));

const subscribe = async (gameId: string, playerId: string) => {
  const { wsClient, unsubscribers } = usePlayerEntityStore.getState();
  const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

  //load playerEntity
  await executeQuery(gameId, playerId);

  //subscribe to playerEntity changes / Markets changes
  unsubscribers.push(
    usePlayerEntityStore.getState().wsClient!.subscribe(
      {
        query: PlayerEntitySubscriptionDocument,
        variables: {
          id,
        },
      },
      {
        next: onPlayerEntityData,
        error: (error) => console.log({ error }),
        complete: () => console.log("complete"),
      },
    ),
  );

  //subscribe to player Drug / Items / Encounter 
  for (let drugId of [0, 1, 2, 3, 4, 5]) {
    const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId), BigInt(drugId)]);

    unsubscribers.push(
      usePlayerEntityStore.getState().wsClient!.subscribe(
        {
          query: PlayerEntityRelatedDataSubscriptionDocument,
          variables: {
            id,
          },
        },
        {
          next: onPlayerEntityRelatedData,
          error: (error) => console.log({ error }),
          complete: () => console.log("complete"),
        },
      ),
    );
  }

  usePlayerEntityStore.setState({ id: id, unsubscribers: unsubscribers });
};

const executeQuery = async (gameId: string, playerId: string) => {
  const data = (await usePlayerEntityStore.getState().client!.request(PlayerEntityDocument, {
    gameId: gameId,
    playerId: playerId,
  })) as PlayerEntityQuery;

  const edges = data!.entities!.edges as World__EntityEdge[];

  if (edges && edges[0] && edges[0].node) {
    const player = PlayerEntity.create(data?.entities?.edges as World__EntityEdge[]);
    usePlayerEntityStore.setState({ playerEntity: player });
  }
};

const onPlayerEntityData = ({ data }: { data: World__Subscription }) => {
  if (!data?.entityUpdated?.models) return;
  // update player
  let playerUpdate = data?.entityUpdated?.models.find((i) => i?.__typename === "Player") as Player;
  if (playerUpdate) {
    usePlayerEntityStore.setState((state) => ({
      playerEntity: state.playerEntity?.update(playerUpdate),
    }));
  }

  // update markets
  let marketUpdate = data?.entityUpdated?.models.find((i) => i?.__typename === "MarketPacked") as MarketPacked;
  if (marketUpdate && marketUpdate.packed) {
    usePlayerEntityStore.setState((state) => ({
      playerEntity: state.playerEntity?.updateMarkets(marketUpdate),
    }));
  }

  //console.log("updated : Player");
};

const onPlayerEntityRelatedData = ({ data }: { data: World__Subscription }) => {
  if (!data?.entityUpdated?.models) return;

  for (let model of data?.entityUpdated?.models) {
    if (model && model.__typename === "Drug") {
      usePlayerEntityStore.setState((state) => ({
        playerEntity: state.playerEntity?.updateDrug(model as unknown as Drug),
      }));
      // console.log(`updated : Drug`);
    }

    if (model && model.__typename === "Item") {
      usePlayerEntityStore.setState((state) => ({
        playerEntity: state.playerEntity?.updateItem(model as unknown as Item),
      }));
      // console.log(`updated : Item`);
    }

    if (model && model.__typename === "Encounter") {
      usePlayerEntityStore.setState((state) => ({
        playerEntity: state.playerEntity?.updateEncounter(model as unknown as Encounter),
      }));
      // console.log(`updated : Encounter`);
    }
  }
};
