import { Cigarette, Flipflop, PaperIcon } from "@/components/icons";
import { Cocaine, Shrooms, Weed } from "@/components/icons/drugs";
import { AK47, Glock } from "@/components/icons/items";
import { Layout } from "@/components/layout";
import { useDojoChains, useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { Dopewars_SlotMachine } from "@/generated/graphql";
import { playSound, Sounds } from "@/hooks/sound";
import { IsMobile } from "@/utils/ui";
import { HStack, VStack, Text, Box, Image, keyframes, Button, Spacer } from "@chakra-ui/react";
import { Model, Subscription, ToriiClient } from "@dojoengine/torii-client";
import { useAccount } from "@starknet-react/core";
import { useCallback, useEffect, useRef, useState } from "react";

// import * as torii from "@dojoengine/torii-client";

const onRollAnim = keyframes`  
  0% {transform: rotateX(0deg)}   
  5% {transform: rotateX(-50deg)}   
  15% {transform: rotateX(-45deg)}   
  100% {transform: rotateX(0deg)}   
`;

const onWinAnim = keyframes`  
  0% {filter: opacity(0.1)}   
  20% {filter: opacity(0.8)}   
  40% {filter: opacity(0.05)}   
  60% {filter: opacity(0.9)}   
  80% {filter: opacity(0.75)}   
`;

const allDrugs = [
  {
    name: "FlipFlop",
    icon: <Flipflop width="60px" height="60px" />,
    iconSmall: <Flipflop width="16px" height="16px" />,
  },
  {
    name: "Weed",
    icon: <Weed width="60px" height="60px" />,
    iconSmall: <Weed width="16px" height="16px" />,
  },

  {
    name: "Shrooms",
    icon: <Shrooms width="60px" height="60px" />,
    iconSmall: <Shrooms width="16px" height="16px" />,
  },
  {
    name: "Cocaine",
    icon: <Cocaine width="60px" height="60px" />,
    iconSmall: <Cocaine width="16px" height="16px" />,
  },
  {
    name: "Cigar",
    icon: <Cigarette width="60px" height="60px" />,
    iconSmall: <Cigarette width="16px" height="16px" />,
  },
  {
    name: "Glock",
    icon: <Glock width="60px" height="60px" />,
    iconSmall: <Glock width="16px" height="16px" />,
  },
  {
    name: "Ak47",
    icon: <AK47 width="60px" height="60px" />,
    iconSmall: <AK47 width="16px" height="16px" />,
  },
  {
    name: "Paper",
    icon: <PaperIcon width="50px" height="50px" />,
    iconSmall: <PaperIcon width="16px" height="16px" />,
  },
];

const payouts_3_of_a_kind = [
  {
    combination: [7, 7, 7],
    payout: 50,
  },
  {
    combination: [6, 6, 6],
    payout: 25,
  },
  {
    combination: [5, 5, 5],
    payout: 10,
  },
  {
    combination: [4, 4, 4],
    payout: 9,
  },
  {
    combination: [3, 3, 3],
    payout: 8,
  },
  {
    combination: [2, 2, 2],
    payout: 7,
  },
  {
    combination: [1, 1, 1],
    payout: 6,
  },
  {
    combination: [0, 0, 0],
    payout: 5,
  },
];

const payouts_2_of_a_kind = [
  {
    combination: [7, 7],
    payout: 3,
  },
  {
    combination: [6, 6],
    payout: 3,
  },
  {
    combination: [5, 5],
    payout: 2,
  },
  {
    combination: [4, 4],
    payout: 2,
  },
  {
    combination: [3, 3],
    payout: 1,
  },
  {
    combination: [2, 2],
    payout: 1,
  },
  {
    combination: [1, 1],
    payout: 1,
  },
  {
    combination: [0, 0],
    payout: 1,
  },
];

const rolls = [
  [2, 0, 1, 7, 2, 4, 0, 1, 0, 3, 2, 0, 2, 5, 0, 1, 0, 6, 0, 3, 2, 1],
  [7, 5, 0, 2, 0, 1, 4, 2, 5, 0, 3, 0, 6, 1, 3, 2, 0, 1, 6, 0, 1, 4],
  [4, 1, 3, 4, 2, 5, 1, 0, 1, 5, 0, 2, 1, 4, 3, 1, 0, 2, 0, 3, 6, 7],
];

const slotByRoll = 22;
const slotAngle = 360 / slotByRoll;
const slotSize = 100;
const translateRadius = (slotSize - 4) / 2 / Math.tan(Math.PI / slotByRoll);

export default function Slot() {
  const { account } = useAccount();
  const { createSlot, rollSlot, cheatSlot } = useSystems();
  const {
    chains: { selectedChain },
  } = useDojoContext();
  const { gameId } = useRouterContext();
  const isMobile = IsMobile();

  const [offsets, setOffsets] = useState([0, 0, 0]);
  const [refresh, setRefresh] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [credits, setCredits] = useState(0);
  const startAt = useRef(Date.now());

  const [toriiClient, setToriiClient] = useState<ToriiClient>();
  const [subscription, setSubscription] = useState<Subscription>();

  useEffect(() => {
    const init = async () => {
      if (!gameId) return;

      setIsRolling(true);
      const torii = await import("@dojoengine/torii-client");
      const client = await torii.createClient({
        rpcUrl: selectedChain.rpcUrl!,
        toriiUrl: selectedChain.toriiUrl.replace("/graphql", ""),
        relayUrl: "",
        worldAddress: selectedChain.manifest.world.address || "",
      });
      setToriiClient(client);

      const entities = await client.getEntities({
        // clause: {
        //   Member: {
        //     member: "game_id",
        //     model: "dopewars-SlotMachine",
        //     operator: "Eq",
        //     value: {
        //       Primitive: { U32: Number(gameId) },
        //     },
        //   },
        // },
        clause: {
          Keys: {
            keys: [Number(gameId).toString()],
            models: ["dopewars-SlotMachine"],
            pattern_matching: "FixedLen",
          },
        },
        limit: 1,
        offset: 0,
      });

      if (Object.keys(entities).length === 0) {
        if (account) {
          await createSlot(Number(gameId));
        }
      } else {
        const machine = entities[Object.keys(entities)[0]]["dopewars-SlotMachine"] as Model;
        setCredits(Number(machine.credits.value));
        const newOffsets = [
          Number(machine.offset_r.value),
          Number(machine.offset_y.value),
          Number(machine.offset_o.value),
        ];
        setOffsets(newOffsets);

        setIsRolling(false);
      }

      // subscribe to changes
      const sub = await client.onEntityUpdated(
        [
          {
            Keys: {
              keys: [gameId],
              models: ["dopewars-SlotMachine"],
              pattern_matching: "FixedLen",
            },
          },
        ],
        onEntityUpdated,
      );
      setSubscription(sub);
    };

    init();
  }, [selectedChain, account, gameId]);

  const onEntityUpdated = useCallback(
    async (entity: string, update: any) => {
      const machine = update["dopewars-SlotMachine"] as Model;
      if (!machine) return;
      const newOffsets = [
        Number(machine.offset_r.value),
        Number(machine.offset_y.value),
        Number(machine.offset_o.value),
      ];
      // console.log("onEntityUpdated", update);
      // console.log("newOffsets", newOffsets);

      const { type, creditsChange, win } = checkCombination(newOffsets);
      const elasped = Date.now() - startAt.current;
      const delay = elasped > 1_000 ? 0 : 1_000 - elasped;
    
      setTimeout(() => {
        setOffsets(newOffsets);
      }, delay);

      setTimeout(() => {
        setCredits(Number(machine.credits.value));
        setIsWin(win);
        if (win) {
          playSound(Sounds.SlotJackpot);
        }
      }, delay + 3_600);
    },
    [startAt, setOffsets, setCredits, setIsWin],
  );

  const checkCombination = (offests: number[]) => {
    let off0 = (slotByRoll + (offests[0] % slotByRoll)) % slotByRoll;
    let off1 = (slotByRoll + (offests[1] % slotByRoll)) % slotByRoll;
    let off2 = (slotByRoll + (offests[2] % slotByRoll)) % slotByRoll;

    let slot0 = rolls[0][off0];
    let slot1 = rolls[1][off1];
    let slot2 = rolls[2][off2];

    let allEqual = slot0 === slot1 && slot1 === slot2;
    let twoEqual = slot0 === slot1 || slot0 === slot2 || slot1 === slot2;

    if (allEqual) {
      return {
        win: true,
        type: "ALL",
        creditsChange: 420,
      };
    }
    if (twoEqual) {
      return {
        win: true,
        type: "TWO",
        creditsChange: 3,
      };
    }

    return {
      win: false,
      type: "LOSER",
      creditsChange: 0,
    };
  };

  const onCheat = async () => {
    const result = await cheatSlot(Number(gameId));
    console.log(result);
  };

  const onRoll = useCallback(async () => {
    if (isRolling || credits === 0) return;

    setIsWin(false);
    setIsRolling(true);
    setCredits(credits - 1);
    playSound(Sounds.HoverClick);
    playSound(Sounds.Roll);

    startAt.current = Date.now();

    // fake roll waiting results
    let newOffests = offsets;
    for (let i = 0; i < 3; i++) {
      const random = Math.floor(Math.random() * slotByRoll) + 3 * slotByRoll;
      newOffests[i] += random;
    }
    setOffsets(newOffests);

    const result = await rollSlot(Number(gameId));

    setRefresh(!refresh);

    setTimeout(() => {
      setIsRolling(false);
    }, 5_000);
  }, [isRolling, credits, setIsWin, setIsRolling, setCredits]);

  return (
    <Layout isSinglePanel={true}>
      <VStack w="full" h="100%" alignItems="center" justifyContent="center" gap={6}>
        <VStack position="relative" transform={isMobile ? "scale(0.7)" : ""}>
          {refresh && <></>}

          <Box
            position="absolute"
            left="-3px"
            top="55px"
            w="3px"
            h="20px"
            bg="neon.600"
            cursor="pointer"
            onClick={async () => {
              await createSlot(Number(gameId));
            }}
          ></Box>

          <Box
            position="absolute"
            right="0px"
            top="340px"

            // transform="rotateY(-10deg)"
          >
            <Box
              position="absolute"
              w="20px"
              h="100px"
              bg="neon.600"
              left="0px"
              top="0px"
              borderTopRightRadius="6px"
              borderBottomRightRadius="6px"
            ></Box>
            <Box position="absolute" w="4px" h="40px" bg="neon.600" left="20px" top="30px"></Box>
            <Box
              position="absolute"
              w="20px"
              h="200px"
              backgroundColor="neon.500"
              left="24px"
              top="-110px"
              borderRadius="6px"
              transformOrigin="bottom"
              animation={isRolling ? `${onRollAnim} 2.5s ease-out` : "none"}
            >
              <Box
                onClick={onRoll}
                position="absolute"
                w="40px"
                h="40px"
                borderRadius="30px"
                backgroundColor="neon.800"
                _hover={{
                  backgroundColor: "neon.600",
                }}
                left="-10px"
                top="-10px"
                cursor="grab"
                _active={{
                  cursor: "grabbing",
                }}
              >
                <PaperIcon
                  position="absolute"
                  w="46px"
                  h="46px"
                  color="neon.400"
                  filter="opacity(0.6)"
                  left="-3px"
                  top="-3px"
                  animation={isRolling ? `${onRollAnim} 2.5s ease-out` : "none"}
                  zIndex={1}
                />
              </Box>
            </Box>
          </Box>

          <VStack
            gap={0}
            border="solid 20px"
            borderColor="neon.600"
            // borderTopRadius="120px"
            // borderBottomRadius="6px"
            borderRadius="6px"
            backgroundColor="neon.800"
            overflow="hidden"
          >
            <Box
              w="calc(100% - 10px)"
              h="calc(100% - 10px)"
              top="5px"
              position="absolute"
              style={{
                borderImage: "url(/images/drugs/acid.svg) 100 / 60px / 40px round",
                filter: "opacity(0.30)",
              }}
              // border="dotted 12px"
              // borderColor="neon.400"
              borderTopRadius="120px"
              borderBottomRadius="6px"
              animation={isWin ? `${onWinAnim} 0.5s 7` : "none"}
            ></Box>
            <VStack w="full" h="220px" position="relative">
              {credits > 0 && (
                <VStack position="absolute" top="32px" left="0px" width="100%" color="neon.400" gap={0}>
                  <Text variant="headings" textAlign="center" w="100%" border="solid 1px" borderColor="neon.500" mb={1}>
                    PAYOUTS
                  </Text>
                  <HStack gap={6}>
                    <VStack gap={0} w="110px">
                      {/* <Text
                      variant="headings"
                      textAlign="center"
                      w="100%"
                      // border="solid 1px"
                      // borderColor="neon.500"
                      // mb={2}
                    >
                      3 OF A KIND
                    </Text> */}
                      {payouts_3_of_a_kind.map((v, idx) => {
                        return (
                          <HStack justifyContent="space-between" gap={1} key={`payout-${idx}`}>
                            <>
                              {allDrugs[v.combination[0]].iconSmall}
                              {allDrugs[v.combination[1]].iconSmall}
                              {allDrugs[v.combination[2]].iconSmall}
                            </>
                            <Text w="50px" textAlign="right">
                              {v.payout}
                              <PaperIcon />
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                    <VStack gap={0} w="110px">
                      {/* <Text
                      variant="headings"
                      textAlign="center"
                      w="100%"
                      // border="solid 1px"
                      // borderColor="neon.500"
                      // mb={2}
                    >
                      2 OF A KIND
                    </Text> */}
                      {payouts_2_of_a_kind.map((v, idx) => {
                        return (
                          <HStack justifyContent="space-between" gap={1} key={`payout-${idx}`}>
                            <>
                              {allDrugs[v.combination[0]].iconSmall}
                              {allDrugs[v.combination[1]].iconSmall}
                            </>
                            <Text w="50px" textAlign="right">
                              {v.payout}
                              <PaperIcon />
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  </HStack>
                </VStack>
              )}

              <Image
                position="absolute"
                top="20px"
                w="100%"
                h="100%"
                src="/images/sunset.png"
                objectFit="cover"
                filter="opacity(0.2)"
                animation={isWin ? `${onWinAnim} 0.5s 7` : "none"}
              />

              <Box position="absolute" top="8px" left={0} width="100%">
                <Text textTransform="uppercase" textAlign="center" fontSize="14px" color="neon.400">
                  {credits}
                  <PaperIcon />
                </Text>
              </Box>
            </VStack>

            <Box border="solid 10px" borderColor="neon.800" borderRadius="0px" backgroundColor="neon.800">
              <Box
                position="relative"
                border="solid 10px"
                borderColor="neon.600"
                borderRadius="20px"
                backgroundColor="neon.900"
              >
                {/* <Box position="absolute" w="8px" h="100%" left="101px" bg="neon.600"></Box> */}
                {/* <Box position="absolute" w="8px" h="100%" left="193px" bg="neon.600"></Box> */}
                <HStack
                  h="220px"
                  w="280px"
                  border="solid 10px"
                  borderColor="neon.500"
                  borderRadius="10px"
                  boxSizing="content-box"
                  overflow="hidden"
                  style={{
                    perspective: "1600px",
                    // transform: "rotateY(25deg) rotateX(-5deg) skewX(5deg)",
                  }}
                >
                  {rolls.map((roll, ri) => {
                    return (
                      <VStack
                        key={`ri-${ri}`}
                        position="absolute"
                        w="100px"
                        h="100px"
                        top="55px"
                        left={`${ri * (slotSize + 10) - 20}px`}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: `rotateX(${-offsets[ri] * slotAngle}deg)`,
                          transition: `${4 + ri / 3}s`,
                          // transitionTimingFunction: "ease-in-out",
                          transitionTimingFunction: "cubic-bezier(.1,-0.3,.3,1.1)",
                        }}
                      >
                        {roll.map((v, i) => {
                          let isCurrent = (offsets[ri] - i) % slotByRoll === 0;
                          return (
                            <Box
                              key={`i-${i}`}
                              position="absolute"
                              display="flex"
                              w="100px"
                              h="100px"
                              // borderBottom="solid 1px"
                              border="solid 2px"
                              borderColor="neon.500"
                              backgroundColor={isWin && isCurrent ? "neon.500" : "transparent"}
                              style={{
                                transform: `rotateX(${slotAngle * i}deg) translateZ(-${translateRadius}px)`,
                                backfaceVisibility: "hidden",
                              }}
                              alignItems="center"
                              justifyContent="center"
                              p={2}
                              borderRadius={2}
                            >
                              <VStack gap={0}>
                                {allDrugs[v].icon}
                                <Text textTransform="uppercase" fontSize="12px">
                                  {/* {i} */}
                                  {allDrugs[v].name}
                                </Text>
                              </VStack>
                            </Box>
                          );
                        })}
                      </VStack>
                    );
                  })}
                </HStack>
              </Box>
            </Box>

            {/* <Button
              isDisabled={isRolling}
              onClick={onRoll}
              w="100%"
              _disabled={{ background: "neon.800" }}
              _hover={{ background: "neon.800" }}
              // marginBottom="10px"
            >
              ROLL
            </Button> */}
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}