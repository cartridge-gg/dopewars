import { controllerConnector, argentConnector } from "@/pages/_app";
import { Clock, Gem, Bag, Chat, Home, Link, Sound, Arrow } from "./icons";
import { useAccount, useConnectors } from "@starknet-react/core";
import { Box, Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IsMobile, generatePixelBorderPath } from "@/utils/ui";
import { useRouter } from "next/router";
import {
  useSoundStore,
  Sounds,
  toggleIsMuted,
  playSound,
  stopSound,
  initSoundStore,
} from "@/hooks/sound";
import { useUiStore, setIsConnected } from "@/hooks/ui";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "@/components/MediaPlayer";
import MobileMenu from "@/components/MobileMenu";
import { play } from "@/hooks/media";
import { useGameStore, getInventoryInfos } from "@/hooks/state";

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  const isMobile = IsMobile();

  const isMuted = useSoundStore((state) => state.isMuted);
  const isConnected = useUiStore((state) => state.isConnected);
  const isBackButtonVisible = useUiStore((state) =>
    state.isBackButtonVisible(router.pathname),
  );
  const inventory = useGameStore((state) => state.inventory);
  const turns = useGameStore((state) => state.turns);
  const inventoryInfos = getInventoryInfos();
  const hasNewMessages = true;

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      p={["0 6px 24px 6px", "24px"]}
      m={"0 6px"}
      w="full"
      justify="flex-end"
      zIndex="1"
    >
      {isConnected ? (
        <>
          <HStack flex="1" justify="left">
            {!isBackButtonVisible && (
              <HeaderButton onClick={() => router.push("/")}>
                <Home />
              </HeaderButton>
            )}
            {isBackButtonVisible && (
              <HeaderButton onClick={() => router.back()}>
                <Arrow />
              </HeaderButton>
            )}
          </HStack>

          <HStack flex="1" justify="center">
            <HStack
              h="full"
              py="8px"
              px="20px"
              spacing={["10px", "30px"]}
              bg="neon.700"
              clipPath={`polygon(${generatePixelBorderPath()})`}
            >
              <HStack>
                <Gem /> <Text>${inventory.cash}</Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Bag />{" "}
                <Text>
                  {inventoryInfos.used}/{inventoryInfos.capacity}
                </Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Clock />{" "}
                <Text whiteSpace="nowrap">
                  {!IsMobile && "Day"} {turns.current}/{turns.total}
                </Text>
              </HStack>
            </HStack>
          </HStack>

          <HStack flex="1" justify="right">
            {!isMobile && <MediaPlayer />}

            {!isMobile && (
              <HeaderButton onClick={() => router.push("/chat")}>
                <Chat color={hasNewMessages ? "yellow.400" : "currentColor"} />
              </HeaderButton>
            )}
            {isMobile && <MobileMenu />}
          </HStack>
        </>
      ) : (
        <>
          <HStack flex="1" justify="left">
            {back && (
              <HeaderButton onClick={() => router.back()}>
                <Arrow />
              </HeaderButton>
            )}
          </HStack>
          <HStack flex="1" justify="right">
            {!isMobile && <MediaPlayer />}

            <Button
              variant="pixelated"
              cursor="pointer"
              onClick={() => {
                setIsConnected(true);
                play();
              }}
              onMouseEnter={() => {
                playSound(Sounds.HoverClick, 0.5);
              }}
            >
              <Link /> <Text>CONNECT</Text>
            </Button>
          </HStack>
        </>
      )}
    </Flex>
  );
};

export default Header;
