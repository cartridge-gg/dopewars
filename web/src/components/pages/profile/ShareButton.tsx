import { Button } from "@/components/common";
import { GameClass } from "@/dojo/class/Game";
import { useGameStore } from "@/dojo/hooks";
import { Dopewars_Game as Game } from "@/generated/graphql";
import { formatCash } from "@/utils/ui";
import { Link as ChakraLink, StyleProps } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { shortString } from "starknet";
import { Twitter } from "../../icons";

const ShareButton = ({ ...props }: { variant?: string } & StyleProps) => {
  const { account } = useAccount();
  const { game, gameInfos } = useGameStore();

  if (!account || !game || !gameInfos) return null;

  return (
    <ChakraLink
      w="full"
      href={`https://twitter.com/intent/tweet?text=${getShareText(game, gameInfos)}`}
      target="_blank"
      textDecoration="none !important"
      {...props}
    >
      <Button variant={props.variant ? props.variant : ""} w="full">
        <Twitter /> Share
      </Button>
    </ChakraLink>
  );
};

const getShareText = (game: GameClass, gameInfos: Game): string => {
  const playerName = shortString.decodeShortString(gameInfos.player_name?.value);
  if (game.player.health > 0) {
    return encodeURIComponent(
      `${playerName} has reached Day ${game.player.turn} with ${formatCash(
        game.player.cash,
      )} $paper. Think you can out hustle them? #dopewars.\n\n${window.location.origin}`,
    );
  } else {
    return encodeURIComponent(
      `${playerName} got dropped on Day ${game.player.turn} but pocketed ${formatCash(
        game.player.cash,
      )} $paper before checking out. Think you can out hustle them? #dopewars.\n\n${window.location.origin}`,
    );
  }
};

export default ShareButton;
