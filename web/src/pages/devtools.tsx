import Layout from "@/components/Layout";
import { useSystems } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { Button, HStack } from "@chakra-ui/react";

export default function LeaderboardPage() {
  const { toast } = useToast();

  const { feedLeaderboard, failingTx } = useSystems();

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

  return (
    <Layout
      leftPanelProps={{
        title: "DEVTOOLS",
        prefixTitle: "Welcome to the",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <HStack w="full">
        <Button onClick={onFailingTx}>Failing tx</Button>
        <Button onClick={onFeedLeaderboard}>feedLeaderboard</Button>
      </HStack>
    </Layout>
  );
}
