import { useControllerUsername, useDojoContext } from "@/dojo/hooks";
import { frenlyAddress } from "@/utils/ui";
import { Box, Button, HStack, Image, MenuItem, Text } from "@chakra-ui/react";
import { useAccount, /*useBalance,*/ useConnect, useDisconnect } from "@starknet-react/core";
import { KatanaIcon } from "../icons";
import { useEffect, useState } from "react";
import { Cartridge } from "../icons/branding/Cartridge";

export const ConnectButton = ({ ...props }) => {
  const { account, address, status } = useAccount();
  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { uiStore } = useDojoContext();

  const { username, isController } = useControllerUsername();

  const isBurnerOrPredeplyed = connector?.id.includes("dojo");

  const onClick = () => {
    if (connectors.length > 1) {
      uiStore.openConnectModal();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" {...props}>
        {!account && (
          <Button variant="pixelated" h="48px" fontSize="14px" onClick={onClick} w="full">
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
              {connector && isBurnerOrPredeplyed && <KatanaIcon />}
              {connector && !isBurnerOrPredeplyed && !isController && (
                <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />
              )}
              {connector && isController && <Cartridge />}
              <Text>{isController ? username : frenlyAddress(account.address || "")}</Text>
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

  return (
    <>
      {!account && (
        <MenuItem h="48px" borderRadius={0} onClick={() => uiStore.openConnectModal()} justifyContent="center">
          CONNECT
        </MenuItem>
      )}
      {account && (
        <MenuItem h="48px" borderRadius={0} onClick={() => uiStore.openAccountDetails()}>
          <HStack w="full" /*justifyContent="center"*/>
            {connector && <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />}
            <Text>{frenlyAddress(account.address || "")}</Text>
          </HStack>
        </MenuItem>
      )}
    </>
  );
};
