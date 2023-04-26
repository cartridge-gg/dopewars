import {
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
  VStack,
  Container,
  HStack,
  Divider,
  StyleProps,
  SystemProps,
  Box,
  SimpleGrid,
  useToken,
  Heading,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  UnorderedList,
  ListItem,
  Button,
  OrderedList,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Clock, Link } from "@/components/icons";
import { Footer } from "@/components/Footer";
import Content from "@/components/Content";
import { breakpoint } from "@/utils/ui";
import { User } from "@/components/icons/archive";

export default function Home() {
  const router = useRouter();
  return (
    <Layout
      title="Roll Your Own"
      prefixTitle="Built On Dojo"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/city.png');"
    >
      <Content position="relative" top={breakpoint("20px", "20%")}>
        <VStack w="full" gap="20px">
          <Text textStyle="subheading" fontSize="13px">
            My Games
          </Text>
          <VStack
            layerStyle="rounded"
            w="full"
            p="30px 20px 20px 20px"
            gap="20px"
          >
            <Text color="neon.600" fontSize="14px">
              YOU HAVE NO GAMES
            </Text>
            <Button w="full" onClick={() => router.push("/0xdead")}>
              Create
            </Button>
          </VStack>
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
      </Content>
    </Layout>
  );
}

const Game = ({
  name,
  startTime,
  joined,
  max,
  onClick,
}: {
  name: string;
  startTime: string;
  joined: number;
  max: number;
  onClick?: () => void;
}) => (
  <HStack
    layerStyle="card"
    w="full"
    px="14px"
    py="10px"
    cursor="pointer"
    onClick={onClick}
  >
    <Text whiteSpace="nowrap">{name}</Text>
    <Divider borderStyle="dotted" borderColor="neon.200" />
    <HStack gap="20px">
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
