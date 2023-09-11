import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { Alert, Clock, Sound } from "@/components/icons";
import { User } from "@/components/icons/archive";
import { playSound, Sounds } from "@/hooks/sound";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import BorderImage from "@/components/icons/BorderImage";
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
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { Dojo } from "@/components/icons/branding/Dojo";
import { ScrollDown } from "@/components/icons/ScrollDown";
import { cardPixelatedStyle, cardPixelatedStyleOutset } from "@/theme/styles";
import Link from "next/link";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 9;

export default function Home() {
  const router = useRouter();
  const { account, isBurnerDeploying, createBurner } = useDojo();
  const { create: createGame, isPending, error: txError } = useSystems();
  const { scores } = useGlobalScores();
  const { clearAll } = usePlayerStore();
  const { toast } = useToast();

  return (
    <Layout CustomLeftPanel={HomeLeftPanel}>
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
            </VStack>
            */}
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

const steps = [
  {
    step: 1,
    title: "Buy Low",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 2,
    title: "Sell High",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 3,
    title: "Get rekt",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 4,
    title: "Profit",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
];

const HomeStep = ({
  step,
}: {
  step: { step: number; title: string; desc: string };
}) => {
  return (
    <>
      <HStack
        flexDirection={step.step % 2 == 1 ? "row" : "row-reverse"}
        gap="20px"
      >
        <Image
          src={`/images/landing/step${step.step}.png`}
          alt={`step${step.step}`}
          w="42%"
        />

        <VStack w="58%" alignItems="flex-start" py="100px">
          <HStack>
            <Image
              src={`/images/landing/step${step.step}-icon.png`}
              alt={`step${step.step}`}
              w="92px"
            />
            <VStack alignItems="flex-start">
              <Text
                fontSize="11px"
                fontFamily="broken-console"
                backgroundColor="#174127"
                padding="0.5rem 0.5rem 0.25rem"
              >
                Step {step.step}
              </Text>
              <Heading fontFamily={"chicago-flf"}> {step.title}</Heading>
            </VStack>
          </HStack>
          <Text p="10px">{step.desc}</Text>
        </VStack>
      </HStack>
    </>
  );
};

const HomeLeftPanel = () => {
  return (
    <>
      <VStack
        my="auto"
        flex={["0", "1"]}
        display={["none", "flex"]}
        position="relative"
        maxH="800px"
        overflow="hidden"
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
        }}
      >
        <VStack zIndex="2">
          <Text textStyle="subheading" fontSize="11px">
            DOPE WARS
          </Text>
          <Heading fontSize={["40px", "48px"]} fontWeight="normal">
            Roll your Own
          </Heading>
        </VStack>

        <VStack position="relative" top="-160px">
          <Image
            src={"/images/landing/main.png"}
            maxH="75vh"
            display={["none", "block"]}
            alt="context"
          />

          <Link
            id="steps"
            style={{ marginTop: "30px" }}
            href="#steps"
          >
            <ScrollDown width="40px" height="40px" />
          </Link>

          <Box>
            {steps.map((step) => {
              return <HomeStep step={step} key={step.step} />;
            })}
          </Box>
        </VStack>

        <HStack pb="200px">
          <Card
            display="flex"
            flexDirection="row"
            p="2"
            alignItems="center"
            variant="pixelated"
            px="5"
          >
            <ChakraLink
              href="https://cartridge.gg/"
              target="_blank"
              display="flex"
              justifyContent="center"
              alignItems="center"
              textDecoration="none"
              _hover={{
                color: "cartridgeYellow",
              }}
            >
              BUILT BY <Cartridge ml="2" />
            </ChakraLink>

            <Text px="2" fontSize="xl">
              |
            </Text>
            <ChakraLink
              href="https://dojoengine.org/"
              target="_blank"
              display="flex"
              justifyContent="center"
              alignItems="center"
              textDecoration="none"
              _hover={{
                color: "dojoRed",
              }}
            >
              BUILT WITH <Dojo ml="2" />
            </ChakraLink>
          </Card>
        </HStack>
      </VStack>

      <HStack
        w="calc((100% - 100px) / 2)"
        h="200px"
        position="absolute"
        display={["none", "block"]}
        top="0px"
        marginTop="-80px"
        zIndex={1}
        background="linear-gradient(#172217, #172217, transparent)"
        pointerEvents="none"
      ></HStack>

      <HStack
        w="calc((100% - 100px) / 2)"
        h="200px"
        position="absolute"
        display={["none", "block"]}
        bottom="0px"
        marginBottom="-80px"
        zIndex={1}
        background="linear-gradient(transparent, #172217, #172217)"
        pointerEvents="none"
      ></HStack>
    </>
  );
};
