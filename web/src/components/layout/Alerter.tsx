import { Subscription, Event } from "../../../../../dojo.c/pkg";
import {  useEffect, useRef } from "react";
import { useDojoContext } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import { GameCreatedData, GameOverData, NewHighScoreData, NewSeasonData, parseEvent } from "@/dojo/events";
import { useAccount } from "@starknet-react/core";
import { HustlerIcon, Hustlers } from "../hustlers";
import { formatCashHeader } from "@/utils/ui";
import { GameMode } from "@/dojo/types";
import { PaperIcon } from "../icons";
import { playSound, Sounds } from "@/hooks/sound";

export const Alerter = () => {
  const { toast } = useToast();

  const { account } = useAccount();
  const {
    chains: { selectedChain },
    toriiClient,
  } = useDojoContext();

  const subscription = useRef<Subscription>();
  const accountAddress = useRef(0n);

  useEffect(() => {
    accountAddress.current = BigInt(account?.address || 0);
  }, [account?.address]);

  useEffect(() => {
    const init = async () => {
      if (!subscription.current) {
        // subscribe to changes
        subscription.current = await toriiClient.onStarknetEvent(
          [
            {
              Keys: {
                keys: [WorldEvents.GameCreated],
                models: [],
                pattern_matching: "VariableLen",
              },
            },
            {
              Keys: {
                keys: [WorldEvents.GameOver],
                models: [],
                pattern_matching: "VariableLen",
              },
            },
            {
              Keys: {
                keys: [WorldEvents.NewHighScore],
                models: [],
                pattern_matching: "VariableLen",
              },
            },
            {
              Keys: {
                keys: [WorldEvents.NewSeason],
                models: [],
                pattern_matching: "VariableLen",
              },
            },
          ],
          onStarknetEvent,
        );
      }
    };

    init();

    return () => {
      if (subscription.current) subscription.current.cancel();
    };
  }, [selectedChain]);

  const onStarknetEvent = (event: Event) => {
    //console.log("onStarknetEvent", event);

    if (!event) return;

    const e = parseEvent(selectedChain.manifest, event);

    switch (e.eventType) {
      case WorldEvents.GameCreated:
        const gameCreated = e as GameCreatedData;
        if (BigInt(gameCreated.playerId) !== accountAddress.current) {
          toast({
            icon: () => <HustlerIcon hustler={gameCreated.hustlerId as Hustlers} />,
            message:
              gameCreated.gameMode === GameMode.Ranked
                ? `${gameCreated.playerName} is ready to hustle...`
                : `${gameCreated.playerName} is training...`,
          });
        }
        break;

      case WorldEvents.GameOver:
        const gameOver = e as GameOverData;
        if (BigInt(gameOver.playerId) !== accountAddress.current) {
          if (gameOver.health === 0) {
            playSound(Sounds.Magnum357);
          }
          toast({
            icon: () => <HustlerIcon hustler={gameOver.hustlerId as Hustlers} />,
            message: gameOver.health === 0 ? `RIP ${gameOver.playerName}!` : `${gameOver.playerName} survived!`,
          });
        }
        break;

      case WorldEvents.NewHighScore:
        const newHighScore = e as NewHighScoreData;
        toast({
          icon: () => <HustlerIcon hustler={newHighScore.hustlerId as Hustlers} />,
          message: `${newHighScore.playerName} rules with ${formatCashHeader(newHighScore.cash)}!`,
        });
        break;

      case WorldEvents.NewSeason:
        const newSeason = e as NewSeasonData;
        playSound(Sounds.Uzi);
        toast({
          icon: () => <PaperIcon width="16px" height="16px" />,
          message: `Season ${newSeason.seasonVersion} has started!`,
        });
        break;

      default:
        break;
    }
  };

  return <></>;
};
