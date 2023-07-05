import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
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
      title="LEADERBOARD"
      prefixTitle="Welcome to the"
      backgroundColor={"transparent"}
      headerImage="/images/will-smith-with-attitude.png"
    >
      <Content>
        <Leaderboard />
      </Content>
    </Layout>
  );
}
