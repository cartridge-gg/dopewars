import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Arrow, ArrowEnclosed } from "@/components/icons";
import Layout from "@/components/Layout";
import { Dropdown } from "@/components/Dropdown";
import {
  HStack,
  VStack,
  Container,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Flex,
  Spacer,
  useCounter,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

const MIN_PLAYERS = 6;
const MIN_TURNS = 10;

export default function Create() {
  const router = useRouter();
  const {
    increment: incPlayers,
    decrement: decPlayers,
    value: numPlayers,
  } = useCounter({
    defaultValue: MIN_PLAYERS,
    min: MIN_PLAYERS,
  });

  const {
    increment: incTurns,
    decrement: decTurns,
    value: numTurns,
  } = useCounter({
    defaultValue: 30,
    min: MIN_TURNS,
  });

  return (
    <Layout
      title="New Game"
      prefixTitle="Start a"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/cash_roll.png');"
    >
      <Content>
        <UnorderedList variant="underline" w="full" userSelect="none">
          <ListItem>
            <HStack>
              <Label name="Title" />
              <Input />
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <Label name="Turns" />
              <Text>{numTurns}</Text>
              <Spacer />
              <HStack>
                <ArrowEnclosed
                  variant="caret"
                  size="sm"
                  cursor="pointer"
                  onClick={() => incTurns()}
                />
                <ArrowEnclosed
                  variant="caret"
                  direction="down"
                  size="sm"
                  cursor="pointer"
                  color={numTurns <= MIN_TURNS ? "neon.500" : "neon.200"}
                  onClick={() => decTurns()}
                />
              </HStack>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <Label name="Players" />
              <Text>{numPlayers}</Text>
              <Spacer />
              <HStack>
                <ArrowEnclosed
                  variant="caret"
                  size="sm"
                  cursor="pointer"
                  onClick={() => incPlayers()}
                />
                <ArrowEnclosed
                  variant="caret"
                  direction="down"
                  size="sm"
                  cursor="pointer"
                  color={numPlayers <= MIN_PLAYERS ? "neon.500" : "neon.200"}
                  onClick={() => decPlayers()}
                />
              </HStack>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <Label name="Starts" />
              <Dropdown 
                w="full" 
                value={{value: 1, text: '20:00 UTC', label: '(29 min)'}}
                options={[
                  {value: 1, text: '20:00 UTC', label: '(29 min)'}, 
                  {value: 2, text: '20:30 UTC', label: '(59 min)'},
                  {value: 3, text: '21:00 UTC', label: '(1 hr 29 min)'},
                  {value: 4, text: '21:30 UTC', label: '(1 hr 59 min)'}
                ]}
              />
            </HStack>
          </ListItem>
        </UnorderedList>
      </Content>
      <Footer>
        <Button w={["full", "auto"]} onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button
          w={["full", "auto"]}
          onClick={() => router.push("/pending/0x123")}
        >
          Create New Game
        </Button>
      </Footer>
    </Layout>
  );
}

const Label = ({ name }: { name: string }) => (
  <Text textTransform="uppercase" minWidth="100px">
    {name}:
  </Text>
);
