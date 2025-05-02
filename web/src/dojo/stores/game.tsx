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

export type GameWithTokenId = {
  game_id: number;
  player_id: bigint;
  token_id: number;
  token_id_type: string;
  equipment_by_slot: number[];
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
  gameWithTokenId: GameWithTokenId | undefined = undefined;
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
      gameWithTokenId: observable,
      gameConfig: observable,
      seasonSettings: observable,
      reset: action,
      cleanSubscriptions: action,
      init: flow,
      loadGameInfos: flow,
      loadGameWithTokenId: flow,
      loadGameEvents: flow,
      loadSeasonSettings: flow,
      subscribe: flow,
      initGameStore: action,
      onEntityUpdated: action,
      onEventMessage: action,
    });
  }

  reset() {
    this.cleanSubscriptions();

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
    yield this.loadGameWithTokenId(gameId);
    yield this.loadSeasonSettings(this.gameInfos?.season_version);
    yield this.loadGameEvents();

    this.initGameStore();

    yield this.subscribe();

    this.isInitialized = true;
  }

  cleanSubscriptions() {
    for (let subscription of this.subscriptions) {
      // cancel subscription
      subscription.cancel();
    }
    // clean subscriptions array
    this.subscriptions = [];
  }

  *subscribe() {
    yield this.cleanSubscriptions();

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
      this.gameWithTokenId,
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
        entity_models: [],
        entity_updated_after: 0,
        order_by: [],
      },
      true,
    );
    console.log(entities);
    const gameEntity = Object.values(entities)[0];
    if (!gameEntity) return;

    this.gameEvents = new EventClass(this.configStore, this.gameInfos!, gameEntity);
  }

  *loadGameInfos(gameId: string) {
    const entities: Entities = yield this.toriiClient.getEntities(
      {
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
        entity_models: [],
        // entity_models:["dopewars-Game"],
        entity_updated_after: 0,
        order_by: [],
      },
      false,
    );

    // console.log(entities)
    const gameEntity = Object.values(entities)[0];
    if (!gameEntity) return;

    const gameInfos = parseStruct(gameEntity["dopewars-Game"]) as Game;
    const gameStorePacked = parseStruct(gameEntity["dopewars-GameStorePacked"]) as GameStorePacked;

    this.gameInfos = gameInfos;
    this.gameStorePacked = gameStorePacked;
  }

  *loadGameWithTokenId(gameId: string) {
    const entities: Entities = yield this.toriiClient.getEntities(
      {
        clause: {
          Member: {
            member: "game_id",
            model: "dopewars-GameWithTokenId",
            operator: "Eq",
            value: { Primitive: { U32: Number(gameId) } },
          },
        },
        limit: 1,
        offset: 0,
        dont_include_hashed_keys: true,
        // entity_models: [],
        entity_models: ["dopewars-GameWithTokenId"],
        entity_updated_after: 0,
        order_by: [],
      },
      false,
    );

    // console.log(entities)
    const gameEntity = Object.values(entities)[0];
    if (!gameEntity) return;

    const gameWithTokenId = parseStruct(gameEntity["dopewars-GameWithTokenId"]) as GameWithTokenId;

    gameWithTokenId.equipment_by_slot = gameWithTokenId.equipment_by_slot.map((i) => Number(i));
    // @ts-ignore
    gameWithTokenId.token_id_type = gameEntity["dopewars-GameWithTokenId"].token_id.value?.option;
    // @ts-ignore
    gameWithTokenId.token_id = Number(gameEntity["dopewars-GameWithTokenId"].token_id.value?.value?.value);

    this.gameWithTokenId = gameWithTokenId;
  }

  *loadSeasonSettings(season_version: string) {
    const entities: Entities = yield this.toriiClient.getEntities(
      {
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
        // entity_models:[],
        entity_models: ["dopewars-SeasonSettings", "dopewars-GameConfig"],
        entity_updated_after: 0,
        order_by: [],
      },
      false,
    );
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
        if (this.gameEvents?.isGameOver) {
          this.router.push(`/${gameId}/event/consequence`);
        } else {
          this.router.push(`/${gameId}/event/decision`);
        }
      }
    }
  }
}
