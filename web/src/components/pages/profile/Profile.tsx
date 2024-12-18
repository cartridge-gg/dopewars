import { Button } from "@/components/common";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { headerButtonStyles } from "@/theme/styles";
import { Box, HStack, MenuItem, Text } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { HustlerIcon, Hustlers } from "../../hustlers";
import { num, shortString } from "starknet";

export const ProfileLink = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const { gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos) return null;

  return (
    <>
      <Button cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={onClick}>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
      </Button>
    </>
  );
};

export const ProfileLinkMobile = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const { gameEvents, gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos || !gameEvents) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={onClick} /*justifyContent="center"*/>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
        <Text ml="10px">{shortString.decodeShortString(num.toHexString(BigInt(gameInfos.player_name?.value)))}</Text>
      </MenuItem>
    </>
  );
};

export const ProfileLinkDrawer = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const { gameEvents, gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos /*|| !gameEvents*/) return null;
  return (
    <HStack borderRadius={0} onClick={onClick} /*justifyContent="center"*/>
      <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
      <Text ml="4px">{shortString.decodeShortString(num.toHexString(BigInt(gameInfos.player_name?.value)))}</Text>
    </HStack>
  );
};
