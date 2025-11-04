import { useControllerUsername, useDojoContext } from "@/dojo/hooks";
import { frenlyAddress } from "@/utils/ui";
import { Box, Button, HStack, Image, MenuItem, Text } from "@chakra-ui/react";
import { useAccount, /*useBalance,*/ useConnect, useDisconnect } from "@starknet-react/core";
import { ExternalLink, KatanaIcon, Trophy, WalletModal } from "../icons";
import { useEffect, useState } from "react";
import { Cartridge } from "../icons/branding/Cartridge";
import { ControllerConnector } from "@cartridge/connector";

export const ConnectButton = ({ variant = "pixelated", ...props }) => {
  const { account, address, status } = useAccount();
  const { connect, connectors, connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { uiStore } = useDojoContext();
  const { username, isController } = useControllerUsername(address as string);

  const isBurnerOrPredeplyed = connector?.id.includes("dojo");

  const onClick = () => {
    if (connectors.length > 1) {
      uiStore.openConnectModal();
    } else {
      console.log( connectors[0] )
      connect({ connector: connectors[0] });
      // connectAsync({ connector: connectors[0] });
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" {...props}>
        {!account && (
          <Button variant={variant} h={["40px","48px"]} fontSize="14px" onClick={onClick} w="full">
            Connect
          </Button>
        )}
        {account && (
          <Button variant={variant} h={["40px","48px"]} fontSize="14px" w="full" alignItems="center" justifyContent="center">
            <HStack
              onClick={() => {
                if (isController) {
                  (connector as unknown as ControllerConnector).controller.openProfile("achievements"); // "trophies"
                } else {
                  uiStore.openAccountDetails();
                }
              }}
            >
              {connector && isBurnerOrPredeplyed && <KatanaIcon />}
              {connector && !isBurnerOrPredeplyed && !isController && (
                /// @ts-ignore
                <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />
              )}
              {connector && isController && <Cartridge />}
              <Text>{isController ? username : frenlyAddress(account.address || "")}</Text>
            </HStack>
            {isController && (
              <WalletModal
                mb={1}
                _hover={{ backgroundColor: "neon.500" }}
                borderRadius={3}
                onClick={() => {
                  uiStore.openAccountDetails();
                }}
              />
            )}
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
        <MenuItem h={["40px","48px"]} borderRadius={0} onClick={() => uiStore.openConnectModal()} justifyContent="center">
          CONNECT
        </MenuItem>
      )}
      {account && (
        <MenuItem h={["40px","48px"]} borderRadius={0} onClick={() => uiStore.openAccountDetails()}>
          <HStack w="full" /*justifyContent="center"*/>
            {/* @ts-ignore */}
            {connector && <Image src={connector.icon.dark} width="24px" height="24px" alt={connector.name} />}
            <Text>{frenlyAddress(account.address || "")}</Text>
          </HStack>
        </MenuItem>
      )}
    </>
  );
};
