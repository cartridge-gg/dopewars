import { controllerConnector, argentConnector } from "@/pages/_app";
import { formatAddress } from "@/utils";
import { Clock, Gem, Bag, Chat, Home, Link } from "./icons";
import { useAccount, useConnectors } from "@starknet-react/core";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { breakpoint } from "@/utils/ui";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();
  const [connected, setConnected] = useState(false);
  const isMobile = useBreakpointValue([true, true, true, false]);

  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      p={breakpoint("0 24px 24px 24px", "24px")}
      w="full"
      justify="flex-end"
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
              spacing={breakpoint("10px", "30px")}
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
                <Clock />{" "}
                <Text whiteSpace="nowrap">{!isMobile && "Day"} 3/30</Text>
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
