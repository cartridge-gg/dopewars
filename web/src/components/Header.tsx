import { controllerConnector, argentConnector } from "@/pages/_app";
import { formatAddress } from "@/utils";
import { Clock, Gem, Bag, Chat } from "./icons";

import { useAccount, useConnectors } from "@starknet-react/core";

import { Divider, Flex, HStack, Text } from "@chakra-ui/react";

const Header = () => {
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  return (
    <Flex position="absolute" top="0" left="0" p="12px" w="full">
      <HStack flex="1" justify="left"></HStack>
      <HStack flex="1" justify="center">
        <HStack
          h="full"
          py="8px"
          px="20px"
          spacing="30px"
          bgColor="neon.800"
          borderRadius="6px"
        >
          <HStack>
            <Gem /> <Text>$2000</Text>
          </HStack>
          <Divider orientation="vertical" borderColor="neon.700" h="12px" />
          <HStack>
            <Bag /> <Text>20</Text>
          </HStack>
          <Divider orientation="vertical" borderColor="neon.700" h="12px" />
          <HStack>
            <Clock /> <Text>Day 3</Text>
          </HStack>
        </HStack>
      </HStack>
      <HStack flex="1" justify="right">
        <Chat size="lg" alert={true} />
      </HStack>
    </Flex>
  );
};

export default Header;
