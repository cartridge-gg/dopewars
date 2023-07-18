import Header from "@/components/Header";
import { Gem, Trophy, Pistol, Arrest, Roll } from "@/components/icons";
import Leaderboard from "@/components/Leaderboard";
import { useGlobalScores } from "@/hooks/dojo/components/useGlobalScores";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import {
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Box,
  Divider,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export default function End() {
  const router = useRouter();
  const { scores } = useGlobalScores();

  if (!scores) {
    return <></>;
  }

  return (
    <>
      <Header />
      <Flex
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        align="center"
        justify="center"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Container>
          <VStack flex={["0", "1"]} justify="center">
            <Heading fontSize={["40px", "48px"]} fontWeight="normal">
              Game Over
            </Heading>
            <HStack w="full">
              <VStack flex="1">
                <Image src="/images/trophy.gif" alt="winner" />
              </VStack>
              <VStack flex="1">
                <StatsItem text="Xth place" icon={<Trophy />} />
                <Divider borderColor="neon.600" />
                <StatsItem text="$$$" icon={<Gem />} />
                <Divider borderColor="neon.600" />
                <StatsItem text="X Muggings" icon={<Pistol />} />
                <Divider borderColor="neon.600" />
                <StatsItem text="X Arrest" icon={<Arrest />} />
              </VStack>
            </HStack>

            <HStack gap="10px" w={["full", "auto"]}>
              <Button variant="pixelated" flex="1">
                <Roll /> Credits
              </Button>
              <Button
                variant="pixelated"
                flex="1"
                onClick={() => {
                  router.push("/");
                }}
              >
                <Roll /> Home
              </Button>
            </HStack>
          </VStack>
          <VStack flex="1" justify="center">
            <Text>NAME ENTRY</Text>
            <Leaderboard scores={scores} />
          </VStack>
        </Container>
      </Flex>
    </>
  );
}

const StatsItem = ({ text, icon }: { text: string; icon: ReactNode }) => {
  return (
    <HStack w="full" h="30px">
      {icon} <Text>{text}</Text>
    </HStack>
  );
};
