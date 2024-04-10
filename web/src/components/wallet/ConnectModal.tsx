import { ExternalLink } from "@/components/icons";
import { useDojoContext } from "@/dojo/hooks";
import {
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

export const ConnectModal = observer(() => {
  const { connect, connectors } = useConnect();

  const {
    chains: { selectedChain },
    burnerManager,
    uiStore,
  } = useDojoContext();

  const isKatana = useMemo(() => {
    return selectedChain.chainConfig.network === "katana";
  }, [selectedChain]);

  const onClose = () => {
    uiStore.closeConnectModal();
  };

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

              if (!isKatana && (isBurner || isPredeployed)) {
                // burner or predeployed not on katana
                return null;
              }

              if (isKatana && !(isBurner || isPredeployed)) {
                // not burner or predeployed on katana
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
                      <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />
                      <Text>{connector.available() ? `${connector.name}` : `Install ${connector.name}`}</Text>
                      {!connector.available() && <ExternalLink ml="auto" />}
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