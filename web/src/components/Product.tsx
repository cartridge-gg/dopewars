import { Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";
import Cart from "./icons/Cart";
import Pill from "./Pill";
import { Product } from "./Products";

interface ProductProps {
  product: Product;
  isBuying: boolean;
}

const Product = ({ product, isBuying }: ProductProps) => {
  const [owned, setOwned] = useState(0); // TODO: Get from contract
  const [quantity, setQuantity] = useState(1);

  return (
    <Flex flexDir="column" gap="12px">
      <Flex
        overflow="hidden"
        gap="8px"
        flexDir="column"
        p="8px"
        borderRadius={4}
        border="2px solid black"
        bg="#141011"
      >
        <Text textTransform="uppercase">
          <Cart /> {isBuying ? "Buy" : "Sell"}
        </Text>
        <Divider border="1px solid black" transform="scaleX(1.2)" />
        {product.icon && (
          <>
            {product.icon}
            <Divider border="1px solid black" transform="scaleX(1.2)" />
          </>
        )}
        <Flex gap="4px">
          {product.name}
          <Pill fontSize="12px">${product.cost}</Pill>
          <Spacer />
          <Flex gap="2px">
            <Text opacity={0.5}>{owned}</Text>
            <Text color="#22B617">+{quantity}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Text textAlign="center" fontSize="16px" textTransform="uppercase">
        Buy ({quantity}) for ${product.cost * quantity}
      </Text>
      <Flex gap="12px">
        <Button
          px="20px"
          onClick={() => setQuantity((v) => v - 1)}
          variant="secondary"
          isDisabled={quantity <= 1}
        >
          -
        </Button>
        <Slider
          max={product.quantity}
          value={quantity}
          onChange={(v) => setQuantity(v)}
        >
          <SliderTrack
            borderRadius="4px"
            border="2px solid black"
            h="22px"
            bg="#141011"
          >
            <SliderFilledTrack bg="linear-gradient(to right, #22B617 80%, #64e35b)" />
          </SliderTrack>
        </Slider>
        <Button
          px="20px"
          onClick={() => setQuantity((v) => v + 1)}
          variant="secondary"
          isDisabled={quantity >= product.quantity}
        >
          +
        </Button>
      </Flex>
    </Flex>
  );
};

export default Product;
