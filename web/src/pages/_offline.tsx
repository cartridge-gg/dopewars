import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  keyframes,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { Alert, Clock } from "@/components/icons";
import { User } from "@/components/icons/archive";
import { playSound, Sounds } from "@/hooks/sound";
import Leaderboard from "@/components/Leaderboard";
import { useSystems } from "@/dojo/systems/useSystems";
import { useGlobalScores } from "@/dojo/components/useGlobalScores";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/dojo";
import { JoinedEventData } from "@/dojo/events";
import { getLocationById } from "@/dojo/helpers";
import { usePlayerStore } from "@/hooks/state";
import HomeLeftPanel from "@/components/HomeLeftPanel";
import Tutorial from "@/components/Tutorial";
import { useEffect, useState } from "react";
import { play } from "@/hooks/media";

export default function Offline() {
  return (
    <Layout>
      <VStack boxSize="full" gap="10px" justify="center">
        OFFLINE !
      </VStack>
    </Layout>
  );
}
