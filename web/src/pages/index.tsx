import Head from "next/head";
import Image from "next/image";
import {
  Button,
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
  VStack,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {
  Cartridge,
  Connect,
  Disconnect,
  Cigarette,
  User,
  Users,
  Clock,
} from "@/components/icons";
import { useModal } from "@/components/Modal/ModalProvider";
import { useAccount, useConnectors } from "@starknet-react/core";
import { argentConnector, controllerConnector } from "./_app";
import { formatAddress } from "@/utils";
import Players from "@/components/Players";
import Timer from "@/components/Timer";
import Lobby from "@/components/Lobby";
import Game from "@/components/Game";
import Header from "@/components/Header";
import Results from "@/components/PlayerResult";
import Window from "@/components/Window";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header />
      <Container centerContent>
        <Window bgColor="gray.700" border="none">
          <Flex align="center" justify="center" h="150px">
            <Text fontSize="14px" color="white" opacity="0.5">
              LOBBY ILLUSTRATION
            </Text>
          </Flex>
          <Card w="full">
            <CardHeader color="white">
              <User />
              <Text textTransform="uppercase" fontSize="17px">
                My Games
              </Text>
            </CardHeader>
            <CardBody>
              <HStack py="12px" bgColor="whiteAlpha.100" justify="center">
                <Text fontSize="14px" color="gray.400">
                  You are not currently playing any games
                </Text>
              </HStack>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                w="full"
                py="8px"
                onClick={() => {
                  router.push("/create");
                }}
              >
                Create New
              </Button>
            </CardFooter>
          </Card>
          <Card h="full">
            <CardHeader>
              <Users />
              <Text textTransform="uppercase" fontSize="17px">
                Available Games
              </Text>
            </CardHeader>
            <CardBody>
              <Flex direction="column" gap="6px">
                <HStack
                  layerStyle="card"
                  bgColor="gray.900"
                  borderColor="black"
                >
                  <Text>Loan Sharkz</Text>
                  <Spacer />
                  <HStack w="150px">
                    <Clock fill="gray.400" />
                    <Text color="blue.200">1h</Text>
                    <Spacer />
                    <Users fill="gray.400" />
                    <Text> 3/6</Text>
                  </HStack>
                </HStack>
                <HStack
                  layerStyle="card"
                  bgColor="gray.900"
                  borderColor="black"
                >
                  <Text>Joey's Room</Text>
                  <Spacer />

                  <HStack w="150px">
                    <Clock fill="gray.400" />
                    <Text color="blue.200">16m</Text>
                    <Spacer />
                    <Users fill="gray.400" />
                    <Text> 1/6</Text>
                  </HStack>
                </HStack>
                <HStack
                  layerStyle="card"
                  bgColor="gray.900"
                  borderColor="black"
                >
                  <Text>Friends</Text>
                  <Spacer />
                  <HStack w="150px">
                    <Clock fill="gray.400" />
                    <Text color="blue.200">3m</Text>
                    <Spacer />
                    <Users fill="gray.400" />
                    <Text> 6/6</Text>
                  </HStack>
                </HStack>
              </Flex>
            </CardBody>
          </Card>
        </Window>
      </Container>
      {/* <Center h="100vh">
        <Lobby addresses={["0x0"]} startInSeconds={500} /> 
        <Game
          city={"brooklyn"}
          currentDay={0}
          totalDays={30}
          cashBalance={100}
        /> 
          <Results
            playerResults={[
              {
                address: "0x0",
                money: 100,
                rank: 1,
              },
            ]}
          />
      </Center> */}
    </>
  );
}
