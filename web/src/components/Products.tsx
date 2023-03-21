import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { useState } from "react";
import Pill from "./Pill";

interface Product {
    id: number;
    name: string;
    cost: number;
    quantity: number;
}

interface ProductsTableProps {
    products: Product[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
    return (
        <Accordion borderRadius={4} border="2px solid black">
            {/* <Flex px="14px">
                <Text color="#747A7C" fontSize="14px" p="10px 12px" gap="8px">
                    Product
                </Text>
                <Spacer />
                <Spacer />
                <Text color="#747A7C" fontSize="14px" p="10px 12px" gap="8px">
                    Cost
                </Text>
                <Spacer />
                <Text color="#747A7C" fontSize="14px" p="10px 12px" gap="8px">
                    Quantity
                </Text>
            </Flex> */}
            {products.map((product) => (
                <AccordionItem bg="#141011" key={product.id}>
                    <AccordionButton px="4px" py="0px" _expanded={{
                        bg: "#434345",
                    }}>
                        <Flex fontSize="14px" w="full" p="10px 12px" gap="8px" >
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
                            <Button w="full" variant="secondary" onClick={() => console.log("Buy clicked")}>
                                Buy
                            </Button>
                            <Button w="full" variant="secondary" onClick={() => console.log("Sell clicked")}>
                                Sell
                            </Button>
                        </Flex>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default ProductsTable;
