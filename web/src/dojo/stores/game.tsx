import { GraphQLClient } from "graphql-request";

import { GameCreated } from "@/components/layout/GlobalEvents";
import { parseModels } from "@/dope/toriiUtils";
import {
  Dopewars_V0_Game as Game,
  Dopewars_V0_GameConfig as GameConfig,
  Dopewars_V0_GameStorePacked as GameStorePacked,
  Dopewars_V0_SeasonSettings as SeasonSettings,
} from "@/generated/graphql";
import { Entities, Entity, Subscription, ToriiClient } from "@dojoengine/torii-client";
import { action, flow, makeObservable, observable } from "mobx";
import { NextRouter } from "next/router";
import { num } from "starknet";
import { EventClass } from "../class/Events";
import { GameClass } from "../class/Game";
import { PlayerStatus } from "../types";
import { parseStruct } from "../utils";
import { ConfigStoreClass } from "./config";
import { DojoChainConfig } from "../setup/config";
import { DW_NS } from "../constants";

type GameStoreProps = {
  toriiClient: ToriiClient;
  client: GraphQLClient;
  configStore: ConfigStoreClass;
  router: NextRouter;
  selectedChain: DojoChainConfig;
};

// export type GameWithTokenId = {
//   game_id: number;
//   player_id: bigint;
//   token_id: number;
//   token_id_type: string;
//   equipment_by_slot: number[];
// };

export class GameStoreClass {
  toriiClient: ToriiClient;
  client: GraphQLClient;
  configStore: ConfigStoreClass;
  router: NextRouter;
  selectedChain: DojoChainConfig;

  isInitialized = false;
  game: GameClass | null = null;
  gameEvents: EventClass | null = null;
  gameInfos: Game | null = null;
  gameStorePacked: GameStorePacked | null = null;
  gameConfig: GameConfig | null = null;
  seasonSettings: SeasonSettings | null = null;
  subscriptions: Array<Subscription> = [];

  allGamesCreated: GameCreated[] = [];

  constructor({ toriiClient, client, configStore, router, selectedChain }: GameStoreProps) {
    this.toriiClient = toriiClient;
    this.client = client;
    this.configStore = configStore;
    this.router = router;
    this.selectedChain = selectedChain;

    makeObservable(this, {
      game: observable,
      gameEvents: observable,
      gameInfos: observable,
      gameConfig: observable,
      seasonSettings: observable,
      reset: action,
      cleanSubscriptions: action,
      init: flow,
      loadGameInfos: flow,
      loadGameEvents: flow,
      loadSeasonSettings: flow,
      subscribe: flow,
      initGameStore: action,
      onEntityUpdated: action,
      onEventMessage: action,
      getGameCreated: flow,
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
      {
        Keys: {
          keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
          models: [`${DW_NS}-GameStorePacked`],
          pattern_matching: "VariableLen",
        },
      },
      [this.selectedChain.manifest.world.address],
      (entity: Entity) => this.onEntityUpdated(entity),
    );
    this.subscriptions.push(subEntities);

    const subEvent: Subscription = yield this.toriiClient.onEventMessageUpdated(
      {
        Keys: {
          keys: [num.toHexString(this.gameInfos?.game_id), this.gameInfos?.player_id],
          models: [`${DW_NS}-*`],
          pattern_matching: "VariableLen",
        },
      },
      [this.selectedChain.manifest.world.address],
      (entity: any) => this.onEventMessage(entity),
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
  //////////////////////////////////////////////
  *loadGameEvents() {
    const entities: Entities = yield this.toriiClient.getEventMessages({
      world_addresses: [this.selectedChain.manifest.world.address],
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
      world_addresses: [this.selectedChain.manifest.world.address],
      clause: {
        Member: {
          member: "game_id",
          model: `${DW_NS}-Game`,
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
      models: [`${DW_NS}-Game`, `${DW_NS}-GameStorePacked`],
      historical: false,
    });

    // console.log(entities)
    // const gameEntity = Object.values(entities)[0];
    // if (!gameEntity) return;

    // const gameInfos = parseStruct(entities.items[0].models[`${DW_NS}-Game"]) as Game;
    const gameInfos = parseModels(entities, `${DW_NS}-Game`)[0] as Game;
    const gameStorePacked = parseModels(entities, `${DW_NS}-GameStorePacked`)[0] as GameStorePacked;

    if (!gameInfos || !gameStorePacked) return;

    // @ts-ignore
    gameInfos.game_mode = gameInfos.game_mode.activeVariant();
    gameInfos.equipment_by_slot = gameInfos.equipment_by_slot?.map((i: string) => Number(i));
    // @ts-ignore
    gameInfos.token_id_type = gameInfos.token_id.activeVariant();
    // @ts-ignore
    gameInfos.token_id = Number(gameInfos.token_id.unwrap());

    this.gameInfos = gameInfos;
    this.gameStorePacked = gameStorePacked;
  }

  *loadSeasonSettings(season_version: string) {
    const entities: Entities = yield this.toriiClient.getEntities({
      world_addresses: [this.selectedChain.manifest.world.address],
      clause: {
        Keys: {
          keys: [num.toHexString(season_version)],
          models: [`${DW_NS}-SeasonSettings`, `${DW_NS}-GameConfig`],
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
      models: [`${DW_NS}-SeasonSettings`, `${DW_NS}-GameConfig`],
      historical: false,
    });

    if (!entities.items[0]) return;

    const seasonSettings = parseStruct(entities.items[0].models[`${DW_NS}-SeasonSettings`]) as SeasonSettings;
    const gameConfig = parseStruct(entities.items[0].models[`${DW_NS}-GameConfig`]) as GameConfig;

    if (!gameConfig || !seasonSettings) return;

    this.seasonSettings = seasonSettings;
    this.gameConfig = gameConfig;
  }

  onEventMessage(entity: Entity) {
    // console.log("onEventMessage", entity);
    if (entity.hashed_keys === "0x0") return;
    // console.log("onEventMessage", entity, update);
    this.gameEvents!.addEvent(entity);

    const gameId = num.toHexString(this.gameInfos?.game_id);
    if (this.gameEvents?.isGameOver && this.game!.player!.health > 0) {
      return this.router.push(`/${gameId}/end`);
    }
  }

  async onEntityUpdated(entity: Entity) {
    if (entity.hashed_keys === "0x0") return;
    // console.log("onEntityUpdated", entity);

    const gameId = num.toHexString(this.gameInfos?.game_id);

    const prevState = this.game?.player;

    if (entity.models[`${DW_NS}-GameStorePacked`]) {
      this.gameStorePacked = parseStruct(entity.models[`${DW_NS}-GameStorePacked`]);
      this.initGameStore();

      if (this.game?.player.status === PlayerStatus.Normal) {
        if (prevState?.status !== PlayerStatus.Normal) {
          // decision -> consequence
          this.router.push(`/${gameId}/event/consequence`);
        } else {
          // normal travel - redirect to pawnshop or travel
          if (this.game.isShopOpen) {
            this.router.push(`/${gameId}/pawnshop`);
          } else {
            this.router.push(`/${gameId}/travel`);
          }
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

  *getGameCreated(gameId: number) {
    const loaded = this.allGamesCreated.find((i) => i.game_id === gameId);
    if (loaded) return loaded;

    const entities: Entities = yield this.toriiClient.getEventMessages({
      world_addresses: [this.selectedChain.manifest.world.address],
      clause: {
        Member: {
          member: "game_id",
          model: `${DW_NS}-GameCreated`,
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

    const gameCreated = parseModels(entities, `${DW_NS}-GameCreated`)[0];
    if (gameCreated) {
      // @ts-ignore
      gameCreated.token_id_type = gameCreated.token_id.activeVariant();
      // @ts-ignore
      gameCreated.token_id = Number(gameCreated.token_id.unwrap());
      this.allGamesCreated.push(gameCreated);
    }
    return gameCreated;
  }
}
