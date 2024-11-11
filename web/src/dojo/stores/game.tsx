import { GraphQLClient } from "graphql-request";

import {
  Dopewars_Game as Game,
  Dopewars_GameConfig as GameConfig,
  Dopewars_GameStorePacked as GameStorePacked,
  Dopewars_SeasonSettings as SeasonSettings,
} from "@/generated/graphql";
import { action, flow, makeObservable, observable } from "mobx";
import { EventClass } from "../class/Events";
import { GameClass } from "../class/Game";
import { ConfigStoreClass } from "./config";
import { Entities, Subscription, ToriiClient, Ty } from "@dojoengine/torii-client";
import { parseStruct } from "../utils";
import { num } from "starknet";
import { NextRouter } from "next/router";
import { PlayerStatus } from "../types";

type GameStoreProps = {
  toriiClient: ToriiClient;
  client: GraphQLClient;
  configStore: ConfigStoreClass;
  router: NextRouter;
};

export class GameStoreClass {
  toriiClient: ToriiClient;
  client: GraphQLClient;
  configStore: ConfigStoreClass;
  router: NextRouter;

  isInitialized = false;
  game: GameClass | null = null;
  gameEvents: EventClass | null = null;
  gameInfos: Game | null = null;
  gameStorePacked: GameStorePacked | null = null;
  gameConfig: GameConfig | null = null;
  seasonSettings: SeasonSettings | null = null;
  subscriptions: Array<Subscription> = [];

  constructor({ toriiClient, client, configStore, router }: GameStoreProps) {
    this.toriiClient = toriiClient;
    this.client = client;
    this.configStore = configStore;
    this.router = router;

    makeObservable(this, {
      game: observable,
      gameEvents: observable,
      gameInfos: observable,
      gameConfig: observable,
      seasonSettings: observable,
      reset: action,
      init: flow,
      loadGameInfos: flow,
      loadGameEvents: flow,
      loadSeasonSettings: flow,
      subscribe: flow,
      initGameStore: action,
      onEntityUpdated: action,
      onEventMessage: action,
    });
  }

  reset() {
    for (let subscription of this.subscriptions) {
      subscription.cancel();
    }

    this.game = null;
    this.gameInfos = null;
    this.gameConfig = null;
    this.gameEvents = null;
    this.seasonSettings = null;
    this.subscriptions = [];
    this.isInitialized = false;
  }

  *init(gameId: string) {
    yield this.loadGameInfos(gameId);
    yield this.loadSeasonSettings(this.gameInfos?.season_version);
    yield this.loadGameEvents();

    this.initGameStore();

    yield this.subscribe();

    this.isInitialized = true;
  }

  *subscribe() {
    for (let subscription of this.subscriptions) {
      subscription.cancel();
    }
    const subEntities: Subscription = yield this.toriiClient.onEntityUpdated(
      [
        {
          Keys: {
            keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
            models: ["dopewars-GameStorePacked"],
            pattern_matching: "VariableLen",
          },
        },
      ],
      (entity: any, update: any) => this.onEntityUpdated(entity, update),
    );
    this.subscriptions.push(subEntities);

    const subEvent: Subscription = yield this.toriiClient.onEventMessageUpdated(
      [
        {
          Keys: {
            keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
            models: ["dopewars-*"],
            pattern_matching: "VariableLen",
          },
        },
      ],
      true,
      (entity: any, update: any) => this.onEventMessage(entity, update),
    );
    this.subscriptions.push(subEvent);
  }

  initGameStore() {
    const game = new GameClass(
      this.configStore,
      this.gameInfos!,
      this.seasonSettings!,
      this.gameConfig!,
      this.gameStorePacked!,
    );

    this.game = game;
  }

  *loadGameEvents() {
    const entities: Entities = yield this.toriiClient.getEventMessages(
      {
        clause: {
          Keys: {
            keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
            models: [],
            pattern_matching: "FixedLen",
          },
        },
        limit: 1000,
        offset: 0,
        dont_include_hashed_keys: true,
      },
      true,
    );
    //console.log(entities);
    const gameEntity = Object.values(entities)[0];
    if (!gameEntity) return;

    this.gameEvents = new EventClass(this.configStore, this.gameInfos!, gameEntity);
  }

  *loadGameInfos(gameId: string) {
    const entities: Entities = yield this.toriiClient.getEntities({
      clause: {
        Member: {
          member: "game_id",
          model: "dopewars-Game",
          operator: "Eq",
          value: { Primitive: { U32: Number(gameId) } },
        },
      },
      limit: 1,
      offset: 0,
      dont_include_hashed_keys: true,
    });
    const gameEntity = Object.values(entities)[0];
    if (!gameEntity) return;

    const gameInfos = parseStruct(gameEntity["dopewars-Game"]) as Game;
    const gameStorePacked = parseStruct(gameEntity["dopewars-GameStorePacked"]) as GameStorePacked;

    // console.log("gameInfos", gameInfos);
    // console.log("gameStorePacked", gameStorePacked);

    this.gameInfos = gameInfos;
    this.gameStorePacked = gameStorePacked;
  }

  *loadSeasonSettings(season_version: string) {
    const entities: Entities = yield this.toriiClient.getEntities({
      clause: {
        Keys: {
          keys: [num.toHexString(season_version)],
          models: ["dopewars-SeasonSettings", "dopewars-GameConfig"],
          pattern_matching: "VariableLen",
        },
      },
      limit: 1,
      offset: 0,
      dont_include_hashed_keys: true,
    });
    const seasonEntity = Object.values(entities)[0];
    if (!seasonEntity) return;


    const seasonSettings = parseStruct(seasonEntity["dopewars-SeasonSettings"]) as SeasonSettings;
    const gameConfig = parseStruct(seasonEntity["dopewars-GameConfig"]) as GameConfig;

    // console.log("seasonSettings", seasonSettings);
    // console.log("gameConfig", gameConfig);

    this.seasonSettings = seasonSettings;
    this.gameConfig = gameConfig;
  }

  onEventMessage(entity: any, update: any) {
    // console.log("onEventMessage", entity, update);
    this.gameEvents!.addEvent(update);
  }

  onEntityUpdated(entity: any, update: any) {
    // console.log("onEntityUpdated", entity, update);
    const gameId = num.toHexString(this.gameInfos?.game_id);

    const prevState = this.game?.player;

    if (update["dopewars-GameStorePacked"]) {
      this.gameStorePacked = parseStruct(update["dopewars-GameStorePacked"]);
      this.initGameStore();

      // if dead, handled in /event/consequence
      if (this.gameEvents?.isGameOver && this.game!.player!.health > 0) {
        return this.router.push(`/${gameId}/end`);
      }

      if (this.game?.player.status === PlayerStatus.Normal) {
        const location = this.configStore
          .getLocationById(this.game.player.location.location_id)!
          .location.toLowerCase();
        if (prevState?.status !== PlayerStatus.Normal) {
          // decision -> consequence
          this.router.push(`/${gameId}/event/consequence`);
        } else {
          // normal travel
          this.router.push(`/${gameId}/${location}`);
        }
      } else {
        this.router.push(`/${gameId}/event/decision`);
      }
    }
  }
}
