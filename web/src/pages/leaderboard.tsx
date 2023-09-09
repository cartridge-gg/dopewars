import Header from "@/components/Header";
import { Arrow, ArrowEnclosed } from "@/components/icons";
import Layout from "@/components/Layout";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <Layout
      leftPanelProps={{
        title: "LEADERBOARD",
        prefixTitle: "Welcome to the",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <Leaderboard />
    </Layout>
  );
}
