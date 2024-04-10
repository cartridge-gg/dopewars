import { useDojoContext, useTokenBalance } from "@/dojo/hooks";
import { formatEther, frenlyAddress } from "@/utils/ui";
import { Box, Button, HStack, Image, MenuItem, Text } from "@chakra-ui/react";
import { useAccount, /*useBalance,*/ useConnect, useDisconnect } from "@starknet-react/core";

export const ConnectButton = ({ ...props }) => {
  const { account, address, status } = useAccount();
  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { uiStore } = useDojoContext();

  const { balance } = useTokenBalance({
    address,
    token: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" {...props}>
        {!account && (
          <Button variant="pixelated" h="48px" fontSize="14px" onClick={() => uiStore.openConnectModal()} w="full">
            Connect
          </Button>
        )}
        {account && (
          <Button
            variant="pixelated"
            h="48px"
            fontSize="14px"
            onClick={() => uiStore.openAccountDetails()}
            w="full"
            alignItems="center"
            justifyContent="center"
          >
            <HStack>
              {connector && <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />}
              <Text>{frenlyAddress(account.address || "")}</Text>
              <HStack gap={1}>
                <Text fontFamily="monospace">Ξ</Text>
                <Text>{formatEther(balance)}</Text>
              </HStack>
            </HStack>
          </Button>
        )}
      </Box>
    </>
  );
};

export const ConnectButtonMobile = ({ ...props }) => {
  const { account, address, status } = useAccount();
  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { uiStore } = useDojoContext();

  const { balance } = useTokenBalance({
    address,
    token: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

  return (
    <>
      {!account && (
        <MenuItem h="48px" borderRadius={0} onClick={() => uiStore.openConnectModal()} justifyContent="center">
          CONNECT
        </MenuItem>
      )}
      {account && (
        <MenuItem h="48px" borderRadius={0} onClick={() => uiStore.openAccountDetails()}>
          <HStack w="full" justifyContent="center">
            {connector && <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />}
            <Text>{frenlyAddress(account.address || "")}</Text>
            <HStack gap={1}>
                <Text fontFamily="monospace">Ξ</Text>
                <Text>{formatEther(balance)}</Text>
              </HStack>
          </HStack>
        </MenuItem>
      )}
    </>
  );
};
