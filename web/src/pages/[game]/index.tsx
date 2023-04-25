import Header from "@/components/Header";
import { Arrow, Chat, Clock } from "@/components/icons";
import {
  Spacer,
  Text,
  VStack,
  Container,
  HStack,
  Box,
  SimpleGrid,
  useToken,
  Heading,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import Button from "@/components/Button";
import { Ludes, Weed, Acid, Speed } from "@/components/icons/drugs";

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

export default function Join() {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  return (
    <>
      <Header />
      <Container centerContent>
        <VStack minW="500px" gap="9px">
          <SimpleGrid columns={2} w="full" gap="18px" fontSize="20px">
            {drugs.map((drug, index) => (
              <Card h="180px" key={index}>
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
