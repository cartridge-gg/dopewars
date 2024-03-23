import { useDojoContext } from "@/dojo/hooks";
import { DojoChainConfig, SupportedChainIds } from "@/dojo/setup/config";
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useDisconnect } from "@starknet-react/core";

export const ChainSelector = ({ canChange = false }: { canChange: boolean }) => {
  const {
    chains: { dojoContextConfig, selectedChain, setSelectedChain },
  } = useDojoContext();

  const { disconnectAsync } = useDisconnect();

  const onSelectChain = async (chain: DojoChainConfig) => {
    await disconnectAsync();
    setSelectedChain(chain);
  };

  const getInfos = (chain: DojoChainConfig) => {
   return `RPC: ${chain.rpcUrl}\nTORII: ${chain.toriiUrl}\nTORII WS: ${chain.toriiWsUrl}`
  };

  return (
    <>
      {!canChange && (
        <Button variant="pixelated" h="48px" cursor="not-allowed">
          {selectedChain.name}
        </Button>
      )}

      {canChange && (
          <Menu>
            <MenuButton title={getInfos(selectedChain)} as={Button} variant="pixelated" h="48px" /*rightIcon={<Arrow direction='down' />}*/>
              {selectedChain.name}
            </MenuButton>

            <MenuList>
              {Object.keys(dojoContextConfig).map((key: string) => {
                const dojoChainConfig: DojoChainConfig = dojoContextConfig[key as SupportedChainIds];

                if (dojoChainConfig === selectedChain) return;
                const isMainnet = dojoChainConfig.chainConfig.network === "mainnet";
                return (
                  <MenuItem key={key} onClick={() => onSelectChain(dojoChainConfig)}>
                    <Text>
                      {dojoChainConfig.name} ({isMainnet ? "RANKED" : "FREE"})
                    </Text>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
      )}
    </>
  );
};
