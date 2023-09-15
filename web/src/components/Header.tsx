import { Clock, Gem, Bag, Arrow, Heart } from "./icons";
import { Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
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
import { formatAddress } from "@/utils/contract";

// TODO: constrain this on contract side
const MAX_INVENTORY = 100;

export interface HeaderProps {
  back?: boolean;
}

const Header = ({ back }: HeaderProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const [inventory, setInventory] = useState(0);
  const { account, createBurner, isBurnerDeploying } = useDojo();

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
    <HStack
      w="full"
      px="10px"
      py={["0", "20px"]}
      spacing="10px"
      zIndex="overlay"
      align="flex-start"
    >
      <HStack flex="1" justify={["left", "right"]}>
        {back && (
          <HeaderButton h="40px" onClick={() => router.back()}>
            <Arrow />
          </HeaderButton>
        )}
      </HStack>
      {playerEntity && gameEntity && (
        <HStack flex="1" justify="center">
          <HStack
            h={["80px", "40px"]}
            w="full"
            px="20px"
            spacing={["10px", "30px"]}
            bg="neon.700"
            clipPath={`polygon(${generatePixelBorderPath()})`}
          >
            <Flex
              w="full"
              flexDirection={["column-reverse", "row"]}
              align="center"
              justify="center"
              gap="10px"
            >
              <HStack>
                <Gem /> <Text>{formatCash(playerEntity.cash)}</Text>
              </HStack>
              <HStack>
                <Divider
                  orientation="vertical"
                  borderColor="neon.600"
                  h="12px"
                  visibility={["hidden", "visible"]}
                />
                <HStack color={inventory > 0 ? "yellow.400" : "auto"}>
                  <Bag />
                  <Text>{inventory === 100 ? "Full" : `${inventory}/100`}</Text>
                </HStack>
                <Divider
                  orientation="vertical"
                  borderColor="neon.600"
                  h="12px"
                />
                <HStack>
                  <Heart /> <Text>{playerEntity.health}</Text>
                </HStack>
                {/* <Divider
                  orientation="vertical"
                  borderColor="neon.600"
                  h="12px"
                />
                <HStack>
                  <Clock />
                  <Text>
                    {playerEntity.turnsRemaining === 0
                      ? "Final"
                      : `${
                          gameEntity.maxTurns - playerEntity.turnsRemaining + 1
                        }/${gameEntity.maxTurns + 1}`}
                  </Text>
                </HStack> */}
              </HStack>
            </Flex>
          </HStack>
        </HStack>
      )}

      <HStack flex="1" justify="right">
        {!isMobile && (
          <>
            <MediaPlayer />
            <Button
              variant="pixelated"
              isLoading={isBurnerDeploying}
              onClick={() => {
                if (!account) {
                  createBurner();
                }
              }}
            >
              {account
                ? formatAddress(account.address.toUpperCase())
                : "Create Burner"}
            </Button>
          </>
        )}

        {isMobile && <MobileMenu />}
      </HStack>
    </HStack>
  );
};

export default Header;
