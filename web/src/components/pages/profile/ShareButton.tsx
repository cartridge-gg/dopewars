import { Button } from "@/components/common";
import { GameClass } from "@/dojo/class/Game";
import { useGameStore } from "@/dojo/hooks";
import { Dopewars_V0_Game as Game } from "@/generated/graphql";
import { formatCash } from "@/utils/ui";
import { Link as ChakraLink, StyleProps } from "@chakra-ui/react";
import { num, shortString } from "starknet";
import { Twitter } from "../../icons";

const ShareButton = ({ ...props }: { variant?: string } & StyleProps) => {
  const { game, gameInfos } = useGameStore();

  if ( !game || !gameInfos) return null;

  return (
    <a
      className="w-full no-underline"
      href={`https://twitter.com/intent/tweet?text=${getShareText(game, gameInfos)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant={props.variant as any} className="w-full">
        <Twitter /> Share
      </Button>
    </a>
  );
};

const getShareText = (game: GameClass, gameInfos: Game): string => {
  const playerName = shortString.decodeShortString(num.toHexString(BigInt(gameInfos.player_name?.value)));
  if (game.player.health > 0) {
    return encodeURIComponent(
      `I reached Day ${game.player.turn} with ${formatCash(
        game.player.cash,
      )} $PAPER. Think you can out hustle me? #dopewars.\n\n${window.location.origin}`,
    );
  } else {
    return encodeURIComponent(
      `I got dropped on Day ${game.player.turn} but pocketed ${formatCash(
        game.player.cash,
      )} $PAPER before checking out. Think you can out hustle me? #dopewars.\n\n${window.location.origin}`,
    );
  }
};

export default ShareButton;
