import { ExternalLink } from "@/components/icons";
import { useConfigStore, useDojoContext } from "@/dojo/hooks";
import { frenlyAddress } from "@/utils/ui";
import {
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack
} from "@chakra-ui/react";
import { useAccount, useDisconnect, useExplorer } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { TokenBalance } from "./TokenBalance";


export const AccountDetailsModal =  observer(() => {
  const explorer = useExplorer();
  const { config } = useConfigStore();

  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();

  const onClose = () => {
    uiStore.closeAccountDetails();
  };

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

            <HStack color="yellow.400">
              <TokenBalance address={account?.address} token={config?.ryoAddress.paper} />
              <Text>PAPER</Text>
            </HStack>

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
