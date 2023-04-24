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
  Card,
  CardBody,
  CardHeader,
  CardFooter,
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

interface DrugProps {
  name: string;
  price: number;
  quantity: number;
  icon: ReactNode;
}

const drugs: DrugProps[] = [
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
      <Header />
      <Container centerContent>
        <VStack minW="500px" gap="9px">
          <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
            {drugs.map((drug, index) => (
              <Card h="180px">
                <CardHeader textTransform="uppercase" fontSize="20px">
                  {drug.name}
                </CardHeader>
                <CardBody>
                  <HStack w="full" justify="center">
                    <Box bgColor="neon.800" borderRadius="6px">
                      {drug.icon}
                    </Box>
                  </HStack>
                </CardBody>
                <CardFooter fontSize="14px">
                  <Text>${drug.price}</Text>
                  <Spacer />
                  <Text>qty: {drug.quantity}</Text>
                </CardFooter>
              </Card>
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
