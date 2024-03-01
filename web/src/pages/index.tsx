import { Button } from "@/components/common";
import { Alert, Clock, User } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import {
  Card,
  Divider,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { router } = useRouterContext();

  const {
    account,
    burner: { create: createBurner, clear: clearBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGated, setIsGated] = useState(false);

  useEffect(
    () =>
      //setIsGated(window.location.host ==! "rollyourown.preview.cartridge.gg"),
      setIsGated(false),
    [],
  );

  const disableAutoPlay = process.env.NEXT_PUBLIC_DISABLE_MEDIAPLAYER_AUTOPLAY === "true";
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const onHustle = async () => {
    if (!disableAutoPlay) {
      play();
    }

    setIsSubmitting(true);
    if (account) {
      // check if burner still valid
      try {
        const nonce = await account?.getNonce();
      } catch (e: any) {
        console.log(e);

        await clearBurner();
        console.log("Burner cleared!");

        await createBurner();
        console.log("Burner created!");
      }
    } else {
      // create burner account
      await createBurner();
    }

    router.push(`/create/new`);
  };

  return (
    <Layout CustomLeftPanel={HomeLeftPanel} rigthPanelScrollable={false} rigthPanelMaxH="calc(100vh - 230px)">
      <VStack boxSize="full" gap="10px" justify="center">
        <Card variant="pixelated">
          <HStack w="full" p="20px" gap="10px" justify="center">
            {isGated ? (
              <VStack>
                <HStack>
                  <Alert />
                  <Text align="center">Under Construction</Text>
                </HStack>
                <Text align="center">Get ready hustlers... Season III starts in November</Text>
              </VStack>
            ) : (
              <>
                {!account && (
                  <Button flex="1" onClick={() => setIsTutorialOpen(true)}>
                    Tutorial
                  </Button>
                )}
                <Button flex="1" isLoading={isSubmitting} onClick={onHustle}>
                  Hustle
                </Button>
              </>
            )}
          </HStack>
        </Card>
    
        {!isGated && (
          <>
            <VStack
              boxSize="full"
              gap="20px"
              __css={{
                "scrollbar-width": "none",
              }}
            >
              <Leaderboard />
            </VStack>
          </>
        )}
      </VStack>

      <Tutorial isOpen={isTutorialOpen} close={() => setIsTutorialOpen(false)} />
    </Layout>
  );
}

// unused
const Game = ({
  name,
  startTime,
  joined,
  max,
  onClick,
  onMouseEnter,
}: {
  name: string;
  startTime: string;
  joined: number;
  max: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) => (
  <HStack
    layerStyle="card"
    w="full"
    px="14px"
    py="10px"
    cursor="pointer"
    onClick={onClick}
    onMouseEnter={() => {
      playSound(Sounds.HoverClick, 0.3);
    }}
  >
    <HStack overflow="hidden" whiteSpace="nowrap" flex="1">
      <Text>{name}</Text>
      <Divider borderColor="neon.200" borderStyle="dotted" />
    </HStack>
    <HStack>
      <HStack color="yellow.400">
        <Clock />
        <Text>{startTime}</Text>
      </HStack>
      <HStack>
        <User boxSize="16px" />
        <Text>
          {joined}/{max}
        </Text>
      </HStack>
    </HStack>
  </HStack>
);
