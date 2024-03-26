import { Layout } from "@/components/layout";
import { ChildrenOrConnect, TokenBalance } from "@/components/wallet";
import { useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";

import { Wallet } from "@/components/icons/archive";
import { DrugTable } from "@/components/pages/admin/DrugTable";
import { GameLayoutTable } from "@/components/pages/admin/GameLayoutTable";
import { HustlerItemBaseTable } from "@/components/pages/admin/HustlerItemBaseTable";
import { HustlerItemTiersTable } from "@/components/pages/admin/HustlerItemTiersTable";
import { PlayerLayoutTable } from "@/components/pages/admin/PlayerLayoutTable";
import { useEffect, useState } from "react";

export default function Admin() {
  const { router } = useRouterContext();
  const { account } = useAccount();

  return (
    <Layout isSinglePanel={true}>
      <Tabs variant="unstyled" w="full">
        <TabList pb={6}>
          <Tab>ADMIN</Tab>
          <Tab>DRUGS</Tab>
          <Tab>ITEMS</Tab>
          <Tab>LAYOUTS</Tab>
        </TabList>

        <TabPanels mt={0} maxH="calc(100vh - 300px)" overflowY="scroll">
          <TabPanel p={0}>
            <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
              <RyoAddressCard />
              <RyoPauseCard />
              <TreasuryClaimCard />
              <RyoFeeCard />
            </Flex>
          </TabPanel>

          <TabPanel p={0}>
            <Card w="full">
              <DrugTable />
            </Card>
          </TabPanel>

          <TabPanel p={0}>
            <VStack w="full" alignItems="flex-start">
            <Text>ITEM BASE</Text>
              <Card w="full">
                <HustlerItemBaseTable />
              </Card>
            <Text>ITEM TIERS</Text>
              <Card w="full">
                <HustlerItemTiersTable />
              </Card>
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack w="full" alignItems="flex-start">
            <Text>GAME </Text>
              <Card w="full" >
                <GameLayoutTable />
              </Card>
              <Text>PLAYER </Text>
              <Card w="full" >
                <PlayerLayoutTable />
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}

const RyoAddressCard = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  return (
    <Card p={3}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        RYO ADDRESS
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start">
          <HStack>
            <Text w="180px">PAPER</Text>
            <Text>{config?.ryoAddress.paper}</Text>
          </HStack>
          <HStack>
            <Text w="180px">TREASURY</Text>
            <Text>{config?.ryoAddress.treasury}</Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
});

const TreasuryClaimCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;

  const { claimTreasury, isPending } = useSystems();

  const onClaim = async () => {
    await claimTreasury();
    await configStore.init();
  };

  return (
    <Card p={3}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        TREASURY
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start">
          <HStack>
            <Text w="180px">PAPER BALANCE</Text>
            <TokenBalance address={config?.ryoAddress.treasury} token={config?.ryoAddress.paper} />
          </HStack>
          <HStack>
            <Text w="180px">PAPER CLAIMABLE</Text>
            <Text> {config?.ryo.treasury_balance}</Text>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter>
        <ChildrenOrConnect>
          <Button isLoading={isPending} onClick={onClaim}>
            Claim
          </Button>
        </ChildrenOrConnect>
      </CardFooter>
    </Card>
  );
});

const RyoPauseCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;

  const { setPaused, isPending } = useSystems();

  const onTogglePause = async () => {
    await setPaused(!config?.ryo.paused);
    await configStore.init();
  };

  return (
    <Card p={3}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        RYO
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start">
          <Text>{config?.ryo.paused ? "PAUSED" : "NOT PAUSED"}</Text>
        </VStack>
      </CardBody>
      <CardFooter>
        <ChildrenOrConnect>
          <Button isLoading={isPending} onClick={onTogglePause}>
            Toggle pause
          </Button>
        </ChildrenOrConnect>
      </CardFooter>
    </Card>
  );
});

const RyoFeeCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;

  const [paperFeeValue, setPaperFeeValue] = useState(config?.ryo.paper_fee);
  const [treasuryFeePctValue, setTreasuryFeePctValue] = useState(config?.ryo.treasury_fee_pct);

  const { setPaperFee, setTreasuryFeePct, isPending } = useSystems();

  useEffect(() => {
    setPaperFeeValue(config?.ryo.paper_fee);
  }, [config?.ryo.paper_fee]);

  useEffect(() => {
    setTreasuryFeePctValue(config?.ryo.treasury_fee_pct);
  }, [config?.ryo.treasury_fee_pct]);

  // const { setPaused, isPending } = useSystems();

  const updatePaperFee = async () => {
    await setPaperFee(paperFeeValue);
    await configStore.init();
  };

  const updateTreasuryFeePct = async () => {
    await setTreasuryFeePct(treasuryFeePctValue);
    await configStore.init();
  };

  return (
    <Card p={3}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        RYO FEES
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start">
          <HStack>
            <Text w="180px" flexShrink={0}>
              PAPER FEE
            </Text>
            <Input
              w="100px"
              value={paperFeeValue}
              onChange={(e) => {
                setPaperFeeValue(e.target.value);
              }}
            />
            <Button isLoading={isPending} onClick={updatePaperFee}>
              <Wallet />
            </Button>
          </HStack>

          <HStack>
            <Text w="180px" flexShrink={0}>
              TREASURY FEE %
            </Text>
            <Input
              w="100px"
              value={treasuryFeePctValue}
              onChange={(e) => {
                setTreasuryFeePctValue(e.target.value);
              }}
            />
            <Button isLoading={isPending} onClick={updateTreasuryFeePct}>
              <Wallet />
            </Button>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
});
