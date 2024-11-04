import { frenlyAddress } from "@/utils/ui";
import { HStack, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { Predeployed, PredeployedManager } from "@dojoengine/create-burner";
import { useConnect, useDisconnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export const PredeployedManagerUi = observer(({ predeployedManager }: { predeployedManager?: PredeployedManager }) => {
  const { connect, connector } = useConnect();
  const { disconnect } = useDisconnect();

  const [isDeploying, setIsDeploying] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const [predeployed, setPredeployed] = useState<Predeployed[]>([]);

  useEffect(() => {
    if (!predeployedManager) return;
    const predeployed = predeployedManager.list();
    setPredeployed(predeployed);
  }, [predeployedManager, predeployedManager?.chainId, refresher]);

  const onSelect = (burner: Predeployed) => {
    if (!predeployedManager) return;
    predeployedManager.select(burner.address);
    setRefresher(!refresher);

    // force connect active wallet
    disconnect();
    connect({ connector });
  };

  if (!predeployedManager) return null;
  if (!connector) return null;
  if (connector && connector?.id !== "dojopredeployed") return null;

  return (
    <VStack w="full" p={3}>
      <>
        {predeployed.length === 0 && <Text>No predeployed!</Text>}
        {predeployed.length > 0 && (
          <>
            <List w="full">
              {predeployed.map((predeployed: Predeployed, idx: number) => {
                return (
                  <ListItem
                    key={idx}
                    w="full"
                    borderBottom="solid 2px"
                    borderBottomColor="neon.700"
                    py={1}
                    mb={1}
                    _last={{ borderBottom: 0 }}
                  >
                    <HStack
                      w="full"
                      color={predeployed.active ? "yellow.400" : "neon.400"}
                      justifyContent="space-between"
                    >
                      <Text textTransform="uppercase" cursor="pointer" onClick={() => onSelect(predeployed)}>
                        {frenlyAddress(predeployed.address)} ({predeployed.name})
                      </Text>
                    </HStack>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </>
    </VStack>
  );
});
