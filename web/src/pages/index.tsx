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
import Content from "@/components/Content";
import { User } from "@/components/icons/archive";
import { startGame, useGameStore } from "@/hooks/state";
import { playSound, Sounds } from "@/hooks/sound";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import BorderImage from "@/components/icons/BorderImage";
import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import { useRyoSystems } from "@/hooks/dojo/systems/useRyoSystems";
import { getLocationByName } from "@/hooks/ui";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 10;

export default function Home() {
  const router = useRouter();
  const { create, isPending } = useRyoSystems();
  return (
    <Layout
      title="Roll Your Own"
      prefixTitle="Dope Wars:"
      headerImage="/images/punk-girl.png"
      footer={
        <Link
          href="https://www.youtube.com/watch?v=vKOB3sssTy0"
          target="_blank"
          style={{
            marginTop: "30px",
          }}
        >
          <Button variant="pixelated">CREDITS</Button>
        </Link>
      }
    >
      <Content>
        <VStack w="full" gap="20px">
          <Card variant="pixelated">
            <VStack w="full" p="20px" gap="20px">
              <Button
                w="full"
                isDisabled={isPending}
                onClick={async () => {
                  const { gameId, locationName } = await create(
                    START_TIME,
                    MAX_PLAYERS,
                    NUM_TURNS,
                  );

                  startGame();
                  router.push(
                    `/${gameId}/location/${
                      getLocationByName(locationName).slug
                    }`,
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
              css={{
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            />
          </VStack>
        </VStack>
      </Content>
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
