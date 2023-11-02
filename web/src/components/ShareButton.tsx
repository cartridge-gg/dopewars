import { Text, Link as ChakraLink, StyleProps } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { Twitter } from "./icons";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { formatCash } from "@/utils/ui";
import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";

const ShareButton = ({ ...props }: { variant?: string } & StyleProps) => {
  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;

  if (!account || !playerEntity) return null;

  return (
    <ChakraLink
      w="full"
      href={`https://twitter.com/intent/tweet?text=${getShareText(playerEntity)}`}
      target="_blank"
      {...props}
    >
      <Button variant={props.variant ? props.variant : ""} w="full">
        <Twitter /> Share
      </Button>
    </ChakraLink>
  );
};

const getShareText = (playerEntity: PlayerEntity): string => {
  if (playerEntity.health > 0) {
    return encodeURIComponent(
      `${playerEntity.name} has reached Day ${playerEntity.turn} with ${formatCash(
        playerEntity.cash,
      )} $paper. Think you can out hustle them? #rollyourown.\n\n${window.location.origin}`,
    );
  } else {
    return encodeURIComponent(
      `${playerEntity.name} got dropped on Day ${playerEntity.turn} but pocketed ${formatCash(
        playerEntity.cash,
      )} $paper before checking out. Think you can out hustle them? #rollyourown.\n\n${window.location.origin}`,
    );
  }
};

export default ShareButton;
