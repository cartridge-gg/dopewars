import { Arrow, Cigarette, DollarBag, PaperCashIcon, PaperIcon } from "@/components/icons";
import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";
import { Layout } from "@/components/layout";
import { PredictoorResultData } from "@/dojo/events";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import { useSystems } from "@/dojo/hooks";
import { sleep } from "@/dojo/utils";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Button, HStack, VStack, Text, Box, Image } from "@chakra-ui/react";
import { useAccount, useProvider } from "@starknet-react/core";
import { useCallback, useState } from "react";
import { selector } from "starknet";

const allDrugs = [
  {
    name: "Ludes",
    icon: <Ludes />,
  },
  {
    name: "Speed",
    icon: <Speed />,
  },
  {
    name: "Weed",
    icon: <Weed />,
  },
  {
    name: "Acid",
    icon: <Acid />,
  },
  {
    name: "Shrooms",
    icon: <Shrooms />,
  },
  {
    name: "Ketamine",
    icon: <Ketamine />,
  },
  {
    name: "Heroin",
    icon: <Heroin />,
  },
  {
    name: "Cocaine",
    icon: <Cocaine />,
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
  const [offests, setOffests] = useState([0, 0, 0]);
  const [refresh, setRefresh] = useState(false);
  const [isWin, setIsWin] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [credits, setCredits] = useState(5);

  const checkCombination = (offests: number[]) => {
    let off0 = (slotByRoll + (offests[0] % slotByRoll)) % slotByRoll;
    let off1 = (slotByRoll + (offests[1] % slotByRoll)) % slotByRoll;
    let off2 = (slotByRoll + (offests[2] % slotByRoll)) % slotByRoll;

    let slot0 = rolls[0][off0];
    let slot1 = rolls[1][off1];
    let slot2 = rolls[2][off2];

    console.log(offests);
    console.log(off0, off1, off2);
    console.log(slot0, slot1, slot2);

    let allEqual = slot0 === slot1 && slot1 === slot2;
    let twoEqual = slot0 === slot1 || slot0 === slot2 || slot1 === slot2;

    console.log(allEqual);
    console.log(twoEqual);

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

  const onFreeCredit = () => {
    setCredits(credits + 1);
  };

  const onRoll = () => {
    if (isRolling || credits === 0) return;

    setIsWin(false);
    setIsRolling(true);
    setCredits(credits - 1);
    playSound(Sounds.Roll);

    let newOffests = offests;
    for (let i = 0; i < 3; i++) {
      const random = Math.floor(Math.random() * slotByRoll) + (1 + Math.ceil(Math.random() * 4)) * slotByRoll;
      newOffests[i] -= random;
    }

    setOffests(newOffests);
    setRefresh(!refresh);

    const { type, creditsChange, win } = checkCombination(newOffests);

    setTimeout(() => {
      setIsWin(win);
      if (win) {
        setCredits((credits) => credits + creditsChange);
        playSound(Sounds.SlotJackpot);
      }
    }, 4_600);

    setTimeout(() => {
      setIsRolling(false);
    }, 5_000);
  };

  return (
    <Layout isSinglePanel={true}>
      <VStack w="full" h="100%" alignItems="center" justifyContent="center" gap={6}>
        <Box position="relative">
          {refresh && <></>}
          <Image
            src="/images/slot.png"
            alt="watch"
            position="absolute"
            width="920px"
            height="1010px"
            left="-360px"
            top="-233px"
            maxWidth="none"
            transform="rotateY(-10deg)"
            zIndex={-1}
          />

          <Box
            position="absolute"
            w="20px"
            h="20px"
            top="680px"
            left="-90px"
            // background="black"
            zIndex={1}
            onClick={onFreeCredit}
          ></Box>

          <Box visibility={credits > 0 ? "visible" : "hidden"}>
            <Box position="absolute" top="308px" marginLeft="43px" transform="skewX(20deg)">
              <Button
                isDisabled={isRolling}
                onClick={onRoll}
                w="300px"
                _disabled={{ background: "neon.800" }}
                _hover={{ background: "neon.800" }}
              >
                ROLL
              </Button>
            </Box>
            <HStack
              h="270px"
              w="340px"
              // border="solid 5px"
              // borderColor="yellow.400"
              marginLeft="-15px"
              overflow="hidden"
              style={{
                perspective: "1600px",
                transform: "rotateY(25deg) rotateX(-5deg) skewX(5deg)",
                // transform:"rotateX(45deg)"
              }}
            >
              <Box position="absolute" top="10px" right="0px">
                <Text textTransform="uppercase" fontSize="14px">
                  {credits} <PaperIcon />
                </Text>
              </Box>

              {rolls.map((roll, ri) => {
                return (
                  <VStack
                    key={`ri-${ri}`}
                    position="absolute"
                    w="100px"
                    h="100px"
                    top="10Opx"
                    left={`${ri * (slotSize + 10) + 5}px`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${-offests[ri] * slotAngle}deg)`,
                      transition: `${4 + ri / 3}s`,
                      // transitionTimingFunction: "ease-in-out",
                      transitionTimingFunction: "cubic-bezier(.1,-0.3,.3,1.1)",
                    }}
                  >
                    {roll.map((v, i) => {
                      let isCurrent = (offests[ri] - i) % slotByRoll === 0;
                      return (
                        <Box
                          key={`i-${i}`}
                          position="absolute"
                          display="flex"
                          w="100px"
                          h="100px"
                          borderBottom="solid 1px"
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
      </VStack>
    </Layout>
  );
}
