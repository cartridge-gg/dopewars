import { ReactNode } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Spacer,
  Divider,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import {
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";
import { Inventory } from "@/components/Inventory";

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
  {
    name: "Heroin",
    price: 250,
    quantity: 1,
    icon: <Heroin />,
  },
  {
    name: "Cocaine",
    price: 69,
    quantity: 10,
    icon: <Cocaine />,
  },
];

export default function Location() {
  const router = useRouter();
  return (
    <Layout
      title="Brooklyn"
      prefixTitle="Welcome to"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/streets.png');"
    >
      <Content>
        <Inventory pb="20px" />
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
      </Content>
      <Footer>
        <Button
          w={["full", "auto"]}
          onClick={() => router.push("/0x1234/turn")}
        >
          Travel and end turn
        </Button>
      </Footer>
    </Layout>
  );
}
