import { controllerConnector, argentConnector } from "@/pages/_app";
import { Clock, Gem, Bag, Chat, Home, Link, Sound } from "./icons";
import { useAccount, useConnectors } from "@starknet-react/core";
import { Box, Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IsMobile } from "@/utils/ui";
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

const Header = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  const isMuted = useSoundStore((state) => state.isMuted);
  const isConnected = useUiStore((state) => state.isConnected);

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
            <HeaderButton onClick={() => router.push("/")}>
              <Home />
            </HeaderButton>
          </HStack>
          <HStack flex="1" justify="center">
            <HStack
              layerStyle="rounded"
              h="full"
              py="8px"
              px="20px"
              spacing={["10px", "30px"]}
            >
              <HStack>
                <Gem /> <Text>$2000</Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Bag /> <Text>20</Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Clock />{" "}
                <Text whiteSpace="nowrap">{!IsMobile && "Day"} 3/30</Text>
              </HStack>
            </HStack>
          </HStack>
          <HStack flex="1" justify="right">
            <HeaderButton>
              <Chat
                alert={true}
                onClick={() => {
                  stopSound(Sounds.Ambiance, 1000);
                  setTimeout(() => {
                    playSound(Sounds.Ambiance2, 0.8, true);
                  },3000);
                }}
              />
            </HeaderButton>

            <HeaderButton onClick={() => toggleIsMuted()}>
              <Sound isMuted={isMuted} />
            </HeaderButton>
          </HStack>
        </>
      ) : (
        <HStack flex="1" justify="right">
          <HeaderButton onClick={() => toggleIsMuted()}>
            <Sound isMuted={isMuted} />
          </HeaderButton>
          <HStack
            layerStyle="rounded"
            cursor="pointer"
            onClick={() => {
              setIsConnected(true);
              playSound(Sounds.Ambiance, 1, true);
            }}
            onMouseEnter={() => {
              playSound(Sounds.HoverClick);
            }}
          >
            <Link /> <Text>CONNECT</Text>
          </HStack>
        </HStack>
      )}
    </Flex>
  );
};

export default Header;
