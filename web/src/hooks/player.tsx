import { GraphQLClient, gql } from "graphql-request";
import { createClient } from "graphql-ws";

import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { create } from "zustand";
import { EntityEdge, PlayerEntityDocument } from "@/generated/graphql";

const wsClient = createClient({ url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_WS });
const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);


export interface PlayerEntityStore {
    id: string,
    playerEntity: PlayerEntity,
    initPlayerEntity: (gameId: string, playerId: string) => void;
    resetAll: () => void;
    unsubscribe: () => void;
  }
  
export const usePlayerEntityStore = create<PlayerEntityStore>((set, get) => ({
    id: null,
    playerEntity: null,
    unsubscribe: () => {},
    initPlayerEntity: (gameId: string, playerId: string) => {
        if( get().id === null ) {
            subscribe(gameId,playerId);
        }
    },
    reset: () => {
      get().unsubscribe();
      set({ id: null, playerEntity: null });
    },
  }));



  const subscribe = async (gameId: string, playerId: string) => {

    const id = await executeQuery(gameId,playerId );
    usePlayerEntityStore.setState({id: id})

    const unsubscribe = wsClient.subscribe(
        {
          query: gql`
            subscription PlayerEntitySubscription($id: String) {
              entityUpdated(id: $id) {
                id
                keys
                model_names
              }
            }
          `,
          variables:{
            id
          }
        },
        {
            next: ({ data }) => {
            console.log("next : ", data)

            executeQuery(gameId,playerId)
            console.log(data)
          },
          error: (error) => console.log({ error }),
          complete: () => console.log("complete"),
        },
      )

      usePlayerEntityStore.setState({unsubscribe: unsubscribe})
  }

  const executeQuery = async (gameId: string, playerId: string) => {
    const data = await client.request(PlayerEntityDocument, {
        "gameId": gameId,
        "playerId":playerId
    });

    const id = data.entities.edges[0].node.id;
    const player = PlayerEntity.create(data?.entities?.edges as EntityEdge[]);
    
    usePlayerEntityStore.setState({playerEntity: player})

    console.log("executeQuery : ", id)

    return id
  }
  

