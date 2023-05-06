import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import { Event } from "@/components/icons";
import { Ludes, Weed } from "@/components/icons/drugs";
import { Manhattan } from "@/components/icons/locations";
import Layout from "@/components/Layout";
import {
  Button,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function Turn() {
  const router = useRouter();
  return (
    <Layout
      title="Day 2"
      prefixTitle="End of"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/end.png');"
    >
      <Content gap="30px">
        <VStack w="full">
          <Product product="Proudct" quantity="Qty" cost="cost" isHeader />
          <UnorderedList w="full" variant="underline">
            <ListItem>
              <Product
                icon={<Weed boxSize="24px" />}
                product="Weed"
                quantity="-100"
                cost="$25"
              />
            </ListItem>
            <ListItem>
              <Product
                icon={<Ludes boxSize="24px" />}
                product="Ludes"
                quantity="-100"
                cost="$25"
              />
            </ListItem>
          </UnorderedList>
        </VStack>
        <VStack w="full">
          <HStack w="full">
            <Text fontFamily="broken-console" fontSize="10px" color="neon.600">
              Travel To
            </Text>
          </HStack>
          <UnorderedList w="full" variant="underline">
            <ListItem>
              <HStack>
                <Manhattan />
                <Text>Manhattan</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <HStack flex="1">
                  <Event />
                  <Text>Mugged</Text>
                </HStack>
                <Text flex="1" color="yellow.400">
                  Lost 50% of supply
                </Text>
              </HStack>
            </ListItem>
          </UnorderedList>
        </VStack>
      </Content>
      <Footer>
        <Button
          w={["full", "auto"]}
          onClick={() => router.push("/0x123/travel")}
        >
          Continue
        </Button>
      </Footer>
    </Layout>
  );
}

const Product = ({
  icon,
  product,
  quantity,
  cost,
  isHeader,
}: {
  icon?: ReactNode;
  product: string;
  quantity: string;
  cost: string;
  isHeader?: boolean;
}) => {
  const header = isHeader && {
    fontFamily: "broken-console",
    fontSize: "10px",
    color: "neon.600",
  };

  return (
    <HStack w="full" {...header}>
      <HStack flex="2">
        {icon}
        <Text>{product}</Text>
      </HStack>
      <Text flex="1">{quantity}</Text>
      <Text flex="1">{cost}</Text>
    </HStack>
  );
};
