// import { Button } from "@chakra-ui/react";
// import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
// import { useStarknetkitConnectModal } from "starknetkit";

// const Connect = () => {
//   const { connect, connectors } = useConnect();
//   const { disconnect} = useDisconnect()
//   const { address } = useAccount()

//   const connectWallet = async () => {
//     const { starknetkitConnectModal } = useStarknetkitConnectModal({
//       connectors: connectors,
//     });

//     const { connector } = await starknetkitConnectModal();
//     await connect({ connector });
//   };

//   const onClick = () => {
//       if (address) {
//         disconnect()
//       } else {
//         connectWallet()
//       }
//   }

//   return <Button onClick={onClick}>{address ? address : "Connect"}</Button>;
// };

// export default Connect;

import { ExternalLink } from "@/components/icons";
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
import { Connector, useAccount, useBalance, useConnect, useDisconnect, useExplorer } from "@starknet-react/core";
import { useState } from "react";
import { AccountInterface } from "starknet";
import { walletInstallLinks } from "./StarknetProviders";

export const frenlyAddress = (address: string) => {
  return address.substring(0, 4) + "..." + address.substring(address.length - 4, address.length);
};

export const Connect = ({ ...props }) => {

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account, address, status } = useAccount();

  const { data: ethBalance } = useBalance({ address, });

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
              <Text>{frenlyAddress(account.address || "")}</Text>
              <HStack gap={1}>
                <Text fontFamily="monospace">Ξ</Text>
                <Text>{Number(ethBalance?.formatted).toFixed(3)}</Text>
              </HStack>
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

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
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
  connectors: Array<Connector>;
  connect: Function;
  isOpen: boolean;
  onClose: VoidFunction;
}) => {
  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark">
        <ModalHeader fontSize="16px" textAlign="center" pb={0}>
          Connect a Wallet
        </ModalHeader>
        <ModalBody p={3}>
          <VStack w="full">
            {connectors.map((connector) => (
              <Button
                variant="pixelated"
                w="full"
                fontSize="14px"
                key={connector.id}
                onClick={() => {
                  if (connector.available()) {
                    connect({ connector });
                  } else {
                    window.open(walletInstallLinks[connector.id], "_blank");
                  }
                  onClose();
                }}
              >
                <HStack w="full" justifyItems="flex-start">
                  <Image src={connector.icon.dark} width="24px" height="24px" />
                  <Text ml="120px">{connector.available() ? connector.name : `Install ${connector.name}`}</Text>
                  {!connector.available() && <ExternalLink ml="auto" />}
                </HStack>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
