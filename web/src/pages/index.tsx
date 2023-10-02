import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  keyframes,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { Alert, Clock } from "@/components/icons";
import { User } from "@/components/icons/archive";
import { playSound, Sounds } from "@/hooks/sound";
import Leaderboard from "@/components/Leaderboard";
// import { useGlobalScores } from "@/dojo/queries/useGlobalScores";
import { useToast } from "@/hooks/toast";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { JoinedEventData } from "@/dojo/events";
import { getLocationById } from "@/dojo/helpers";
import { usePlayerStore } from "@/hooks/state";
import HomeLeftPanel from "@/components/HomeLeftPanel";
import Tutorial from "@/components/Tutorial";
import { useEffect, useState } from "react";
import { play } from "@/hooks/media";
import { useSystems } from "@/dojo/hooks/useSystems";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 10;

export default function Home() {
  const router = useRouter();

  const { account } = useDojoContext();
  const { createGame } = useSystems();
  // const { scores } = useGlobalScores();
  const { resetAll } = usePlayerStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGated, setIsGated] = useState(false);

  // useEffect(
  //   () =>
  //     setIsGated(window.location.host === "rollyourown.preview.cartridge.gg"),
  //   [],
  // );

  const disableAutoPlay =
    process.env.NEXT_PUBLIC_DISABLE_MEDIAPLAYER_AUTOPLAY !== "true";
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  return (
    <Layout CustomLeftPanel={HomeLeftPanel}>
      <VStack boxSize="full" gap="10px" justify="center">
        <Card variant="pixelated">
          <HStack w="full" p="20px" gap="10px" justify="center">
            {isGated ? (
              <VStack>
                <HStack>
                  <Alert />
                  <Text align="center">Under Construction</Text>
                </HStack>
                <Text align="center">
                  Get ready hustlers... Season II starts in September
                </Text>
              </VStack>
            ) : (
              <>
                <Button flex="1" onClick={() => setIsTutorialOpen(true)}>
                  Tutorial
                </Button>
                <Button
                  flex="1"
                  isDisabled={!account}
                  isLoading={isSubmitting /*&& !txError*/}
                  onClick={async () => {
                    if (disableAutoPlay) {
                      play();
                    }
                    setIsSubmitting(true);
                    resetAll();

                    const { hash, gameId } = await createGame(0);

                    toast(
                      "Created Game",
                      Alert,
                      `http://amazing_explorer/${hash}`,
                    );

                    router.push(`/${gameId}/travel`);
                  }}
                >
                  Hustle
                </Button>
              </>
            )}
          </HStack>
        </Card>

        {!isGated && (
          <>
            <Text>HALL OF FAME</Text>
            <VStack
              boxSize="full"
              gap="20px"
              sx={{
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {/* <Leaderboard /> */}
            </VStack>
          </>
        )}
      </VStack>

      <Tutorial
        isOpen={isTutorialOpen}
        close={() => setIsTutorialOpen(false)}
      />
    </Layout>
  );
}

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
