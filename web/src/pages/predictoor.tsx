import { Arrow, Cigarette, DollarBag } from "@/components/icons";
import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";
import { Layout } from "@/components/layout";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import { useSystems } from "@/dojo/hooks";
import { sleep } from "@/dojo/utils";
import { useToast } from "@/hooks/toast";
import { Button, HStack, VStack, Text } from "@chakra-ui/react";
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

const getRandomUnique = (arr: any[], count: number) => {
  const randomElems: any[] = [];
  for (let i = 0; i < count + 1; i++) {
    while (randomElems.length < i) {
      let rand = Math.floor(Math.random() * arr.length);

      let elem = arr[rand];

      if (!randomElems.includes(elem)) {
        randomElems.push(elem);
      }
    }
  }

  return randomElems;
};

export default function Predictoor() {
  const [drugs, setDrugs] = useState(getRandomUnique(allDrugs, 3));
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<number | undefined>(undefined);
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [randValue, setRandValue] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useAccount();
  const { predictoor } = useSystems();

  const onPredict = useCallback(
    async (drug: number) => {
      if (!account) return;
      setIsLoading(true);
      setSelected(drug);

      try {
        // const tx = await account.execute(calls, undefined, { maxFee: 10e16 });
        const { parsedEvents } = await predictoor(drug);

        const { value, win } = parsedEvents!.find((i: any) => i.eventType === WorldEvents.PredictoorResultEvent);

        setRandValue(Number(value));
        setIsWin(Number(win) === 1);
        setTotal((total) => total + 1);

        if (Number(win) === 1) {
          setScore((score) => score + 1);
        }

        setResult(Number(value));
        await sleep(500);
        setResult(undefined);

        setDrugs(getRandomUnique(allDrugs, 3));
      } catch (e) {
        console.log(e);
      }
      setSelected(undefined);
      setIsLoading(false);
    },
    [account, total, score],
  );

  return (
    <Layout isSinglePanel={true}>
      <VStack w="full" h="100%" alignItems="center" justifyContent="center" gap={6}>
        <Text fontSize="40px" height="50px" color={isWin ? "neon.400" : "yellow.400"}>
          {result !== undefined ? (isWin ? "WINNER" : "LOSER") : ""}
        </Text>
        <HStack>
          <>
            {drugs.map((drug, idx) => {
              return (
                <HStack>
                  <VStack>
                    <Cigarette direction="down" w="40px" h="40px" visibility={result === idx ? "visible" : "hidden"} />
                    <Button isDisabled={isLoading} w={160} h={160} onClick={() => onPredict(idx)}>
                      <VStack>
                        {drug.icon}
                        <Text> {drug.name}</Text>
                      </VStack>
                    </Button>
                    <DollarBag direction="up" w="40px" h="40px" visibility={selected === idx ? "visible" : "hidden"} />
                  </VStack>
                </HStack>
              );
            })}
          </>
        </HStack>
        <Text fontSize="30px">
          {score}/{total}
        </Text>
        {total > 0 && <Text> Winrate {((score * 100) / total).toFixed(2)} %</Text>}
      </VStack>
    </Layout>
  );
}
