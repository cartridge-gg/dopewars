import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import Cart from "./icons/Cart";
import Pill from "./Pill";

export interface Product {
  id: number;
  icon?: ReactNode;
  name: string;
  cost: number;
  quantity: number;
}

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <Flex
      bg="#141011"
      borderRadius={4}
      border="2px solid black"
      flexDir="column"
    >
      <Text p="4px 12px" fontSize="14px">
        <Cart /> Products
      </Text>
      <Accordion border="transparent">
        {products.map((product) => (
          <AccordionItem bg="#141011" key={product.id}>
            <AccordionButton
              p="10px 12px"
              _expanded={{
                bg: "#434345",
              }}
            >
              <Flex fontSize="14px" w="full" gap="8px">
                <Text>{product.name}</Text>
                <Spacer />
                <Spacer />
                <Pill bg="#141011">
                  <Text>{product.cost}</Text>
                </Pill>
                <Spacer />
                <Text>{product.quantity}</Text>
              </Flex>
            </AccordionButton>
            <AccordionPanel bg="#434345">
              <Flex gap="8px">
                <Button
                  w="full"
                  variant="secondary"
                  onClick={() => console.log("Buy clicked")}
                >
                  Buy
                </Button>
                <Button
                  w="full"
                  variant="secondary"
                  onClick={() => console.log("Sell clicked")}
                >
                  Sell
                </Button>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};

export default ProductsTable;
