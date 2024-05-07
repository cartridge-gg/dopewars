import { Layout } from "@/components/layout";
import { useSystems } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { Button, HStack, VStack } from "@chakra-ui/react";

export default function LeaderboardPage() {
  const { toast } = useToast();

  const { feedLeaderboard, failingTx, createFakeGame, launder } = useSystems();

  const onFailingTx = async () => {
    try {
      const res = await failingTx();
    } catch (e) {
      console.log(e);
    }
  };

  const onFeedLeaderboard = async () => {
    const res = await feedLeaderboard(20);
    toast({ message: "yes sir" });
  };

  const onCreateFakeGame = async () => {
    const res = await createFakeGame(0);
    toast({ message: "creating fake game Ser" });
  };

  const onLaunder = async () => {
    const res = await launder(1);
    toast({ message: "laundering..." });
  };

  return (
    <Layout
      leftPanelProps={{
        title: "DEVTOOLS",
        prefixTitle: "Welcome to the",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <VStack w="full" alignItems="flex-start">
        <Button onClick={onFailingTx}>Failing tx</Button>
        <Button onClick={onFeedLeaderboard}>feedLeaderboard</Button>
        <Button onClick={onCreateFakeGame}>createFakeGame</Button>
        <Button onClick={onLaunder}>launder</Button>
      </VStack>
    </Layout>
  );
}
