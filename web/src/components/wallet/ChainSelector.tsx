import { useDojoContext } from "@/dojo/hooks";
import { DojoChainConfig, SupportedChainIds } from "@/dojo/setup/config";
import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useDisconnect } from "@starknet-react/core";

type ChainSelectorProps = {
  canChange: boolean;
  onChange?: VoidFunction;
};

export const ChainSelector = ({ canChange = false, onChange = () => {} }: ChainSelectorProps) => {
  const {
    chains: { dojoContextConfig, selectedChain, setSelectedChain },
  } = useDojoContext();

  const { disconnectAsync } = useDisconnect();

  const onSelectChain = async (chain: DojoChainConfig) => {
    await disconnectAsync();
    setSelectedChain(chain);
    onChange();
  };

  const getInfos = (chain: DojoChainConfig) => {
    return `RPC: ${chain.rpcUrl}\nTORII: ${chain.toriiUrl}\nTORII WS: ${chain.toriiWsUrl}`;
  };

  const isSingleChain = Object.keys(dojoContextConfig).length === 1;

  if (isSingleChain) return null;

  return (
    <>
      {!canChange && (
        <Button variant="pixelated" h="40px" cursor="not-allowed">
          {selectedChain.name}
        </Button>
      )}

      {canChange && (
        <Menu>
          <MenuButton
            title={getInfos(selectedChain)}
            as={Button}
            variant="pixelated"
            h="40px" /*rightIcon={<Arrow direction='down' />}*/
          >
            {selectedChain.name}
          </MenuButton>

          <MenuList>
            {Object.keys(dojoContextConfig).map((key: string) => {
              const dojoChainConfig: DojoChainConfig = dojoContextConfig[key as SupportedChainIds];

              if (dojoChainConfig === selectedChain) return;
              return (
                <MenuItem key={key} onClick={() => onSelectChain(dojoChainConfig)}>
                  <Text>{dojoChainConfig.name}</Text>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      )}
    </>
  );
};
