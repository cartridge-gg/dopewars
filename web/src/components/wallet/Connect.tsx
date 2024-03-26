import { ExternalLink } from "@/components/icons";
import { useConfigStore, useDojoContext } from "@/dojo/hooks";
import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Connector, useAccount, /*useBalance,*/ useConnect, useDisconnect, useExplorer } from "@starknet-react/core";
import { ReactNode, useMemo, useState } from "react";
import { AccountInterface } from "starknet";
import { walletInstallLinks, walletInstallLinksKeys } from "./StarknetProvider";
import { TokenBalance } from "./TokenBalance";

export const frenlyAddress = (address: string) => {
  return address.substring(0, 4) + "..." + address.substring(address.length - 4, address.length);
};

export const Connect = ({ ...props }) => {
  const { account, address, status } = useAccount();
  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();

  // const { balance } = useTokenBalance({
  //   address,
  //   token: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  // });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" {...props}>
        {!account && (
          <Button variant="pixelated" h="48px" fontSize="14px" onClick={() => setIsConnectModalOpen(true)} w="full">
            Connect
          </Button>
        )}
        {account && (
          <Button
            variant="pixelated"
            h="48px"
            fontSize="14px"
            onClick={() => setIsAccountModalOpen(true)}
            w="full"
            alignItems="center"
            justifyContent="center"
          >
            <HStack>
              {connector && <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />}
              <Text>{frenlyAddress(account.address || "")}</Text>
              {/* <HStack gap={1}>
                <Text fontFamily="monospace">Ξ</Text>
                <Text>{formatEther(balance)}</Text>
              </HStack> */}
            </HStack>
          </Button>
        )}
      </Box>

      <ConnectModal
        connectors={connectors}
        connect={connect}
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      {account && (
        <AccountModal
          account={account}
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          disconnect={disconnect}
        />
      )}
    </>
  );
};

const AccountModal = ({
  account,
  isOpen,
  onClose,
  disconnect,
}: {
  account: AccountInterface;
  isOpen: boolean;
  onClose: VoidFunction;
  disconnect: VoidFunction;
}) => {
  const explorer = useExplorer();
  const { config } = useConfigStore();

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            {/* <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} /> */}

            <Link
              fontSize="18px"
              fontWeight="bold"
              fontFamily="monospace"
              textDecoration="none"
              textTransform="uppercase"
              isExternal
              href={explorer.contract(account?.address)}
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
};

const ConnectModal = ({
  connectors,
  connect,
  isOpen,
  onClose,
}: {
  connectors: Connector[];
  connect: Function;
  isOpen: boolean;
  onClose: VoidFunction;
}) => {
  const {
    chains: { selectedChain },
    burnerManager,
  } = useDojoContext();

  const isKatana = useMemo(() => {
    return selectedChain.chainConfig.network === "katana";
  }, [selectedChain]);

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
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

              if (isKatana && !(isBurner || isPredeployed )) {
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
                    <HStack w="full" justifyItems="flex-start">
                      <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />
                      <Text ml="120px">
                        {connector.available() ? `${connector.name}` : `Install ${connector.name}`}
                      </Text>
                      {!connector.available() && <ExternalLink ml="auto" />}
                    </HStack>
                  </Button>
                  {/* {isBurner && (
                    <Cigarette
                      cursor="pointer"
                      onClick={() => {
                        burnerManager.clear()
                      }}
                    />
                  )} */}
                </HStack>
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const ChildrenOrConnect = ({ children }: { children: ReactNode }) => {
  const { account } = useAccount();
  return <>{account ? children : <Connect />}</>;
};
