import Header from "@/components/Header";
import { Arrow, ArrowEnclosed } from "@/components/icons";
import Layout from "@/components/Layout";
import { Button, Container, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { useDevtools } from "@/dojo/hooks/useDevtools";
import { useToast } from "@/hooks/toast";
import { useSystems } from "@/dojo/hooks/useSystems";

export default function LeaderboardPage() {
  const router = useRouter();

  const { toast } = useToast();

  const { feedLeaderboard } = useDevtools();
  const { failingTx } = useSystems();

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
