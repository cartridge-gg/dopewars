import { Clock, Gem, Bag, Chat, Home, Link, Sound, Arrow } from "./icons";
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
import { usePlayerEntityQuery, Entity } from "@/generated/graphql";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";
import { formatCash } from "@/utils/ui";

// TODO: constrain this on contract side
const MAX_INVENTORY = 100;

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [inventory, setInventory] = useState(0);

  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });
  const { game: gameEntity, isFetched: isFetchedGame } = useGameEntity({
    gameId,
  });

  const isMobile = IsMobile();
  const isMuted = useSoundStore((state) => state.isMuted);
  const isConnected = useUiStore((state) => state.isConnected);
  const isBackButtonVisible = useUiStore((state) =>
    state.isBackButtonVisible(router.pathname),
  );
  const hasNewMessages = true;

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  useEffect(() => {
    if (!playerEntity) return;

    const inventory = playerEntity.drugs.reduce((acc, drug) => {
      return acc + drug.quantity;
    }, 0);

    setInventory(inventory);
  }, [playerEntity]);

  if (!gameEntity || !playerEntity) {
    return <></>;
  }

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
      <HStack flex="1" justify="left">
        {isBackButtonVisible && (
          <HeaderButton onClick={() => router.back()}>
            <Arrow />
          </HeaderButton>
        )}
      </HStack>
      {playerEntity && (
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
              <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
            </HStack>
            <Divider orientation="vertical" borderColor="neon.600" h="12px" />
            <HStack>
              <Bag />
              <Text>
                {inventory}/{MAX_INVENTORY}
              </Text>
            </HStack>
            <Divider orientation="vertical" borderColor="neon.600" h="12px" />
            <HStack>
              <Clock />
              <Text>
                {playerEntity.turnsRemaining === 0
                  ? "Final"
                  : `${gameEntity.maxTurns - playerEntity.turnsRemaining + 1}/${
                      gameEntity.maxTurns + 1
                    }`}
              </Text>
            </HStack>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {!isMobile && <MediaPlayer />}
        {/* Chat requires backend implementation */}
        {/* {!isMobile && (
              <HeaderButton onClick={() => router.push("/chat")}>
                <Chat color={hasNewMessages ? "yellow.400" : "currentColor"} />
              </HeaderButton>
            )} */}
        {isMobile && <MobileMenu />}
      </HStack>
    </Flex>
  );
};

export default Header;
