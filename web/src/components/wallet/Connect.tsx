import { Cigarette, ExternalLink } from "@/components/icons";
import { useDojoContext } from "@/dojo/hooks";
import { useTokenBalance } from "@/dojo/hooks/useTokenBalance";
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
import { BurnerConnector } from "@dojoengine/create-burner";
import { Connector, useAccount, /*useBalance,*/ useConnect, useDisconnect, useExplorer } from "@starknet-react/core";
import { ReactNode, useMemo, useState } from "react";
import { AccountInterface } from "starknet";
import { walletInstallLinks, walletInstallLinksKeys } from "./StarknetProviders";

export const frenlyAddress = (address: string) => {
  return address.substring(0, 4) + "..." + address.substring(address.length - 4, address.length);
};

export const Connect = ({ ...props }) => {
  const { account, address, status } = useAccount();

  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();

  const { balance } = useTokenBalance({
    address,
    token: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

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
  const [isCopying, setIsCopying] = useState(false);

  const onCopy = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(account?.address);
    setTimeout(() => {
      setIsCopying(false);
    }, 1500);
  };
  console.log(account)
  
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
              isExternal
              href={explorer.contract(account?.address)}
            >
              {frenlyAddress(account?.address || "")}
            </Link>

            <HStack w="full" justifyContent="center">
              <Button
                variant="transparent"
                w="full"
                h="auto"
                border={0}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                onClick={onCopy}
              >
                {/* {isCopying ? (
                  <CopiedAddressIcon width="16px" height="16px" />
                ) : (
                  <CopyAddressIcon width="20px" height="20px" />
                )} */}
                <Text textAlign="center" textTransform="none" mt={1} fontSize="12px">
                  {isCopying ? "Copied!" : "Copy Address"}
                </Text>
              </Button>
              <Button
                variant="transparent"
                w="full"
                h="auto"
                border={0}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                onClick={() => {
                  disconnect();
                  onClose();
                }}
              >
                <Text textAlign="center" textTransform="none" mt={1} fontSize="12px">
                  Disconnect
                </Text>
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
    burner: { create: createBurner, clear: clearBurner, isDeploying: isBurnerDeploying, account },
    network: { isKatana, selectedChain },
  } = useDojoContext();

  const hasBurnerConnector = useMemo(() => {
    return connectors.find((i) => i instanceof BurnerConnector);
  }, [connectors, connectors.length, selectedChain, isKatana]);

  const onCreateBurner = async () => {
    await createBurner();
  };

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark">
        <ModalHeader fontSize="16px" textAlign="center" pb={0}>
          Connect a Wallet
        </ModalHeader>
        <ModalBody p={3}>
          <VStack w="full">
            {isKatana && !hasBurnerConnector && (
              <Button
                variant="pixelated"
                w="full"
                fontSize="14px"
                isLoading={isBurnerDeploying}
                onClick={onCreateBurner}
              >
                <HStack w="full" justifyItems="flex-start">
                  {/* <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} /> */}
                  <Text ml="120px">Create Burner</Text>
                </HStack>
              </Button>
            )}
            {connectors.map((connector) => {
              const isBurner = connector instanceof BurnerConnector;
             // const isDeployedOnCurrentChain = selectedChain.id === connector.chainId()
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
                        {connector.available()
                          ? `${connector.name} ${isBurner ? frenlyAddress(connector.id) : ""}`
                          : `Install ${connector.name}`}
                      </Text>
                      {!connector.available() && <ExternalLink ml="auto" />}
                    </HStack>
                  </Button>
                  {isBurner && (
                    <Cigarette
                      cursor="pointer"
                      onClick={() => {
                        clearBurner();
                      }}
                    />
                  )}
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
