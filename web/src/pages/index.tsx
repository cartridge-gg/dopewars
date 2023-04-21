import Head from "next/head";
import Image from "next/image";
import {
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
  StyleProps,
  SystemProps,
  Box,
  SimpleGrid,
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
import { css } from "@emotion/react";
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
import { number } from "starknet";
import NextLink from "next/link";
import { Weed } from "@/components/icons/drugs";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Container centerContent>
        <VStack minW="500px" gap="10px">
          <SimpleGrid
            columns={2}
            w="full"
            spacing="20px"
            fontSize="20px"
            color="neon.600"
          >
            <VStack layerStyle="card" height="200px" p="10px">
              <Text>LUDES</Text>
            </VStack>
            <VStack layerStyle="card" height="200px" p="10px">
              <Text>SPEED</Text>
            </VStack>
            <VStack layerStyle="card" height="200px" p="10px">
              <Text>ACID</Text>
            </VStack>
            <VStack layerStyle="card" height="200px" p="10px">
              <Text>WEED</Text>
            </VStack>
          </SimpleGrid>
          <HStack w="full" gap="inherit">
            <Button flex="1">Buy</Button>
            <Button flex="1" isDisabled>
              Sell
            </Button>
          </HStack>
          <HStack w="full" gap="inherit">
            <Button flex="1">Travel and end turn</Button>
          </HStack>
        </VStack>
      </Container>
    </>
  );
}
