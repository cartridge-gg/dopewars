import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";

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
import { action, flow, makeObservable, observable } from "mobx";
import { EventClass } from "../class/Events";
import { GameClass } from "../class/Game";
import { ConfigStoreClass } from "./config";

// export interface GameStore {
//   client: GraphQLClient;
//   wsClient: Client;
//   configStore: ConfigStoreClass;
//   id: string | null;
//   game: GameClass | null;
//   gameEvents: EventClass | null;
//   gameInfos: Game | null;
//   handles: Array<() => void>;
//   init: (gameId: string, playerId: string) => void;
//   subscribe: (gameId: string, playerId: string) => void;
//   execute: (gameId: string, playerId: string) => void;
//   reset: () => void;
// }

type GameStoreProps = {
  client: GraphQLClient;
  wsClient: Client;
  configStore: ConfigStoreClass;
};

// export const createGameStore = ({ client, wsClient, configStore }: GameStoreProps) => {
//   return createStore<GameStore>((set, get) => ({
//     client,
//     wsClient,
//     configStore,
//     id: null,
//     game: null,
//     gameEvents: null,
//     gameInfos: null,
//     handles: [],
//     init: (gameId: string, playerId: string) => {
//       if (get().id === null) {
//           get().subscribe(gameId, playerId);

//       }
//     },
//     reset: () => {
//       for (let unsubscribe of get().handles) {
//         unsubscribe();
//       }
//       set({ id: null, game: null, gameInfos: null, gameEvents: null, handles: [] });
//     },
//     subscribe: async (gameId: string, playerId: string) => {
//       const { wsClient, handles } = get();
//       const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

//       await get().execute(gameId, playerId);

//       // subscribe to GameStorePacked updates
//       handles.push(
//         wsClient.subscribe(
//           {
//             query: GameStorePackedSubscriptionDocument,
//             variables: {
//               id,
//             },
//           },
//           {
//             next: ({ data }) => {
//               return onGameStorePacked({
//                 set,
//                 data: data as World__Subscription,
//                 configStore,
//                 gameInfos: get().gameInfos!,
//               });
//             },
//             error: (error) => console.log({ error }),
//             complete: () => console.log("complete"),
//           },
//         ),
//       );

//       // subscribe to GameEvents updates
//       handles.push(
//         wsClient.subscribe(
//           {
//             query: GameEventsSubscriptionDocument,
//             variables: {
//               gameId: `0x${Number(gameId).toString(16)}`,
//             },
//           },
//           {
//             next: ({ data }) => {
//               return onGameEvent({
//                 get,
//                 set,
//                 data: data as World__Subscription,
//                 configStore,
//                 gameInfos: get().gameInfos!,
//               });
//             },
//             error: (error) => console.log({ error }),
//             complete: () => console.log("complete"),
//           },
//         ),
//       );

//       set({ id: id, handles: handles });
//     },
//     execute: async (gameId: string, playerId: string) => {
//       // gameInfos dont change, no need to subscribe to updates
//       const gameInfosData = (await client.request(GameByIdDocument, {
//         gameId: Number(gameId),
//       })) as GameByIdQuery;

//       const gameData = (await client.request(GameStorePackedDocument, {
//         gameId: gameId,
//         playerId: playerId,
//       })) as GameStorePackedQuery;

//       const gameEventsData = (await client.request(GameEventsDocument, {
//         gameId: gameId,
//       })) as GameEventsQuery;

//       // parse gameInfosData
//       const gameEdges = gameInfosData!.gameModels!.edges as World__ModelEdge[];
//       if (!gameEdges || !gameEdges[0] || !gameEdges[0].node) return;
//       let gameInfos = gameEdges[0].node as Game;
//       if (!gameInfos) return;

//       // parse gameData
//       const edges = gameData!.entities!.edges as World__EntityEdge[];
//       if (!edges || !edges[0] || !edges[0].node || !edges[0].node.models) return;

//       // parse gameStorePacked
//       let gameStorePacked = edges[0]?.node.models.find((i) => i?.__typename === "GameStorePacked") as GameStorePacked;
//       if (!gameStorePacked) return;

//       // parse gameEvent
//       const eventsEdges = gameEventsData.events?.edges as World__EventEdge[];
//       const eventsNodes = eventsEdges.map((i) => i.node as World__Event);

//       const game = new GameClass(configStore.getState(), gameInfos, gameStorePacked);
//       const gameEvents = new EventClass(configStore.getState(), gameInfos, eventsNodes);

//       set({ game, gameInfos, gameEvents });
//     },
//   }));
// };

export class GameStoreClass {
  client: GraphQLClient;
  wsClient: Client;
  configStore: ConfigStoreClass;
  //  id: string = null;
  game: GameClass | null = null;
  gameEvents: EventClass | null = null;
  gameInfos: Game | null = null;
  handles: Array<() => void> = [];

  constructor({ client, wsClient, configStore }: GameStoreProps) {
    console.log("new GameStoreClass");

    this.client = client;
    this.wsClient = wsClient;
    this.configStore = configStore;

    makeObservable(this, {
      game: observable,
      gameEvents: observable,
      gameInfos: observable,
      reset: action,
      init: flow,
      execute: flow,
      onGameStorePacked: action,
      onGameEvent: action,
    });
  }

  reset() {
    for (let unsubscribe of this.handles) {
      unsubscribe();
    }
    this.game = null;
    this.gameInfos = null;
    this.gameEvents = null;
    this.handles = [];
  }

  *init(gameId: string, playerId: string) {
    const id = getEntityIdFromKeys([BigInt(gameId), BigInt(playerId)]);

    yield this.execute(gameId, playerId);

    // subscribe to GameStorePacked updates
    this.handles.push(
      this.wsClient.subscribe(
        {
          query: GameStorePackedSubscriptionDocument,
          variables: {
            id,
          },
        },
        {
          next: ({ data }) => {
            return this.onGameStorePacked({
              data: data as World__Subscription,
            });
          },
          error: (error) => console.log({ error }),
          complete: () => console.log("complete"),
        },
      ),
    );

    // subscribe to GameEvents updates
    this.handles.push(
      this.wsClient.subscribe(
        {
          query: GameEventsSubscriptionDocument,
          variables: {
            gameId: `0x${Number(gameId).toString(16)}`,
          },
        },
        {
          next: ({ data }) => {
            return this.onGameEvent({
              data: data as World__Subscription,
            });
          },
          error: (error) => console.log({ error }),
          complete: () => console.log("complete"),
        },
      ),
    );
  }

  *execute(gameId: string, playerId: string) {
    // gameInfos dont change, no need to subscribe to updates
    const gameInfosData = (yield this.client.request(GameByIdDocument, {
      gameId: Number(gameId),
    })) as GameByIdQuery;

    const gameData = (yield this.client.request(GameStorePackedDocument, {
      gameId: gameId,
      playerId: playerId,
    })) as GameStorePackedQuery;

    const gameEventsData = (yield this.client.request(GameEventsDocument, {
      gameId: gameId,
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

    const game = new GameClass(this.configStore, gameInfos, gameStorePacked);
    const gameEvents = new EventClass(this.configStore, gameInfos, eventsNodes);

    this.gameInfos = gameInfos;
    this.game = game;
    this.gameEvents = gameEvents;
  }

  onGameStorePacked = ({ data }: { data: World__Subscription }) => {
    if (!data?.entityUpdated?.models) return;

    let gameStorePacked = data?.entityUpdated?.models.find(
      (i) => i?.__typename === "GameStorePacked",
    ) as GameStorePacked;

    if (gameStorePacked) {
      this.game = new GameClass(this.configStore, this.gameInfos!, gameStorePacked);
    }
  };

  onGameEvent = ({ data }: { data: World__Subscription }) => {
    if (!data?.eventEmitted) return;

    const worldEvent = data.eventEmitted as World__Event;
    this.gameEvents!.addEvent(worldEvent);
  };
}
