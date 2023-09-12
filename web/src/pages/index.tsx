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
import { Alert, Clock, Sound } from "@/components/icons";
import { User } from "@/components/icons/archive";
import { playSound, Sounds } from "@/hooks/sound";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import BorderImage from "@/components/icons/BorderImage";
import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import { useSystems } from "@/dojo/systems/useSystems";
import { useGlobalScores } from "@/dojo/components/useGlobalScores";
import { useToast } from "@/hooks/toast";
import { useBurner } from "@/hooks/burner";
import { formatAddress } from "@/utils/contract";
import { useDojo } from "@/dojo";
import { JoinedEventData } from "@/dojo/events";
import { getLocationById } from "@/dojo/helpers";
import { usePlayerStore } from "@/hooks/state";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 14;

export default function Home() {
  const router = useRouter();
  const { account, isBurnerDeploying, createBurner } = useDojo();
  const { create: createGame, isPending, error: txError } = useSystems();
  const { scores } = useGlobalScores();
  const { clearAll } = usePlayerStore();
  const { toast } = useToast();

  return (
    <Layout
      leftPanelProps={{
        title: "Roll Your Own",
        prefixTitle: "Dope Wars",
        imageSrc: "/images/punk-girl.png",
      }}
    >
      <VStack boxSize="full" gap="10px" justify="center">
        <Card variant="pixelated">
          <HStack w="full" p="20px" gap="10px" justify="center">
            {/* <VStack>
              <HStack>
                <Alert />
                <Text align="center">Under Construction</Text>
              </HStack>
              <Text align="center">
                Get ready hustlers... Season II starts in September
              </Text>
            </VStack> */}
            <Button
              flex="1"
              isDisabled={!!account}
              isLoading={isBurnerDeploying}
              onClick={() => createBurner()}
            >
              {account ? formatAddress(account.address) : "Create Burner"}
            </Button>
            <Button
              flex="1"
              isDisabled={!account}
              isLoading={isPending && !txError}
              onClick={async () => {
                clearAll();
                const { event, hash } = await createGame(
                  START_TIME,
                  MAX_PLAYERS,
                  NUM_TURNS,
                );

                const { gameId, locationId } = event as JoinedEventData;
                toast("Created Game", Alert, `http://amazing_explorer/${hash}`);

                router.push(`/${gameId}/${getLocationById(locationId).slug}`);
              }}
            >
              Hustle
            </Button>
          </HStack>
        </Card>

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
