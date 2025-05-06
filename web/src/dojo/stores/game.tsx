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
import { Entities, Entity, Subscription, ToriiClient, Ty } from "@dojoengine/torii-client";
import { parseStruct } from "../utils";
import { num } from "starknet";
import { NextRouter } from "next/router";
import { PlayerStatus } from "../types";
import { parseModels } from "@dope/dope-sdk";
import { GameWithTokenIdCreated } from "@/components/layout/GlobalEvents";

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

  allGameWithTokenIdCreated: GameWithTokenIdCreated[] = [];

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
      getGameWithTokenIdCreated: flow,
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
  //////////////////////////////////////////////
  *loadGameEvents() {
    const entities: Entities = yield this.toriiClient.getEventMessages({
      clause: {
        Keys: {
          keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
          models: [],
          pattern_matching: "FixedLen",
        },
      },

      pagination: {
        limit: 10_000,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
      },
      no_hashed_keys: false,
      models: [],
      historical: true,
    });

    if (entities.items.length === 0) return;

    this.gameEvents = new EventClass(this.configStore, this.gameInfos!, entities.items);
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
      pagination: {
        limit: 10,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
      },
      no_hashed_keys: true,
      models: ["dopewars-Game", "dopewars-GameStorePacked"],
      historical: false,
    });

    // console.log(entities)
    // const gameEntity = Object.values(entities)[0];
    // if (!gameEntity) return;

    // const gameInfos = parseStruct(gameEntity["dopewars-Game"]) as Game;
    // const gameStorePacked = parseStruct(gameEntity["dopewars-GameStorePacked"]) as GameStorePacked;

    const gameInfos = parseStruct(entities.items[0].models["dopewars-Game"]) as Game;
    const gameStorePacked = parseModels(entities, "dopewars-GameStorePacked")[0] as GameStorePacked;

    if (!gameInfos || !gameStorePacked) return;

    this.gameInfos = gameInfos;
    this.gameStorePacked = gameStorePacked;
  }

  *loadGameWithTokenId(gameId: string) {
    const entities: Entities = yield this.toriiClient.getEntities({
      clause: {
        Member: {
          member: "game_id",
          model: "dopewars-GameWithTokenId",
          operator: "Eq",
          value: { Primitive: { U32: Number(gameId) } },
        },
      },
      pagination: {
        limit: 100,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
      },
      no_hashed_keys: true,
      models: [],
      historical: false,
    });

    const gameWithTokenId = parseModels(entities, "dopewars-GameWithTokenId")[0]; //as GameWithTokenId;

    if (!gameWithTokenId) return;

    gameWithTokenId.equipment_by_slot = gameWithTokenId.equipment_by_slot.map((i: string) => Number(i));
    // @ts-ignore
    gameWithTokenId.token_id_type = gameWithTokenId.token_id.activeVariant();
    // @ts-ignore
    gameWithTokenId.token_id = Number(gameWithTokenId.token_id.unwrap());

    this.gameWithTokenId = gameWithTokenId;
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
      pagination: {
        limit: 100,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
      },
      no_hashed_keys: true,
      models: ["dopewars-SeasonSettings", "dopewars-GameConfig"],
      historical: false,
    });

    // const seasonEntity = Object.values(entities)[0];
    // if (!seasonEntity) return;

    // const seasonSettings = parseStruct(seasonEntity["dopewars-SeasonSettings"]) as SeasonSettings;
    // const gameConfig = parseStruct(seasonEntity["dopewars-GameConfig"]) as GameConfig;

    if (!entities.items[0]) return;

    const seasonSettings = parseStruct(entities.items[0].models["dopewars-SeasonSettings"]) as SeasonSettings;
    const gameConfig = parseStruct(entities.items[0].models["dopewars-GameConfig"]) as GameConfig;

    if (!gameConfig || !seasonSettings) return;

    this.seasonSettings = seasonSettings;
    this.gameConfig = gameConfig;
  }

  onEventMessage(key: string, entity: Entity) {
    if (key === "0x0") return;
    // console.log("onEventMessage", entity, update);
    this.gameEvents!.addEvent(entity);
  }

  onEntityUpdated(key: string, entity: Entity) {
    // console.log("onEntityUpdated", key, entity);

    const gameId = num.toHexString(this.gameInfos?.game_id);

    const prevState = this.game?.player;

    if (entity.models["dopewars-GameStorePacked"]) {
      this.gameStorePacked = parseStruct(entity.models["dopewars-GameStorePacked"]);
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

  *getGameWithTokenIdCreated(gameId: number) {
    const loaded = this.allGameWithTokenIdCreated.find((i) => i.game_id === gameId);
    if (loaded) return loaded;

    const entities: Entities = yield this.toriiClient.getEventMessages({
      clause: {
        Member: {
          member: "game_id",
          model: "dopewars-GameWithTokenIdCreated",
          operator: "Eq",
          value: { Primitive: { U32: Number(gameId) } },
        },
      },
      pagination: {
        limit: 10,
        cursor: undefined,
        direction: "Forward",
        order_by: [],
      },
      no_hashed_keys: true,
      models: [],
      historical: false,
    });


    const game = parseModels(entities, "dopewars-GameWithTokenIdCreated")[0];
    if (game) {
      // @ts-ignore
      game.token_id_type = game.token_id.activeVariant();
      // @ts-ignore
      game.token_id = Number(game.token_id.unwrap());
      this.allGameWithTokenIdCreated.push(game);
    }
    return game;
  }
}
