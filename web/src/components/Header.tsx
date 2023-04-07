import { controllerConnector, argentConnector } from "@/pages/_app";
import { formatAddress } from "@/utils";
import { Button } from "@chakra-ui/button";
import { Flex, Spacer, VStack } from "@chakra-ui/layout";
import { useAccount, useConnectors } from "@starknet-react/core";
import {
  Argent,
  Cartridge,
  Cigarette,
  Connect,
  Disconnect,
} from "@/components/icons";

import { useModal } from "./Modal/ModalProvider";
import { Text } from "@chakra-ui/react";

const Header = () => {
  const { address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();
  const { openModal, closeModal } = useModal();

  return (
    <Flex position="absolute" top="0" left="0" p="12px" w="full">
      <Spacer />
      {address ? (
        <Flex gap="8px">
          <Button variant="secondary">{formatAddress(address)}</Button>
          <Button
            variant="secondary"
            onClick={() =>
              openModal(
                "Disconnect",
                <VStack w="full">
                  <Button
                    w="full"
                    onClick={() => {
                      disconnect();
                      closeModal();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="secondary"
                    w="full"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                </VStack>
              )
            }
          >
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
  );
};

export default Header;
