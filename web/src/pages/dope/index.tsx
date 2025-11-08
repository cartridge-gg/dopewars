import { Footer, Layout } from "@/components/layout";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Button, HStack, Box, Tabs, Tab, TabList, TabPanels, TabPanel, Flex, Text } from "@chakra-ui/react";
import { getContractByName } from "@dojoengine/core";
import { useDojoTokens } from "@/dope/hooks";
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import CollectionGrid from "@/dope/collections/CollectionGrid";
import GearItem from "@/dope/collections/GearItem";
import HustlerItem from "@/dope/collections/HustlerItem";
import LootItem from "@/dope/collections/LootItem";
import { Refresh } from "@/components/icons";
import { SmallLoader } from "@/components/layout/Loader";
import { ControllerConnector } from "@cartridge/connector";
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { useDopeStore } from "@/dope/store";

export default function Dope() {
  const { router } = useRouterContext();
  const { account } = useAccount();
  const { connector } = useConnect();

  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const initDopeLootClaimState = useDopeStore((state) => state.initDopeLootClaimState);

  useEffect(() => {
    initDopeLootClaimState();
  }, [initDopeLootClaimState]);

  const addresses = useMemo(() => {
    return [
      getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
      getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
      getContractByName(selectedChain.manifest, "dope", "DopeGear")!.address,
    ];
  }, [selectedChain.manifest]);

  const { tokens, tokensBalances, accountTokens, refetch, isLoading } = useDojoTokens(
    toriiClient,
    addresses,
    account?.address,
  );

  // console.log(accountTokens)

  const { loot, hustlers, gear, gearAddress, gearCount } = useMemo(() => {
    const gearAddress = getContractByName(selectedChain.manifest, "dope", "DopeGear")!.address;
    const loot = (accountTokens || []).filter(
      (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
    );
    const hustlers = (accountTokens || []).filter(
      (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
    );
    const gear = (accountTokens || []).filter((i) => i.contract_address === gearAddress);

    const gearCount = (tokensBalances || [])
      .filter((i) => BigInt(i.contract_address) === BigInt(gearAddress))
      .map((i) => i.balance)
      .reduce((p, c) => p + c, 0n)
      .toString();

    return { loot, hustlers, gear, gearAddress, gearCount };
  }, [accountTokens, tokensBalances, selectedChain.manifest]);

  const [isRefetching, setIsRefetching] = useState(false);
  const onRefetch = async () => {
    if (isRefetching) {
      return;
    }
    setIsRefetching(true);
    await refetch();
    setTimeout(() => {
      setIsRefetching(false);
    }, 500);
  };

  const onOpenController = (e: any, collectionAddress: string) => {
    e.preventDefault();
    const path = collectionAddress === gearAddress ? "collectible" : "collection";
    (connector as unknown as ControllerConnector).controller.openProfileTo(`inventory/${path}/${collectionAddress}`);
  };

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["80%", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </Footer>
      }
    >
      <HStack w="full" gap={6} flexWrap="wrap" alignItems="flex-start" justifyContent="center">
        <Tabs variant="unstyled" w="full">
          <TabList pb={6} gap={[0, 3]}>
            <Tab fontSize={["10px", "14px"]} px={2}>
              <HStack w="full" justifyContent="space-between">
                <Text>LOOT ({loot.length})</Text>
                <Box
                  cursor="pointer"
                  onClick={(e) => {
                    onOpenController(e, addresses[0]);
                  }}
                >
                  <Cartridge />
                </Box>
              </HStack>
            </Tab>
            <Tab fontSize={["10px", "14px"]} px={2}>
              <HStack w="full" justifyContent="space-between">
                <Text>HUSTLERS ({hustlers.length})</Text>
                <Box
                  cursor="pointer"
                  onClick={(e) => {
                    onOpenController(e, addresses[1]);
                  }}
                >
                  <Cartridge />
                </Box>
              </HStack>
            </Tab>
            <Tab fontSize={["10px", "14px"]} px={2}>
              <HStack w="full" justifyContent="space-between">
                <Text>GEAR ({gearCount})</Text>
                <Box
                  cursor="pointer"
                  onClick={(e) => {
                    onOpenController(e, addresses[2]);
                  }}
                >
                  <Cartridge />
                </Box>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels mt={0} maxH="calc(100dvh - 70px)" overflowY="scroll">
            <TabPanel p={0}>
              <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
                <CollectionGrid tokens={loot} ItemComponent={LootItem} />
              </Flex>
            </TabPanel>

            <TabPanel p={0}>
              <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
                <CollectionGrid tokens={hustlers} ItemComponent={HustlerItem} />
              </Flex>
            </TabPanel>

            <TabPanel p={0}>
              <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
                <CollectionGrid tokens={gear} ItemComponent={GearItem} tokensBalances={tokensBalances} />
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </HStack>

      <Box position="fixed" w="24px" h="24px" bottom={[7, 6]} right={[3, 6]} zIndex={1} title="Refresh">
        {!isRefetching ? <Refresh onClick={onRefetch} cursor="pointer" /> : <SmallLoader />}
      </Box>

      <Box minH="80px"></Box>
    </Layout>
  );
}
