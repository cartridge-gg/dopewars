import { Subscription, Event, Ty, EnumValue, Model } from "../../../../../dojo.c/pkg/dojo_c";
import { useEffect, useRef } from "react";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { useAccount } from "@starknet-react/core";
import { HustlerIcon, Hustlers } from "../hustlers";
import { formatCashHeader } from "@/utils/ui";
import { PaperIcon, Siren, Truck } from "../icons";
import { playSound, Sounds } from "@/hooks/sound";
import { parseStruct } from "@/dojo/utils";
import { num, shortString } from "starknet";

export const GlobalEvents = () => {
  const { toast } = useToast();

  const { account } = useAccount();
  const { router } = useRouterContext();
  const { game, gameEvents } = useGameStore();
  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const subscription = useRef<Subscription>();
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
                keys: [undefined, undefined],
                models: ["dopewars-GameCreated"],
                pattern_matching: "FixedLen",
              },
            },
            {
              Keys: {
                keys: [undefined],
                models: ["dopewars-NewSeason"],
                pattern_matching: "FixedLen",
              },
            },
            {
              Keys: {
                keys: [undefined, undefined, undefined],
                models: ["dopewars-NewHighScore"],
                pattern_matching: "FixedLen",
              },
            },
            {
              Keys: {
                keys: [undefined, undefined, undefined],
                models: ["dopewars-GameOver"],
                pattern_matching: "FixedLen",
              },
            },
          ],
          true,
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

  const onEventMessage = (entity: any, update: any) => {
    // console.log("globalEvents::onEventMessage", entity, update);

    if (update["dopewars-GameCreated"]) {
      const gameCreated = parseStruct(update["dopewars-GameCreated"]) as GameCreated;
      console.log(gameCreated);
      gameCreated.player_name = shortString.decodeShortString(num.toHexString(BigInt(gameCreated.player_name)));
      if (BigInt(gameCreated.player_id) !== accountAddress.current) {
        toast({
          icon: () => <HustlerIcon hustler={gameCreated.hustler_id as Hustlers} />,
          message:
            gameCreated.game_mode === "Ranked"
              ? `${gameCreated.player_name} is ready to hustle...`
              : `${gameCreated.player_name} is training...`,
        });
      } else {
        router.push(`/${num.toHexString(gameCreated.game_id)}`);
      }
    }

    if (update["dopewars-NewSeason"]) {
      const newSeason = parseStruct(update["dopewars-NewSeason"]) as NewSeason;
      playSound(Sounds.Uzi);
      toast({
        icon: () => <PaperIcon width="16px" height="16px" />,
        message: `Season ${newSeason.season_version} has started!`,
      });
    }

    if (update["dopewars-NewHighScore"]) {
      const newHighScore = parseStruct(update["dopewars-NewHighScore"]) as NewHighScore;
      newHighScore.player_name = shortString.decodeShortString(num.toHexString(BigInt(newHighScore.player_name)));
      toast({
        icon: () => <HustlerIcon hustler={newHighScore.hustler_id as Hustlers} />,
        message: `${newHighScore.player_name} rules with ${formatCashHeader(newHighScore.cash)}!`,
      });
    }

    if (update["dopewars-GameOver"]) {
      const gameOver = parseStruct(update["dopewars-GameOver"]) as GameOver;
      gameOver.player_name = shortString.decodeShortString(num.toHexString(BigInt(gameOver.player_name)));
      if (BigInt(gameOver.player_id) !== accountAddress.current) {
        if (gameOver.health === 0) {
          playSound(Sounds.Magnum357);
        }
        toast({
          icon: () => <HustlerIcon hustler={gameOver.hustler_id as Hustlers} />,
          message: gameOver.health === 0 ? `RIP ${gameOver.player_name}!` : `${gameOver.player_name} survived!`,
        });
      }
    }
  };

  return <></>;
};

export interface GameCreated {
  game_id: number;
  player_id: string;
  game_mode: string;
  player_name: string;
  hustler_id: number;
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
  hustler_id: number;
  cash: number;
  health: number;
  reputation: number;
}

export interface GameOver {
  game_id: number;
  player_id: string;
  season_version: number;
  player_name: string;
  hustler_id: number;
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
