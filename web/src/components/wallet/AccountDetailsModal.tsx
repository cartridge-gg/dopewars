import { ExternalLink, PaperIcon } from "@/components/icons";
import { useConfigStore, useControllerUsername, useDojoContext, useTokenBalance } from "@/dojo/hooks";
import { formatEther, frenlyAddress } from "@/utils/ui";
import { Button, HStack, Link, Modal, ModalBody, ModalContent, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import { useAccount, useDisconnect, useExplorer } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { TokenBalance } from "./TokenBalance";
import { Cartridge } from "../icons/branding/Cartridge";

export const AccountDetailsModal = observer(() => {
  const explorer = useExplorer();
  const { config } = useConfigStore();

  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();
  const { username, isController } = useControllerUsername();

  const onClose = () => {
    uiStore.closeAccountDetails();
  };

  const { balance } = useTokenBalance({
    address: account?.address,
    token: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

  return (
    <Modal
      motionPreset="slideInBottom"
      isCentered
      isOpen={uiStore.modals.accountDetails !== undefined}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            {/* <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} /> */}

            <VStack w="full" gap={1}>
              {isController && <Text>{username}</Text>}

              <Link
                fontSize="18px"
                textDecoration="none"
                textTransform="uppercase"
                isExternal
                href={explorer.contract(account?.address || "")}
              >
                <>
                  {frenlyAddress(account?.address || "")}
                  <ExternalLink />
                </>
              </Link>
            </VStack>

            <VStack w="full" gap={1}>
              <HStack color="yellow.400">
                <PaperIcon />
                <TokenBalance address={account?.address} token={config?.ryoAddress.paper} />
              </HStack>

              <HStack gap={1}>
                <Text fontFamily="monospace">Ξ</Text>
                <Text>{formatEther(balance)}</Text>
              </HStack>
            </VStack>

            <HStack w="full" justifyContent="center">
              <Button
                // variant="pixelated"
                w="full"
                // h="auto"
                // border={0}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                onClick={onClose}
              >
                CLOSE
              </Button>
              <Button
                //variant="pixelated"
                w="full"
                // h="auto"
                //border={0}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                onClick={() => {
                  disconnect();
                  onClose();
                }}
              >
                DISCONNECT
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
