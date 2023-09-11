import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { Clock, Sound } from "@/components/icons";
import { User } from "@/components/icons/archive";
import { useEffect } from "react";
import { playSound, Sounds } from "@/hooks/sound";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import BorderImage from "@/components/icons/BorderImage";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <Layout
      leftPanelProps={{
        title: "Roll Your Own",
        prefixTitle: "Dope Wars:",
        imageSrc: "/images/punk-girl.png",
      }}
    >
      <VStack w="full" gap="20px">
        <Text textStyle="subheading" fontSize="13px">
          My Games
        </Text>

        <Card variant="pixelated">
          <VStack w="full" p="30px 20px 20px 20px" gap="20px">
            <Text color="neon.500" fontSize="14px">
              YOU HAVE NO GAMES
            </Text>
            <Button w="full" onClick={() => router.push("/create")}>
              Create
            </Button>
          </VStack>
        </Card>
        <Text textStyle="subheading" fontSize="13px" pt="15px">
          AVAILABLE GAMES
        </Text>
        <VStack w="full" gap="12px">
          <Game
            name="$$ FA$TE$T POSSILBE MAP $$"
            startTime="15m"
            joined={5}
            max={6}
            onClick={() => router.push("/0xdead")}
          />
          <Game
            name="3V3 BGH @ CABLE ONLY!!!"
            startTime="26m"
            joined={2}
            max={6}
            onClick={() => router.push("/0xdead")}
          />
          <Game
            name="1V1 MAX BET"
            startTime="15m"
            joined={1}
            max={2}
            onClick={() => router.push("/0xdead")}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}

const Game = ({
  name,
  startTime,
  joined,
  max,
  onClick,
  onMouseEnter,
}: {
  name: string;
  startTime: string;
  joined: number;
  max: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) => (
  <HStack
    layerStyle="card"
    w="full"
    px="14px"
    py="10px"
    cursor="pointer"
    onClick={onClick}
    onMouseEnter={() => {
      playSound(Sounds.HoverClick, 0.3);
    }}
  >
    <HStack overflow="hidden" whiteSpace="nowrap" flex="1">
      <Text>{name}</Text>
      <Divider borderColor="neon.200" borderStyle="dotted" />
    </HStack>
    <HStack>
      <HStack color="yellow.400">
        <Clock />
        <Text>{startTime}</Text>
      </HStack>
      <HStack>
        <User boxSize="16px" />
        <Text>
          {joined}/{max}
        </Text>
      </HStack>
    </HStack>
  </HStack>
);
