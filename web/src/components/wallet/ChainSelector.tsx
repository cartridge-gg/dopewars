import { useDojoContext } from "@/dojo/hooks";
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Chain } from "@starknet-react/chains";
import { useDisconnect, useNetwork } from "@starknet-react/core";

export const ChainSelector = ({ ...props }) => {
  const { chain } = useNetwork();
  const {
    network: { chains, selectedChain, setSelectedChain },
  } = useDojoContext();

  const { disconnect } = useDisconnect()

  return (
    <Menu>
      <MenuButton as={Button} variant="pixelated" h="48px" /*rightIcon={<Arrow direction='down' />}*/>
        {selectedChain.name}
      </MenuButton>
      <MenuList>
        {chains.map((i: Chain) => {
          if (i === selectedChain) return;
          const isMainnet = i.network === "mainnet";
          return (
            <MenuItem
              onClick={() => {
                disconnect();
                setSelectedChain(i);
              }}
            >
              <Text>
                {i.name} ({isMainnet ? "RANKED" : "FREE"})
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
