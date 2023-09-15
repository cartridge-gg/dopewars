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
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { Dojo } from "@/components/icons/branding/Dojo";
import { ScrollDown } from "@/components/icons/ScrollDown";
import { useEffect, useState } from "react";

// hardcode game params for now
const START_TIME = 0;
const MAX_PLAYERS = 1;
const NUM_TURNS = 14;

const floatAnim = keyframes`  
  0% {transform: translateY(0%);}
  25% {transform: translateY(-6px);}
  50% {transform: translateY(0%);}
  70% {transform: translateY(8px);}
`;

export default function Home() {
  const router = useRouter();
  const { account, isBurnerDeploying, createBurner } = useDojo();
  const { create: createGame, error: txError } = useSystems();
  const { scores } = useGlobalScores();
  const { resetAll } = usePlayerStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGated, setIsGated] = useState(false);

  useEffect(
    () =>
      setIsGated(window.location.host === "rollyourown.preview.cartridge.gg"),
    [],
  );
  
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

                  router.push(`/${gameId}/${getLocationById(locationId).slug}`);
                }}
              >
                Hustle
              </Button>
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
              <Leaderboard />
            </VStack>
          </>
        )}
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
              <Heading
                fontFamily={"ppneuebit"}
                fontSize="44px"
                lineHeight={"1"}
              >
                {step.title}
              </Heading>
            </VStack>
          </HStack>
          <Text p="10px">{step.desc}</Text>
        </VStack>
      </HStack>
    </>
  );
};

const onScrollDown = () => {
  let steps = document.getElementById("steps");

  setTimeout(() => {
    steps &&
      steps.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
  }, 10);
};

const HomeLeftPanel = () => {
  return (
    <>
      <VStack
        my="auto"
        flex={["auto", "1"]}
        position="relative"
        maxH={["80px", "800px"]}
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

        <VStack position="relative" top="-160px" display={["none", "flex"]}>
          <Image
            src={"/images/landing/main.png"}
            maxH="75vh"
            display={["none", "block"]}
            alt="context"
          />

          <Box
            id="steps"
            style={{ marginTop: "30px" }}
            position="relative"
            onClick={() => onScrollDown()}
            animation={`${floatAnim} infinite 3s linear`}
            cursor={"pointer"}
          >
            <ScrollDown width="40px" height="40px" />
          </Box>

          <Box>
            {steps.map((step) => {
              return <HomeStep step={step} key={step.step} />;
            })}
          </Box>

          <HStack py="100px">
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
