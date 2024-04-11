import { Cigarette } from "@/components/icons";
import { Sounds, playSound } from "@/hooks/sound";
import { frenlyAddress } from "@/utils/ui";
import { Button, HStack, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { Burner, BurnerManager } from "@dojoengine/create-burner";
import { useConnect, useDisconnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export const BurnerManagerUi = observer(({ burnerManager }: { burnerManager?: BurnerManager }) => {
  const { connect, connector } = useConnect();
  const { disconnect } = useDisconnect();

  const [isDeploying, setIsDeploying] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const [burners, setBurners] = useState<Burner[]>([]);

  useEffect(() => {
    if (!burnerManager) return;
    const burners = burnerManager.list();
    setBurners(burners);
  }, [burnerManager, burnerManager?.chainId, burnerManager?.isDeploying, refresher]);

  const onCreate = async () => {
    if (!burnerManager) return;

    setIsDeploying(true);
    try {
      await burnerManager?.create();
    } catch (e: any) {
      console.log(e);
    }
    setIsDeploying(false);
    setRefresher(!refresher);

    // force connect active wallet
    disconnect();
    connect({ connector });
  };

  const onSelect = (burner: Burner) => {
    if (!burnerManager) return;
    burnerManager.select(burner.address);
    setRefresher(!refresher);

    // force connect active wallet
    disconnect();
    connect({ connector });
  };

  const onDelete = (burner: Burner) => {
    if (!burnerManager) return;
    burnerManager.delete(burner.address);
    setRefresher(!refresher);

    playSound(Sounds.Magnum357);

    // force connect active wallet
    disconnect();
    connect({ connector });
  };

  if (!burnerManager) return null;
  if (!connector) return null;
  if (connector?.id !== "dojoburner") return null;

  return (
    <VStack w="full" p={3}>
      <>
        {burners.length === 0 && <Text>No burner!</Text>}
        {burners.length > 0 && (
          <>
            <List w="full">
              {burners.map((burner: Burner, idx: number) => {
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
                    <HStack w="full" color={burner.active ? "yellow.400" : "neon.400"} justifyContent="space-between">
                      <Text textTransform="uppercase" cursor="pointer" onClick={() => onSelect(burner)}>
                        {frenlyAddress(burner.address)}
                      </Text>
                      <Cigarette cursor="crosshair" onClick={() => onDelete(burner)} />
                    </HStack>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
        <Button variant="pixelated" w="full" isLoading={isDeploying} onClick={onCreate}>
          Create Burner
        </Button>
      </>
    </VStack>
  );
});
