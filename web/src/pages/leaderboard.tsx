import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Arrow, ArrowEnclosed } from "@/components/icons";
import Layout from "@/components/Layout";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

export default function Leaderboard() {
  const router = useRouter();

  return (
    <Layout
      title="LEADERBOARD"
      prefixTitle="WEN"
      backgroundColor={"transparent"}
      backgroundImage="url('/images/knife.png')"
    ></Layout>
  );
}
