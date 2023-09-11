import { Clock, Gem, Bag, Arrow } from "./icons";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IsMobile, generatePixelBorderPath } from "@/utils/ui";
import { useRouter } from "next/router";
import { initSoundStore } from "@/hooks/sound";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "@/components/MediaPlayer";
import MobileMenu from "@/components/MobileMenu";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { formatCash } from "@/utils/ui";
import { useDojo } from "@/dojo";

// TODO: constrain this on contract side
const MAX_INVENTORY = 100;

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [inventory, setInventory] = useState(0);
  const { account } = useDojo();

  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const isMobile = IsMobile();

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

  return (
    <HStack w="full" zIndex="overlay" py={["0", "20px"]} px="20px">
      <HStack flex="1" justify="left">
        {back && (
          <HeaderButton onClick={() => router.back()}>
            <Arrow />
          </HeaderButton>
        )}
      </HStack>
      {playerEntity && gameEntity && (
        <HStack flex="1" justify="center">
          <HStack
            h="40px"
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
              <Text>{inventory === 100 ? "Full" : `${inventory}/100`}</Text>
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
    </HStack>
  );
};

export default Header;
