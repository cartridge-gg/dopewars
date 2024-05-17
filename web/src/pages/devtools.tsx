import { Layout } from "@/components/layout";
import { useSystems } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { Button, HStack, Input, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function LeaderboardPage() {
  const { toast } = useToast();

  const { failingTx, createFakeGame } = useSystems();

  const [running, setRunning] = useState(false);
  const valueRef = useRef(100_000);
  const handleRef = useRef<any | null>();

  const onFailingTx = async () => {
    try {
      const res = await failingTx();
    } catch (e) {
      console.log(e);
    }
  };

  const onCreateFakeGame = async () => {
    const res = await createFakeGame(valueRef.current);
    toast({ message: "creating fake game Ser" });
  };

  const update = useCallback(() => {
    console.log("update", valueRef.current)
    valueRef.current = Number(Number(valueRef.current)+ 1)
    onCreateFakeGame()
  }, [valueRef.current]);

  useEffect(() => {
    if (running && !handleRef.current) {
      handleRef.current = setInterval(() => update(), 2600);
    } else {
      if (!running) {
        clearInterval(handleRef.current);
        handleRef.current = null;
      }
    }
  }, [running, setRunning, valueRef.current]);

  return (
    <Layout
      leftPanelProps={{
        title: "DEVTOOLS",
        prefixTitle: "Welcome to the",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <VStack w="full" alignItems="flex-start" gap={6}>
        <Button onClick={onFailingTx}>Failing tx</Button>

        <HStack w="full ">
          <Button onClick={onCreateFakeGame}>createFakeGame</Button>
          <Input value={valueRef.current} onChange={(e: any) => valueRef.current = e.target.value} w="100px" />

          {running && <Button onClick={() => setRunning(false)}>STOP</Button>}
          {!running && <Button onClick={() => setRunning(true)}>START</Button>}
        </HStack>
      </VStack>
    </Layout>
  );
}
