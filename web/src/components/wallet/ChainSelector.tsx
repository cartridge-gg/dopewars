import { useDojoContext } from "@/dojo/hooks";
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Chain } from "@starknet-react/chains";
import { useDisconnect } from "@starknet-react/core";

export const ChainSelector = ({ ...props }) => {
  // const { chain } = useNetwork();
  const {
    network: { chains, selectedChain, setSelectedChain },
  } = useDojoContext();

  const { disconnectAsync } = useDisconnect();

  const onSelectChain = async (chain: Chain) => {
    await disconnectAsync();
    setSelectedChain(chain);
  };

  return (
    <Menu>
      <MenuButton as={Button} variant="pixelated" h="48px" /*rightIcon={<Arrow direction='down' />}*/>
        {selectedChain.name}
      </MenuButton>
      <MenuList>
        {chains.map((chain: Chain, key:number) => {
          if (chain === selectedChain) return;
          const isMainnet = chain.network === "mainnet";
          return (
            <MenuItem key={key} onClick={() => onSelectChain(chain)}>
              <Text>
                {chain.name} ({isMainnet ? "RANKED" : "FREE"})
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
