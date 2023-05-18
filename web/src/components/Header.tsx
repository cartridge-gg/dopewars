import { controllerConnector, argentConnector } from "@/pages/_app";
import { Clock, Gem, Bag, Chat, Home, Link } from "./icons";
import { useAccount, useConnectors } from "@starknet-react/core";
import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IsMobile } from "@/utils/ui";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();
  const [connected, setConnected] = useState(false);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      p={["0 24px 24px 24px", "24px"]}
      w="full"
      justify="flex-end"
      zIndex="1"
    >
      {connected ? (
        <>
          <HStack flex="1" justify="left">
            <Box
              layerStyle="rounded"
              cursor="pointer"
              onClick={() => router.push("/")}
            >
              <Home />
            </Box>
          </HStack>
          <HStack flex="1" justify="center">
            <HStack
              layerStyle="rounded"
              h="full"
              py="8px"
              px="20px"
              spacing={["10px", "30px"]}
            >
              <HStack>
                <Gem /> <Text>$2000</Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Bag /> <Text>20</Text>
              </HStack>
              <Divider orientation="vertical" borderColor="neon.600" h="12px" />
              <HStack>
                <Clock />{" "}
                <Text whiteSpace="nowrap">{!IsMobile && "Day"} 3/30</Text>
              </HStack>
            </HStack>
          </HStack>
          <HStack flex="1" justify="right">
            <Box layerStyle="rounded">
              <Chat alert={true} />
            </Box>
          </HStack>
        </>
      ) : (
        <HStack
          p="8px"
          layerStyle="rounded"
          cursor="pointer"
          onClick={() => setConnected(true)}
        >
          <Link /> <Text>CONNECT</Text>
        </HStack>
      )}
    </Flex>
  );
};

export default Header;
