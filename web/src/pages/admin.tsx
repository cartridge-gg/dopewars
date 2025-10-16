import { Layout } from "@/components/layout";
import { ChildrenOrConnect, PaperFaucet, TokenBalance } from "@/components/wallet";
import { useDojoContext, useRouterContext, useSeasonByVersion, useSystems } from "@/dojo/hooks";
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
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";

import { Wallet } from "@/components/icons/archive";
import { DrugTable } from "@/components/pages/admin/DrugTable";
import { EncounterTable } from "@/components/pages/admin/EncounterTable";
import { GameConfigTable } from "@/components/pages/admin/GameConfigTable";
import { GameLayoutTable } from "@/components/pages/admin/GameLayoutTable";
import { PlayerLayoutTable } from "@/components/pages/admin/PlayerLayoutTable";
import { useEffect, useState } from "react";
import { Dropdown } from "@/components/common";
// import { RyoConfigTable } from "@/components/pages/admin/RyoConfigTable";
import { Bag, Clock, CopsIcon, DollarBag, Flipflop, PaperIcon } from "@/components/icons";
import { formatCash } from "@/utils/ui";
import { Ludes } from "@/components/icons/drugs";
import { Dopewars_Game as Game, Dopewars_GameEdge as GameEdge, useGetAllGamesQuery } from "@/generated/graphql";
import { shortString } from "starknet";

const Admin = () => {
  const { router } = useRouterContext();
  const { account } = useAccount();
  const { configStore } = useDojoContext();

  return (
    <Layout isSinglePanel={true}>
      <Tabs variant="unstyled" w="full">
        <TabList pb={6}>
          <Tab>ADMIN</Tab>
          <Tab>SEASON</Tab>
          <Tab>GAME</Tab>
          <Tab>DRUGS</Tab>

          <Tab>ENCOUNTERS</Tab>
          {/* <Tab>LAYOUTS</Tab> */}

          {/* <Cigarette
            onClick={() => {
              configStore.init();
            }}
          /> */}
        </TabList>

        <TabPanels mt={0} maxH="calc(100dvh - 300px)" overflowY="scroll">
          <TabPanel p={0}>
            <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
              <RyoAddressCard />
              <RyoPauseCard />
              <TreasuryClaimCard />
              <ExportAllGamesCard />
            </Flex>
          </TabPanel>

          <TabPanel p={0}>
            <Flex w="full" alignItems="flex-start" gap={3} flexDirection="row" flexWrap="wrap">
              <RyoSeasonConfigCard />
              <RyoSuperchargeCard />
            </Flex>
          </TabPanel>

          <TabPanel p={0}>
            <Card w="full" p={3}>
              <CardBody>
                <HStack w="full" gap={6} alignItems="flex-start">
                  <VStack alignItems="flex-start">
                    <Card>
                      <CardBody>
                        <GameConfigTable />
                      </CardBody>
                    </Card>
                  </VStack>
                  {/* <VStack alignItems="flex-start">
                    <Text>Ryo Config</Text>
                    <RyoConfigTable />
                  </VStack> */}
                </HStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel p={0}>
            <Card w="full">
              <CardBody>
                <DrugTable />
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel p={0}>
            <Card w="full">
              <CardBody>
                <EncounterTable />
              </CardBody>
            </Card>
          </TabPanel>

          {/* <TabPanel p={0}>
            <VStack w="full" alignItems="flex-start">
              <Text>GAME </Text>
              <Card w="full">
                <CardBody>
                  <GameLayoutTable />
                </CardBody>
              </Card>
              <Text>PLAYER </Text>
              <Card w="full">
                <CardBody>
                  <PlayerLayoutTable />
                </CardBody>
              </Card>
            </VStack>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default observer(Admin);

const RyoAddressCard = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  return (
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <Wallet /> RYO ADDRESS
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start">
          <HStack>
            <Text w="100px">PAPER</Text>
            <Text fontFamily="monospace">{config?.ryoAddress.paper}</Text>
            <TokenBalance address={config?.ryoAddress.paper} token={config?.ryoAddress.paper} icon={PaperIcon} />
          </HStack>
          <HStack>
            <Text w="100px">TREASURY</Text>
            <Text fontFamily="monospace">{config?.ryoAddress.treasury}</Text>
            <TokenBalance address={config?.ryoAddress.treasury} token={config?.ryoAddress.paper} icon={PaperIcon} />
          </HStack>
          <HStack>
            <Text w="100px">LAUNDROMAT</Text>
            {/* `laundromat` may not exist on the generated GraphQL type; read it safely */}
            {(() => {
              const laundromat = (config?.ryoAddress as any)?.laundromat;
              return (
                <>
                  <Text fontFamily="monospace">{laundromat ?? "N/A"}</Text>
                  <TokenBalance address={laundromat} token={config?.ryoAddress.paper} icon={PaperIcon} />
                </>
              );
            })()}
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
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <PaperIcon /> TREASURY
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
        <VStack>
          <Text w="220px" flexShrink={0} color="neon.500">
            Claiming send claimable PAPER balance to Treasury
          </Text>
          <ChildrenOrConnect>
            <Button isLoading={isPending} onClick={onClaim}>
              Claim
            </Button>
          </ChildrenOrConnect>
        </VStack>
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
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <CopsIcon /> RYO
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

import jsonToCsvExport from "json-to-csv-export";

const ExportAllGamesCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;

  const allGames = useGetAllGamesQuery({});

  const onClick = async () => {
    const games = (allGames.data?.dopewarsGameModels?.edges || [])
      .map((i) => i?.node as Game)
      .map((i) => {
        return { ...i, player_name: shortString.decodeShortString(i.player_name?.value) };
      })
      .sort((a, b) => a.game_id - b.game_id);

    jsonToCsvExport({ data: games });
  };

  return (
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <Flipflop /> EXPORT
      </CardHeader>
      <CardBody></CardBody>
      <CardFooter>
        <ChildrenOrConnect>
          <Button onClick={onClick}>Export</Button>
        </ChildrenOrConnect>
      </CardFooter>
    </Card>
  );
});

const RyoSeasonConfigCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;

  const [ryoConfig, setRyoConfig] = useState(config?.ryo);

  const { updateRyoConfig, isPending } = useSystems();

  const onUpdate = async () => {
    await updateRyoConfig(ryoConfig!);
    await configStore.init();
  };

  return (
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <Clock /> NEXT SEASON PARAMETERS
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start" gap={6}>
          <Text color="neon.500">Configure next season parameters</Text>

          <VStack>
            <HStack>
              <VStack alignItems="flex-start" gap={0}>
                <Text w="220px" flexShrink={0}>
                  SEASON DURATION (sec)
                </Text>
                <Text color="neon.500">
                  {Math.floor(ryoConfig?.season_duration / 60)} min ({(ryoConfig?.season_duration / 3600).toFixed(1)} H)
                </Text>
              </VStack>
              <Input
                w="100px"
                value={ryoConfig?.season_duration}
                onChange={(e) => {
                  setRyoConfig({
                    ...ryoConfig,
                    season_duration: Number(e.target.value),
                  });
                }}
              />
            </HStack>

            <HStack>
              <VStack alignItems="flex-start" gap={0}>
                <Text w="220px" flexShrink={0}>
                  SEASON TIME LIMIT (sec)
                </Text>
                <Text color="neon.500">
                  {Math.floor(ryoConfig?.season_time_limit / 60)} min (
                  {(ryoConfig?.season_time_limit / 3600).toFixed(1)} H)
                </Text>
              </VStack>

              <Input
                w="100px"
                value={ryoConfig?.season_time_limit}
                onChange={(e) => {
                  setRyoConfig({
                    ...ryoConfig,
                    season_time_limit: Number(e.target.value),
                  });
                }}
              />
            </HStack>

            <HStack>
              <Text w="220px" flexShrink={0}>
                PAPER FEE
              </Text>
              <Input
                w="100px"
                value={ryoConfig?.paper_fee}
                onChange={(e) => {
                  setRyoConfig({
                    ...ryoConfig,
                    paper_fee: Number(e.target.value),
                  });
                }}
              />
            </HStack>

            <HStack>
              <Text w="220px" flexShrink={0}>
                TREASURY FEE %
              </Text>
              <Input
                w="100px"
                value={ryoConfig?.treasury_fee_pct}
                onChange={(e) => {
                  setRyoConfig({
                    ...ryoConfig,
                    treasury_fee_pct: Number(e.target.value),
                  });
                }}
              />
            </HStack>

            <HStack>
              <Text w="220px" flexShrink={0}>
                PAPER REWARD LAUNDERER
              </Text>
              <Input
                w="100px"
                value={ryoConfig?.paper_reward_launderer}
                onChange={(e) => {
                  setRyoConfig({
                    ...ryoConfig,
                    paper_reward_launderer: Number(e.target.value),
                  });
                }}
              />
            </HStack>
          </VStack>
          <ChildrenOrConnect>
            <Button isLoading={isPending} onClick={onUpdate}>
              UPDATE
            </Button>
          </ChildrenOrConnect>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
});

const RyoSuperchargeCard = observer(() => {
  const { configStore } = useDojoContext();
  const { config } = configStore;
  const { account } = useAccount();

  const [value, setValue] = useState(0);
  const { season, refetch } = useSeasonByVersion(config?.ryo.season_version || 0);

  const { superchargeJackpot, isPending } = useSystems();

  const onSuperchargeJackpot = async () => {
    await superchargeJackpot(config?.ryo.season_version, value);
    await configStore.init();
    await refetch();
  };

  return (
    <Card p={1}>
      <CardHeader textAlign="left" borderBottom="solid 1px" borderColor="neon.500" mb={3}>
        <DollarBag /> SUPERCHARGE JACKPOT
      </CardHeader>
      <CardBody>
        <VStack alignItems="flex-start" gap={6}>
          <Text color="neon.500">
            Transfer some PAPER from your wallet
            <br /> to supercharge current season jackpot
          </Text>

          <VStack alignItems="flex-start">
            <Text>CURRENT SEASON : {config?.ryo.season_version}</Text>
            <Text>CURRENT JACKPOT : {formatCash(season?.paper_balance).replace("$", "")}</Text>
          </VStack>

          <VStack alignItems="flex-start">
            <HStack>
              <Text>YOUR BALANCE : </Text>
              <TokenBalance address={account?.address} token={config?.ryoAddress.paper} icon={PaperIcon} />
            </HStack>

            <HStack>
              <Text>PAPER AMOUNT</Text>
              <Input
                w="100px"
                value={value}
                onChange={(e) => {
                  setValue(Number(e.target.value));
                }}
              />
              <ChildrenOrConnect>
                <Button isLoading={isPending} onClick={onSuperchargeJackpot}>
                  SEND
                </Button>
              </ChildrenOrConnect>
              <PaperFaucet />
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
});
