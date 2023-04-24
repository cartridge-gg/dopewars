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
  HStack,
  Divider,
  StyleProps,
  SystemProps,
  Box,
  SimpleGrid,
  useToken,
  Heading,
} from "@chakra-ui/react";
import { Chat } from "@/components/icons";
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
import Button from "@/components/Button";
import { Ludes, Weed, Acid, Speed } from "@/components/icons/drugs";
import { ReactNode } from "react";

const drugs: CardProps[] = [
  {
    name: "Ludes",
    price: 100,
    quantity: 2,
    icon: <Ludes />,
  },
  {
    name: "Speed",
    price: 200,
    quantity: 5,
    icon: <Speed />,
  },
  {
    name: "Weed",
    price: 250,
    quantity: 1,
    icon: <Weed />,
  },
  {
    name: "Acid",
    price: 69,
    quantity: 10,
    icon: <Acid />,
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Container centerContent>
        <VStack minW="500px" gap="18px">
          <SimpleGrid columns={2} w="full" gap="36px" fontSize="20px">
            {drugs.map((drug, index) => (
              <Card {...drug} key={index} />
            ))}
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

interface CardProps {
  name: string;
  price: number;
  quantity: number;
  icon: ReactNode;
}

const Card = ({
  name,
  price,
  quantity,
  icon,
  ...props
}: CardProps & StyleProps) => (
  <VStack
    layerStyle="card"
    justifyContent="space-between"
    height="180px"
    p="10px"
    {...props}
  >
    <Text>{name}</Text>
    <Box bgColor="neon.800" borderRadius="6px">
      {icon}
    </Box>
    <HStack w="full" px="20px" fontSize="16px">
      <Text>${price}</Text>
      <Spacer />
      <Text>qty: {quantity}</Text>
    </HStack>
  </VStack>
);
