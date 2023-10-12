

import Header from "@/components/Header";
import { Arrow, ArrowEnclosed } from "@/components/icons";
import Layout from "@/components/Layout";
import { Button, Container, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { useDevtools } from "@/dojo/hooks/useDevtools";
import { useToast } from "@/hooks/toast";

export default function LeaderboardPage() {
  const router = useRouter();

  const { toast} = useToast();

  const { feedLeaderboard} = useDevtools()

  const onFeedLeaderboard = async () => {
    const res = await feedLeaderboard(20);
    
    toast('yes sir')
  }

  return (
    <Layout
      leftPanelProps={{
        title: "DEVTOOLS",
        prefixTitle: "Welcome to the",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <HStack w="full">
        <Button onClick={onFeedLeaderboard}>
        feedLeaderboard
        </Button>
      </HStack>
    </Layout>
  );
}

