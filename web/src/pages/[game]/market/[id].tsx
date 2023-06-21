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


export default function Market() {
  const router = useRouter();
  return (
    <Layout
      title="Brooklyn"
      prefixTitle="Welcome to"
      backgroundImage="url('/images/dealer.png');"
    >
      <Content>
        <Text>MARKET PAGE !!!!!!!!!!!!!!!!!!!</Text>
        <Inventory pb="20px" />
        
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
