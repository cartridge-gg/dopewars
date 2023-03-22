import { controllerConnector, argentConnector } from "@/pages/_app";
import { formatAddress } from "@/utils";
import { Button } from "@chakra-ui/button";
import { Flex, Spacer, VStack } from "@chakra-ui/layout";
import { useAccount, useConnectors } from "@starknet-react/core";
import { connect } from "http2";
import { disconnect } from "process";
import Argent from "./icons/Argent";
import Cartridge from "./icons/Cartridge";
import Cigarette from "./icons/Cigarette";
import Connect from "./icons/Connect";
import Disconnect from "./icons/Disconnect";
import { useModal } from "./Modal/ModalProvider";
import {Text} from "@chakra-ui/react"

const Header = () => {
    const { address } = useAccount();
    const { connectors, connect, disconnect } = useConnectors();
    const { openModal, closeModal } = useModal();
    
    return (
        <Flex position="absolute" top="0" left="0" p="12px" w="full">
          <Flex align="center" gap="4px" fontSize="18px" color="white">
            <Cigarette />
            <Text>
              RYO
            </Text>
          </Flex>
          <Spacer />
          {address ? (
          <Flex gap="8px">
            <Button variant="secondary">
              {formatAddress(address)}
            </Button>
            <Button variant="secondary" onClick={disconnect}>
              <Disconnect />
            </Button>
          </Flex>
        ) : (
          <Button
            onClick={() =>
              openModal(
                "Connect your starknet controller",
                <VStack w="full">
                  <Button
                    w="full"
                    onClick={() => {
                      connect(controllerConnector as any);
                      closeModal();
                    }}
                  >
                    <Cartridge /> Connect Cartridge
                  </Button>
                  <Button
                    variant="secondary"
                    w="full"
                    onClick={() => {
                      connect(argentConnector as any);
                      closeModal();
                    }}
                  >
                    <Argent /> Connect Argent
                  </Button>
                </VStack>
              )
            }
          >
            <Connect /> Connect
          </Button>
        )}
        </Flex>
    )
}

export default Header;