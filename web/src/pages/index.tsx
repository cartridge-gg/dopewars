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
import { useSystems } from "@/dojo/systems/useSystems";
import { useGlobalScores } from "@/dojo/components/useGlobalScores";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/dojo";
import { JoinedEventData } from "@/dojo/events";
import { getLocationById } from "@/dojo/helpers";
import { usePlayerStore } from "@/hooks/state";

import { useState } from "react";
import HomeLeftPanel from "@/components/HomeLeftPanel";
import Tutorial from "@/components/Tutorial";


// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 14;

export default function Home() {
  const router = useRouter();
  const { account, isBurnerDeploying, createBurner } = useDojo();
  const { create: createGame, error: txError } = useSystems();
  const { scores } = useGlobalScores();
  const { resetAll } = usePlayerStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const isLocal =  true;


  return (
    <Layout CustomLeftPanel={HomeLeftPanel}>
      <VStack boxSize="full" gap="10px" justify="center">
        <Card variant="pixelated">
          <HStack w="full" p="20px" gap="10px" justify="center">
            {!isLocal && (
              <VStack>
                <HStack>
                  <Alert />
                  <Text align="center">Under Construction</Text>
                </HStack>
                <Text align="center">
                  Get ready hustlers... Season II starts in September
                </Text>
              </VStack>
            )}

            {isLocal && (
              <>
                <Button flex="1" onClick={() => setIsTutorialOpen(true)}>
                  Tutorial
                </Button>
                <Button
                  flex="1"
                  isDisabled={!account}
                  isLoading={isSubmitting && !txError}
                  onClick={async () => {
                    setIsSubmitting(true);
                    resetAll();
                    const { event, hash } = await createGame(
                      START_TIME,
                      MAX_PLAYERS,
                      NUM_TURNS,
                    );

                    const { gameId, locationId } = event as JoinedEventData;
                    toast(
                      "Created Game",
                      Alert,
                      `http://amazing_explorer/${hash}`,
                    );

                    router.push(
                      `/${gameId}/${getLocationById(locationId).slug}`,
                    );
                  }}
                >
                  Hustle
                </Button>
              </>
            )}

          </HStack>
        </Card>

        {isLocal && (
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
              <Leaderboard />
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

