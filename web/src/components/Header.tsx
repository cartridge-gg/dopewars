import { controllerConnector, argentConnector } from "@/pages/_app";
import { formatAddress } from "@/utils";
import { Clock, Gem, Bag, Chat, Home, Link } from "./icons";
import { useAccount, useConnectors } from "@starknet-react/core";
import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";

const Header = () => {
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      p="24px"
      w="full"
      justify="flex-end"
    >
      <HStack layerStyle="rounded">
        <Link /> <Text>Connect</Text>
      </HStack>
      {/* <HStack flex="1" justify="left">
        <Box layerStyle="rounded">
          <Home />
        </Box>
      </HStack>
      <HStack flex="1" justify="center">
        <HStack layerStyle="rounded" h="full" py="8px" px="20px" spacing="30px">
          <HStack>
            <Gem /> <Text>$2000</Text>
          </HStack>
          <Divider orientation="vertical" borderColor="neon.700" h="12px" />
          <HStack>
            <Bag /> <Text>20</Text>
          </HStack>
          <Divider orientation="vertical" borderColor="neon.700" h="12px" />
          <HStack>
            <Clock /> <Text>Day 3/30</Text>
          </HStack>
        </HStack>
      </HStack>
      <HStack flex="1" justify="right">
        <Box layerStyle="rounded">
          <Chat alert={true} />
        </Box>
      </HStack> */}
    </Flex>
  );
};

export default Header;
