import Header from "@/components/Header";
import { Arrow, Clock, Connect, Users } from "@/components/icons";
import Pending from "@/components/Pending";
import Window from "@/components/Window";
import {
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  HStack,
  VStack,
  Button,
  List,
  ListItem,
  Divider,
  Link,
  Spacer,
  Circle,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";

const players = [
  "Apex Hunter",
  "ClickSave",
  "0x1243..123",
  "0x5453..134",
  "0x5413..543",
];

export default function Join() {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  return (
    <>
      <Header />
      <Container centerContent>
        <Window bgColor="gray.700" border="none">
          {joining ? (
            <Pending
              title="Joining Game"
              description="This will only take a minute..."
              txHash="#"
            />
          ) : (
            <Card h="full">
              <CardHeader>
                <NextLink href="/">
                  <HStack>
                    <Arrow />
                    <Text fontSize="17px">HOME</Text>
                  </HStack>
                </NextLink>
              </CardHeader>
              <CardBody>
                <List>
                  <ListItem>
                    <GamePropertyRow
                      name="Game Title"
                      description="Loan Sharkz"
                    />
                  </ListItem>
                  <ListItem>
                    <GamePropertyRow
                      name="Turn Duration"
                      description="2 minutes"
                    />
                  </ListItem>
                  <ListItem>
                    <GamePropertyRow name="Turns" description="30" />
                  </ListItem>
                </List>
                <Button variant="default" w="full" fontSize="14px" my="12px">
                  <Connect /> ryo.gg/invite/hJ12
                </Button>
                <List bgColor="gray.900" borderColor="black">
                  <ListItem p="5px">
                    <HStack fontSize="14px">
                      <Users /> <Text>LOBBY</Text>
                      <Spacer />
                      <Circle bgColor="gray.800" size="24px">
                        6
                      </Circle>
                    </HStack>
                  </ListItem>
                  {players.map((name, index) => (
                    <ListItem key={index}>
                      <PlayerRow index={index + 1} name={name} />
                    </ListItem>
                  ))}
                </List>
              </CardBody>
              <Divider />
              <CardFooter flexDirection="column">
                <HStack
                  w="full"
                  justify="center"
                  borderRadius="4px"
                  bgColor="whiteAlpha.100"
                  p="12px"
                  fontSize="14px"
                >
                  <Clock />
                  <Text>Begins in</Text>
                  <Text color="blue.200">12m 37s</Text>
                </HStack>
                <Button flex="1" onClick={() => setJoining(true)}>
                  Join
                </Button>
              </CardFooter>
            </Card>
          )}
        </Window>
      </Container>
    </>
  );
}

const PlayerRow = ({
  index,
  name,
  icon,
}: {
  index: number;
  name: string;
  icon?: ReactNode;
}) => (
  <HStack>
    <Text fontSize="12px" opacity="0.5">
      {index}
    </Text>
    <Text>{icon}</Text>
    <Text fontSize="14px">{name}</Text>
  </HStack>
);

const GamePropertyRow = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => (
  <HStack fontSize="14px">
    <Text minWidth="150px" color="gray.400">
      {name}:
    </Text>
    <Text>{description}</Text>
  </HStack>
);
