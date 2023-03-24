import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/layout";
import { Product } from "./Products";

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
  const { title, description, location, product, change } = event;

  return (
    <Flex p="24px 12px" flexDir="column" gap="12px" align="center" border="1px solid black">
        <Text textTransform="uppercase" color="#D800D8" fontSize="18px" fontWeight="bold">
            ✨ Random event ✨
        </Text>
        <VStack>
            <Text fontSize="14px">
                {title}
            </Text>
            <Text color="#878E8E" fontSize="12px">
                {description}
            </Text>
        </VStack>
    </Flex>
  );
};

export default Event;
