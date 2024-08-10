import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GraphQLClient } from "graphql-request";
import { Client } from "graphql-ws";

import {
  Dopewars_Game as Game,
  GameByIdDocument,
  GameByIdQuery,
  Dopewars_GameConfig as GameConfig,
  GameConfigDocument,
  GameConfigQuery,
  GameEventsDocument,
  GameEventsQuery,
  GameEventsSubscriptionDocument,
  Dopewars_GameStorePacked as GameStorePacked,
  GameStorePackedDocument,
  GameStorePackedQuery,
  GameStorePackedSubscriptionDocument,
  Dopewars_SeasonSettings as SeasonSettings,
  SeasonSettingsDocument,
  SeasonSettingsQuery,
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

type GameStoreProps = {
  client: GraphQLClient;
  wsClient: Client;
  configStore: ConfigStoreClass;
};

export class GameStoreClass {
  client: GraphQLClient;
  wsClient: Client;
  configStore: ConfigStoreClass;
  //  id: string = null;
  isInitialized = false;
  game: GameClass | null = null;
  gameEvents: EventClass | null = null;
  gameInfos: Game | null = null;
  gameConfig: GameConfig | null = null;
  seasonSettings: SeasonSettings | null = null;
  handles: Array<() => void> = [];

  constructor({ client, wsClient, configStore }: GameStoreProps) {
    this.client = client;
    this.wsClient = wsClient;
    this.configStore = configStore;

    makeObservable(this, {
      game: observable,
      gameEvents: observable,
      gameInfos: observable,
      gameConfig: observable,
      seasonSettings: observable,
      reset: action,
      init: flow,
      loadGameInfos: flow,
      loadGameConfig: flow,
      loadSeasonSettings: flow,
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
    this.gameConfig = null;
    this.gameEvents = null;
    this.seasonSettings = null;
    this.handles = [];
    this.isInitialized = false;
  }

  *init(gameId: string /*, playerId: string*/) {
    //this.reset()

    // if(this.isInitialized){
    //   return
    // }

    yield this.loadGameInfos(gameId);
    yield this.loadGameConfig(this.gameInfos?.season_version);
    yield this.loadSeasonSettings(this.gameInfos?.season_version);

    // retrieve playerId from gameInfos
    const playerId = this.gameInfos?.player_id || "0x0";

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

    this.isInitialized = true;
  }

  *loadGameInfos(gameId: string) {
    // gameInfos dont change, no need to subscribe to updates
    const gameInfosData = (yield this.client.request(GameByIdDocument, {
      gameId: Number(gameId),
    })) as GameByIdQuery;

    // parse gameInfosData
    const gameEdges = gameInfosData!.dopewarsGameModels!.edges as World__ModelEdge[];
    if (!gameEdges || !gameEdges[0] || !gameEdges[0].node) return;
    let gameInfos = gameEdges[0].node as Game;
    if (!gameInfos) return;

    this.gameInfos = gameInfos;
  }

  *loadSeasonSettings(season_version: string) {
    // gameInfos dont change, no need to subscribe to updates
    const seasonSettingsData = (yield this.client.request(SeasonSettingsDocument, {
      version: Number(season_version),
    })) as SeasonSettingsQuery;

    // parse seasonSettingsData
    const seasonSettingsEdges = seasonSettingsData!.dopewarsSeasonSettingsModels!.edges as World__ModelEdge[];
    if (!seasonSettingsEdges || !seasonSettingsEdges[0] || !seasonSettingsEdges[0].node) return;
    let seasonSettings = seasonSettingsEdges[0].node as SeasonSettings;
    if (!seasonSettings) return;

    this.seasonSettings = seasonSettings;
  }

  *loadGameConfig(season_version: string) {
    // gameInfos dont change, no need to subscribe to updates
    const gameConfigData = (yield this.client.request(GameConfigDocument, {
      version: Number(season_version),
    })) as GameConfigQuery;

    // parse gameConfigData
    const gameConfigEdges = gameConfigData!.dopewarsGameConfigModels!.edges as World__ModelEdge[];
    if (!gameConfigEdges || !gameConfigEdges[0] || !gameConfigEdges[0].node) return;
    let gameConfig = gameConfigEdges[0].node as GameConfig;
    if (!gameConfig) return;

    this.gameConfig = gameConfig;
  }

  *execute(gameId: string, playerId: string) {
    const gameData = (yield this.client.request(GameStorePackedDocument, {
      gameId: gameId,
      playerId: playerId,
    })) as GameStorePackedQuery;

    const gameEventsData = (yield this.client.request(GameEventsDocument, {
      gameId: gameId,
    })) as GameEventsQuery;

    // parse gameData
    const edges = gameData!.entities!.edges as World__EntityEdge[];
    if (!edges || !edges[0] || !edges[0].node || !edges[0].node.models) return;

    // parse gameStorePacked
    let gameStorePacked = edges[0]?.node.models.find((i) => i?.__typename === "dopewars_GameStorePacked") as GameStorePacked;
    if (!gameStorePacked) return;

    // parse gameEvent
    const eventsEdges = gameEventsData.events?.edges as World__EventEdge[];
    const eventsNodes = eventsEdges.map((i) => i.node as World__Event);

    const game = new GameClass(
      this.configStore,
      this.gameInfos!,
      this.seasonSettings!,
      this.gameConfig!,
      gameStorePacked,
    );
    const gameEvents = new EventClass(this.configStore, this.gameInfos!, eventsNodes);

    this.game = game;
    this.gameEvents = gameEvents;
  }

  onGameStorePacked = ({ data }: { data: World__Subscription }) => {
    if (!data?.entityUpdated?.models) return;

    let gameStorePacked = data?.entityUpdated?.models.find(
      (i) => i?.__typename === "dopewars_GameStorePacked",
    ) as GameStorePacked;

    if (gameStorePacked) {
      this.game = new GameClass(
        this.configStore,
        this.gameInfos!,
        this.seasonSettings!,
        this.gameConfig!,
        gameStorePacked,
      );
    }
  };

  onGameEvent = ({ data }: { data: World__Subscription }) => {
    if (!data?.eventEmitted) return;

    const worldEvent = data.eventEmitted as World__Event;
    this.gameEvents!.addEvent(worldEvent);
  };
}
