import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { Clock, Sound } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { User } from "@/components/icons/archive";
import { playSound, Sounds } from "@/hooks/sound";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import BorderImage from "@/components/icons/BorderImage";
import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import { useRyoSystems } from "@/hooks/dojo/systems/useRyoSystems";
import { getLocationByName } from "@/hooks/ui";
import { JoinedEventData } from "@/utils/event";
import { useGlobalScores } from "@/hooks/dojo/components/useGlobalScores";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 9;

export default function Home() {
  const router = useRouter();
  const { create, isPending, error: txError } = useRyoSystems();
  const { scores } = useGlobalScores();
  return (
    <Layout
      title="Roll Your Own"
      prefixTitle="Dope Wars:"
      imageSrc="/images/punk-girl.png"
    >
      <VStack w="full" gap="20px">
        <Card variant="pixelated">
          <VStack w="full" p="20px" gap="20px">
            <Button
              w="full"
              isLoading={isPending && !txError}
              onClick={async () => {
                const { gameId, locationName } = (await create(
                  START_TIME,
                  MAX_PLAYERS,
                  NUM_TURNS,
                )) as JoinedEventData;

                router.push(
                  `/${gameId}/${getLocationByName(locationName).slug}`,
                );
              }}
            >
              Hustle
            </Button>
          </VStack>
        </Card>
        <VStack w="full" gap="20px">
          <Text>HALL OF FAME</Text>
          <Leaderboard
            scores={scores}
            css={{
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          />
        </VStack>
      </VStack>
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
