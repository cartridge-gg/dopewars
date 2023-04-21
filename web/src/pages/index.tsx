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
        <VStack minW="600px" gap="10px">
          <HStack w="full" gap="inherit">
            <Button flex="1">Sell</Button>
            <Button flex="1">Buy</Button>
          </HStack>
          <HStack w="full" gap="inherit">
            <Button flex="1" isDisabled>
              Disabled
            </Button>
          </HStack>
        </VStack>
      </Container>
    </>
  );
}
