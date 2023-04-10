import Header from "@/components/Header";
import { Arrow } from "@/components/icons";
import Window from "@/components/Window";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import Pending from "@/components/Pending";

const MIN_PLAYERS = 6;
const MIN_TURNS = 10;

enum GAME_STATE {
  NONE,
  DEPLOYING,
  STARTED,
  FINISHED,
}

export default function Create() {
  const router = useRouter();
  const [state, setState] = useState<GAME_STATE>(GAME_STATE.NONE);
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
    <>
      <Header />
      <Container centerContent>
        <Window bgColor="gray.700" border="none">
          {state == GAME_STATE.NONE && (
            <Card h="full">
              <CardHeader justifyContent="center">
                <Text>New Game</Text>
              </CardHeader>
              <CardBody pt="40px">
                <VStack>
                  <Row name="Game Name:">
                    <Input placeholder="name" />
                  </Row>
                  <Row name="Players:">
                    <Input type="number" value={numPlayers} min="0" readOnly />
                    <Button variant="default" onClick={() => incPlayers()}>
                      <Arrow variant="up" size="sm" />
                    </Button>
                    <Button variant="default" onClick={() => decPlayers()}>
                      <Arrow variant="down" size="sm" />
                    </Button>
                  </Row>
                  <Row name="Turns:">
                    <Input type="number" value={numTurns} min="0" readOnly />
                    <Button variant="default" onClick={() => incTurns()}>
                      <Arrow variant="up" size="sm" />
                    </Button>
                    <Button variant="default" onClick={() => decTurns()}>
                      <Arrow variant="down" size="sm" />
                    </Button>
                  </Row>
                  <Row name="Starts at:">
                    <Input placeholder="datepicker" min="0" />
                  </Row>
                </VStack>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button
                  variant="secondary"
                  flex="1"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
                <Button flex="1" onClick={() => setState(GAME_STATE.DEPLOYING)}>
                  Create
                </Button>
              </CardFooter>
            </Card>
          )}
          {state == GAME_STATE.DEPLOYING && (
            <Pending
              title="New Game"
              description="Your game is being deployed..."
              txHash="#"
            />
          )}
        </Window>
      </Container>
    </>
  );
}

const Row = ({ name, children }: { name: string; children: ReactNode }) => (
  <HStack w="full" color="white">
    <Text color="gray.400" fontSize="14px" minW="200px">
      {name}
    </Text>
    {children}
  </HStack>
);
