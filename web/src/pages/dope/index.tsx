import { Footer, Layout } from "@/components/layout";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Button, HStack, Box, Tabs, Tab, TabList, TabPanels, TabPanel, Flex } from "@chakra-ui/react";
import { getContractByName } from "@dojoengine/core";
import { useDojoTokens } from "@dope/dope-sdk/hooks";
import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import CollectionGrid from "./CollectionGrid";
import LootItem from "./LootItem";
import HustlerItem from "./HustlerItem";
import GearItem from "./GearItem";

export default function Dope() {
  const { router } = useRouterContext();
  const { account } = useAccount();

  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const addresses = useMemo(() => {
    return [
      getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
      getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
      getContractByName(selectedChain.manifest, "dope", "DopeGear")!.address,
    ];
  }, [selectedChain.manifest]);

  const { tokens, tokensBalances, accountTokens } = useDojoTokens(toriiClient, addresses, account?.address);

  const { loot, hustlers, gear } = useMemo(() => {
    const loot = (accountTokens || []).filter(
      (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
    );
    const hustlers = (accountTokens || []).filter(
      (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
    );
    const gear = (accountTokens || []).filter(
      (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeGear")!.address,
    );

    return { loot, hustlers, gear };
  }, [accountTokens, addresses, account?.address]);

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
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
          <TabList pb={6}>
            <Tab fontSize={["11px", "14px"]}>LOOT ({loot.length})</Tab>
            <Tab fontSize={["11px", "14px"]}>HUSTLERS ({hustlers.length})</Tab>
            <Tab fontSize={["11px", "14px"]}>GEAR ({gear.length})</Tab>
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

      <Box minH="80px"></Box>
    </Layout>
  );
}
