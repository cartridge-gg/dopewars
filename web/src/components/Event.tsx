import { Box, Divider, Flex, Spacer, Text, VStack } from "@chakra-ui/layout";
import { useState } from "react";
import Pill from "./Pill";
import ProductsTable, { Product } from "./Products";

interface EventProps {
  event: {
    title: string;
    description: string;
    location: string;
    product: Product;
    change: number;
  };
}

const Event = ({ event }: EventProps) => {
  const [owned, setOwned] = useState(0);
  const { title, description, location, product, change } = event;

  return (
    <Flex flexDir="column" w="full" gap="12px">
      <Flex
        p="24px 12px"
        flexDir="column"
        gap="12px"
        align="center"
        border="1px solid black"
      >
        <Text
          textTransform="uppercase"
          color="#D800D8"
          fontSize="18px"
          fontWeight="bold"
        >
          ✨ Random event ✨
        </Text>
        <VStack>
          <Text fontSize="14px">{title}</Text>
          <Text color="#878E8E" fontSize="12px">
            {description}
          </Text>
        </VStack>
      </Flex>
      <Flex bg="#141011" border="1px solid black" borderRadius={4} p="8px" gap="4px">
        {product.name}
        <Pill fontSize="12px">${product.cost}</Pill>
        <Spacer />
        <Flex gap="2px">
          <Text opacity={0.5}>{owned}</Text>
          <Text color="#22B617">+{product.quantity}</Text>
        </Flex>
      </Flex>
      <Flex overflow="hidden" flexDir="column" bg="#141011" border="1px solid black" borderRadius={4} p="8px" gap="8px">
        <Text opacity={0.5} fontSize="12px">Traveled To</Text>
        <Divider border="1px solid black" transform="scaleX(1.2)" />
        <Text fontSize="12px">{location}</Text>
      </Flex>
    </Flex>
  );
};

export default Event;
