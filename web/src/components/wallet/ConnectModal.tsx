import { ExternalLink, KatanaIcon } from "@/components/icons";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { /*useBalance,*/ useConnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { walletInstallLinks, walletInstallLinksKeys } from "./StarknetProvider";
import { Cartridge } from "../icons/branding/Cartridge";
import { useRouter } from "next/router";

export const ConnectModal = observer(() => {
  const { connect, connectors } = useConnect();
  const { isAdmin } = useRouterContext();
  const router = useRouter();

  const {
    chains: { selectedChain },
    burnerManager,
    uiStore,
  } = useDojoContext();

  const isKatana = useMemo(() => {
    return selectedChain.name === "KATANA";
  }, [selectedChain]);

  const isSlot = useMemo(() => {
    return selectedChain.name.startsWith("WP_");
  }, [selectedChain]);

  const onClose = () => {
    uiStore.closeConnectModal();
  };

  // if (uiStore.modals.connect !== undefined && connectors.length === 1 && connectors[0].available()) {
  //   connect({ connector: connectors[0] });
  //   return null
  // }

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={uiStore.modals.connect !== undefined} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark">
        <ModalHeader fontSize="16px" textAlign="center" pb={0}>
          Connect a Wallet
        </ModalHeader>
        <ModalBody p={3}>
          <VStack w="full">
            {connectors.map((connector) => {
              const isBurner = connector.id === "dojoburner";
              const isPredeployed = connector.id === "dojopredeployed";
              // const isController = connector.id === "cartridge";
              const isController = connector.id === "controller";
              const isArgent = connector.id === "argentX";

              if (!router.asPath.startsWith("/admin") && isArgent) {
                return null;
              }
              // console.log(connector)
              if (!(isKatana || isSlot) && (isBurner || isPredeployed)) {
                // burner or predeployed not on katana
                return null;
              }

              // if (isKatana && !(isBurner || isPredeployed || isController)) {
              //   // not burner or predeployed on katana
              //   return null;
              // }

              if (!isAdmin && isPredeployed) {
                return null;
              }

              return (
                <HStack w="full" key={connector.id}>
                  <Button
                    variant="pixelated"
                    w="full"
                    fontSize="14px"
                    onClick={() => {
                      if (connector.available()) {
                        connect({ connector });
                      } else {
                        window.open(walletInstallLinks[connector.id as walletInstallLinksKeys], "_blank");
                      }
                      onClose();
                    }}
                  >
                    <HStack w="full" alignItems="center" justifyContent="center" gap={3}>
                      <HStack>
                        {isBurner || isPredeployed ? (
                          <KatanaIcon />
                        ) : isController ? (
                          <Cartridge />
                        ) : (
                          /// @ts-ignore
                          <Image src={connector.icon} width="24px" height="24px" alt={connector.name} />
                        )}

                        <Text>{connector.available() ? `${connector.name}` : `Install ${connector.name}`}</Text>
                        {!connector.available() && <ExternalLink ml="auto" />}
                      </HStack>
                    </HStack>
                  </Button>
                </HStack>
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
