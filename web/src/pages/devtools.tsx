import { Layout } from "@/components/layout";
import { useSystems } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { Button, HStack, VStack } from "@chakra-ui/react";

export default function LeaderboardPage() {
  const { toast } = useToast();

  const { failingTx, createFakeGame } = useSystems();

  const onFailingTx = async () => {
    try {
      const res = await failingTx();
    } catch (e) {
      console.log(e);
    }
  };

  const onCreateFakeGame = async () => {
    const res = await createFakeGame(0);
    toast({ message: "creating fake game Ser" });
  };

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
        <Button onClick={onCreateFakeGame}>createFakeGame</Button>
      </VStack>
    </Layout>
  );
}
