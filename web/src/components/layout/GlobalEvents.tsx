import { Entity, Subscription } from "@dojoengine/torii-client";
import { useEffect, useRef } from "react";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { useAccount } from "@starknet-react/core";
import { formatCashHeader } from "@/utils/ui";
import { PaperIcon, Siren, Truck } from "../icons";
import { playSound, Sounds } from "@/hooks/sound";
import { parseStruct } from "@/dojo/utils";
import { CairoOption, num, shortString } from "starknet";
import { HustlerAvatarIcon } from "../pages/profile/HustlerAvatarIcon";
import { Dopewars_Game as Game } from "@/generated/graphql";
import { parseModels } from "@/dope/toriiUtils";

export const GlobalEvents = () => {
  const { toast } = useToast();

  const { account } = useAccount();
  const { router } = useRouterContext();
  const gameStore = useGameStore();
  const { game, gameEvents } = gameStore;
  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const subscription = useRef<Subscription | undefined>(undefined);
  const accountAddress = useRef(0n);

  useEffect(() => {
    accountAddress.current = BigInt(account?.address || 0);
  }, [account?.address]);

  useEffect(() => {
    if (gameEvents?.sortedEvents.length === 0) return;
    if (!game) return;

    const event = gameEvents?.sortedEvents[gameEvents.sortedEvents.length - 1];
    if (event?.eventName === "HighVolatility") {
      const location = game.configStore.getLocationById(event.event.location_id);
      const drug = game.configStore.getDrugById(game.seasonSettings.drugs_mode, event.event.drug_id);
      const msg = event.event.increase
        ? `Pigs seized ${drug!.name} in ${location!.name}`
        : `A shipment of ${drug!.name} has arrived to ${location!.name}`;
      toast({
        message: msg,
        icon: event.event.increase ? Siren : Truck,
        duration: 6000,
      });
    }
  }, [gameEvents?.sortedEvents.length]);

  useEffect(() => {
    const init = async () => {
      if (!subscription.current) {
        subscription.current = await toriiClient.onEventMessageUpdated(
          [
            {
              Keys: {
                keys: [undefined],
                models: [
                  "dopewars-GameCreated",
                  "dopewars-NewSeason",
                  "dopewars-NewHighScore",
                  "dopewars-GameOver",
                  "dope-DopeLootReleasedEvent",
                  "dopewars-TrophyProgression",
                ],
                pattern_matching: "VariableLen",
              },
            },
          ],
          onEventMessage,
        );
      }
    };

    if (selectedChain) {
      init();
    }

    return () => {
      if (subscription.current) subscription.current.cancel();
      subscription.current = undefined;
    };
  }, [selectedChain, accountAddress.current]);

  const onEventMessage = async (key: string, entity: Entity) => {
    // console.log("globalEvents::onEventMessage", key, entity);

    if (entity.models["dopewars-GameCreated"]) {
      // const gameCreated = parseStruct(entity.models["dopewars-GameCreated"]) as GameCreated;

      const gameCreated = parseModels({ items: [entity], next_cursor: "" }, "dopewars-GameCreated")[0] as GameCreated;
      gameCreated.player_name = shortString.decodeShortString(num.toHexString(BigInt(gameCreated.player_name)));

      // @ts-ignore
      gameCreated.game_mode = gameCreated.game_mode.activeVariant();
      // @ts-ignore
      gameCreated.token_id_type = gameCreated.token_id.activeVariant();
      // @ts-ignore
      gameCreated.token_id = Number(gameCreated.token_id.unwrap());

      if (BigInt(gameCreated.player_id) !== accountAddress.current) {
        toast({
          icon: () => (
            <HustlerAvatarIcon
              gameId={gameCreated.game_id}
              tokenIdType={gameCreated.token_id_type}
              tokenId={Number(gameCreated.token_id)}
            />
          ),
          message:
            gameCreated.game_mode === "Ranked"
              ? `${gameCreated.player_name} is ready to hustle...`
              : `${gameCreated.player_name} is training...`,
        });
      } else {
        router.push(`/${num.toHexString(gameCreated.game_id)}`);
      }
    }

    if (entity.models["dopewars-NewSeason"]) {
      const newSeason = parseStruct(entity.models["dopewars-NewSeason"]) as NewSeason;
      playSound(Sounds.Uzi);
      toast({
        icon: () => <PaperIcon width="16px" height="16px" />,
        message: `Season ${newSeason.season_version} has started!`,
      });
    }

    if (entity.models["dopewars-NewHighScore"]) {
      const newHighScore = parseStruct(entity.models["dopewars-NewHighScore"]) as NewHighScore;
      newHighScore.player_name = shortString.decodeShortString(num.toHexString(BigInt(newHighScore.player_name)));

      const game = (await gameStore.getGameCreated(newHighScore.game_id)) as unknown as Game;

      toast({
        icon: () => (
          <HustlerAvatarIcon
            gameId={newHighScore.game_id}
            ///@ts-ignore
            tokenIdType={game.token_id_type}
            tokenId={Number(game.token_id)}
          />
        ),
        message: `${newHighScore.player_name} rules with ${formatCashHeader(newHighScore.cash)}!`,
      });
    }

    if (entity.models["dopewars-GameOver"]) {
      const gameOver = parseStruct(entity.models["dopewars-GameOver"]) as GameOver;
      gameOver.player_name = shortString.decodeShortString(num.toHexString(BigInt(gameOver.player_name)));
      if (BigInt(gameOver.player_id) !== accountAddress.current) {
        if (gameOver.health === 0) {
          playSound(Sounds.Magnum357);
        }
        const game = (await gameStore.getGameCreated(gameOver.game_id)) as unknown as Game;
        toast({
          icon: () => (
            <HustlerAvatarIcon
              gameId={gameOver.game_id}
              ///@ts-ignore
              tokenIdType={game.token_id_type}
              tokenId={Number(game.token_id)}
            />
          ),
          message: gameOver.health === 0 ? `RIP ${gameOver.player_name}!` : `${gameOver.player_name} survived!`,
        });
      }
    }

    if (entity.models["dope-DopeLootReleasedEvent"]) {
      const released = parseStruct(entity.models["dope-DopeLootReleasedEvent"]) as DopeLootReleasedEvent;
      const id = Number(released.id);
      toast({
        icon: () => <HustlerAvatarIcon gameId={0} tokenIdType={"LootId"} tokenId={id} />,
        message: `#${id} has been released!`,
      });
    }

    // uncomment to check TrophyProgression
    // if (entity.models["dopewars-TrophyProgression"]) {
    //   const progression = parseStruct(entity.models["dopewars-TrophyProgression"]);
    //   progression.task_id = shortString.decodeShortString(progression.task_id);
    //   progression.count = Number(progression.count);
    //   if (BigInt(progression.player_id) === accountAddress.current) {
    //     console.log("TrophyProgression", progression.task_id, progression.count);
    //   }
    //   toast({
    //     message: `TrophyProgression: ${progression.task_id} ${progression.count}`,
    //   });
    // }
  };

  return null;
};

export interface GameCreated {
  game_id: number;
  player_id: string;
  game_mode: string;
  player_name: string;
  multiplier: number;
  token_id_type: string;
  token_id: bigint;
  hustler_equipment: { slot: string; gear_item_id: CairoOption<number> }[];
  hustler_body: { slot: string; value: number }[];
}

export interface Traveled {
  game_id: number;
  player_id: string;
  turn: number;
  from_location_id: number;
  to_location_id: number;
}

export interface NewSeason {
  key: number;
  season_version: number;
}

export interface NewHighScore {
  game_id: number;
  player_id: string;
  season_version: number;
  player_name: string;
  token_id_type: string;
  token_id: bigint;
  cash: number;
  health: number;
  reputation: number;
}

export interface GameOver {
  game_id: number;
  player_id: string;
  season_version: number;
  player_name: string;
  token_id_type: string;
  token_id: bigint;
  turn: number;
  cash: number;
  health: number;
  reputation: number;
}

export interface TravelEncounter {
  game_id: number;
  player_id: string;
  turn: number;
  encounter: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  demand_pct: number;
  payout: number;
}

export interface TravelEncounterResult {
  game_id: number;
  player_id: string;
  turn: number;
  action: any;
  outcome: any;
  rounds: number;
  dmg_dealt: Array<Array<{ value: number }>>;
  dmg_taken: Array<Array<{ value: number }>>;
  // dmg_dealt: Array<(u8, u8)>,
  // dmg_taken: Array<(u8, u8)>,
  cash_earnt: number;
  cash_loss: number;
  drug_id: number;
  drug_loss: number[];
  turn_loss: number;
  rep_pos: number;
  rep_neg: number;
}

export interface TradeDrug {
  game_id: number;
  player_id: string;
  turn: number;
  drug_id: number;
  quantity: number;
  price: number;
  is_buy: boolean;
}
export interface HighVolatility {
  game_id: number;
  player_id: string;
  location_id: number;
  drug_id: number;
  increase: boolean;
}

export interface UpgradeItem {
  game_id: number;
  player_id: string;
  turn: number;
  item_slot: number;
  item_level: number;
}

export interface DopeLootReleasedEvent {
  id: bigint;
  address: string;
}
