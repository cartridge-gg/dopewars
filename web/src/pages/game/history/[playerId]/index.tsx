import {
  Cigarette,
  CopsIcon,
  DollarBag,
  Flipflop,
  GangIcon,
  PaperCashIcon,
  PaperIcon,
  Trophy,
} from "@/components/icons";
import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";
import { AK47, Uzi } from "@/components/icons/items";
import { Layout } from "@/components/layout";
import { HustlerAvatarIcon } from "@/components/pages/profile/HustlerAvatarIcon";
import { ReputationIndicator } from "@/components/player";
import { GameClass } from "@/dojo/class/Game";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { PlayerStats, useGamesByPlayer } from "@/dojo/hooks/useGamesByPlayer";
import { Drugs, GameMode } from "@/dojo/types";
import { formatCashHeader } from "@/utils/ui";
import {
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  Table,
  Button,
  Heading,
  Card,
  CardBody,
  Box,
  Flex,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { num, shortString } from "starknet";

export default function History() {
  const { router, playerId } = useRouterContext();
  const {
    clients: { toriiClient },
  } = useDojoContext();

  const { games, onGoingGames, endedGames, playerStats } = useGamesByPlayer(toriiClient, playerId || "0x0");

  return (
    <Layout isSinglePanel={true} footer={<Button onClick={() => router.push("/")}>HOME</Button>}>
      <VStack w="full" h={["100%", "calc(100% - 100px)"]}>
        <Flex w="full" direction={["column", "row"]} gap={[0, "80px"]} h={["auto", "100%"]}>
          <CustomLeftPanel playerStats={playerStats} />
          <VStack boxSize="full" gap="10px" flex={1}>
            <Tabs variant="unstyled" w="full">
              <TabList pb={6}>
                <Tab>ON GOING</Tab>
                <Tab>ENDED</Tab>
              </TabList>

              <TabPanels mt={0} maxH={["100%", "calc(100dvh - 380px)"]} overflowY="scroll">
                <TabPanel p={0}>
                  <GameList games={onGoingGames} />
                </TabPanel>
                <TabPanel p={0}>
                  <GameList games={endedGames} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Flex>
      </VStack>
    </Layout>
  );
}

const GameList = observer(({ games }: { games?: GameClass[] }) => {
  const { router } = useRouterContext();

  const onClick = (game: GameClass) => {
    debugger;
    if (!game.gameInfos.game_over) {
      router.push(`/0x${game.gameInfos.game_id.toString(16)}`);
    } else if (game.gameInfos.game_over && !game.gameInfos.registered) {
      router.push(`/0x${game.gameInfos.game_id.toString(16)}/end`);
    } else {
      router.push(`/0x${game.gameInfos.game_id.toString(16)}/logs`);
    }
  };

  if (!games) return null;
  return (
    <TableContainer position="relative">
      <Table size="sm" variant="tiny">
        <Tbody>
          <Tr>
            <Td w="40px"></Td>
            <Td w="40px" textAlign="right">
              Season
            </Td>
            <Td w="80px" textAlign="right">
              Identity
            </Td>
            <Td w="50px" textAlign="right">
              Turn
            </Td>
            <Td w="120px" textAlign="right">
              Location
            </Td>
            {/* <Td w="60px" textAlign="right">
              Health
            </Td> */}
            <Td w="100px" textAlign="right">
              Cash
            </Td>

            <Td w="120px" textAlign="right">
              Registered
            </Td>
          </Tr>

          {games.map((game: GameClass, index: number) => {
            const playerName = shortString.decodeShortString(
              num.toHexString(BigInt(game.gameInfos.player_name?.value)),
            );

            return (
              <Tr key={game.gameInfos.game_id} cursor="pointer" onClick={() => onClick(game)}>
                <Td>
                  <HustlerAvatarIcon
                    gameId={game.gameInfos.game_id}
                    // @ts-ignore
                    tokenIdType={game?.gameInfos?.token_id_type}
                    tokenId={Number(game?.gameInfos?.token_id)}
                  />
                </Td>
                <Td textAlign="center">{game.gameInfos.season_version}</Td>

                <Td>{playerName}</Td>
                <Td textAlign="right">{game.player.turn}</Td>
                <Td textAlign="right">{game.player.location?.name}</Td>
                {/* <Td textAlign="right">{game.player.health}</Td> */}
                <Td textAlign="right">{formatCashHeader(game.player.cash)}</Td>

                <Td
                  onClick={() => router.push(`/0x${game.gameInfos.game_id.toString(16)}/end`)}
                  textAlign="right"
                  color={
                    game.gameInfos.game_mode === "Ranked"
                      ? game.gameInfos.registered
                        ? "neon.400"
                        : "yellow.400"
                      : "neon.400"
                  }
                >
                  {game.gameInfos.game_mode === "Ranked" ? (game.gameInfos.registered ? "Yes" : "No") : "Unranked"}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

const CustomLeftPanel = ({ playerStats }: { playerStats?: PlayerStats }) => {
  return (
    <VStack
      flex={1}
      w="full"
      h="full"
      justifyContent="center"
      alignItems="center"
      marginBottom={["30px", "50px"]}
      gap={3}
    >
      <Heading fontSize={["30px", "48px"]} fontWeight="400" mb={["0px", "20px"]}>
        History
      </Heading>

      <Box boxSize="full" mt={["0", "30px"]}>
        <VStack gap={6}>
          <Tabs variant="unstyled" w="full">
            <TabList pb={6} overflowX="auto">
              <Tab>GENERAL</Tab>
              <Tab>ENCOUNTERS</Tab>
              <Tab>DRUGS</Tab>
            </TabList>

            <TabPanels mt={0} /*maxH={["100%", "calc(100dvh - 580px)"]} overflowY="scroll"*/>
              <TabPanel p={0}>
                <VStack w="full" alignItems="center">
                  <HStack justify="center" alignItems="center">
                    <Text textStyle="subheading" fontSize={["9px", "11px"]} lineHeight={1} color="yellow.500">
                      REPUTATION: {Math.floor(playerStats?.averageReputation || 0)}
                    </Text>
                  </HStack>

                  <ReputationIndicator reputation={playerStats?.averageReputation || 0} />
                  <PlayerStatsTable playerStats={playerStats} />
                </VStack>
              </TabPanel>
              <TabPanel p={0}>
                <VStack w="full" alignItems="center">
                  <PlayerStatsTable2 playerStats={playerStats} />
                </VStack>
              </TabPanel>
              <TabPanel p={0}>
                <VStack w="full" alignItems="center">
                  <TradedDrugsTable playerStats={playerStats} />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </VStack>
  );
};

export const PlayerStatsTable = ({ playerStats }: { playerStats?: PlayerStats }) => {
  return (
    <Card>
      <CardBody px={0}>
        <TableContainer position="relative">
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td w="30px">
                  <Trophy />
                </Td>
                <Td color="neon.500">BEST RANK</Td>
                <Td>{playerStats?.bestRanking}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <Cigarette />
                </Td>
                <Td color="neon.500">GAMES PLAYED</Td>
                <Td>{playerStats?.totalGamesPlayed}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <DollarBag />
                </Td>
                <Td color="neon.500">GAME PAID</Td>
                <Td>{playerStats?.totalGamesPaid}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <AK47 />
                </Td>
                <Td color="neon.500">PAY RATE</Td>
                <Td>{playerStats?.payRate}</Td>
              </Tr>

              <Tr>
                <Td w="30px" borderBottomColor="transparent">
                  <PaperIcon width="24px" my="2px" />
                </Td>
                <Td borderBottomColor="transparent" color="neon.500">
                  PAPER CLAIMED
                </Td>
                <Td borderBottomColor="transparent" title={playerStats?.totalPaperClaimed.toString()}>
                  {formatCashHeader(playerStats?.totalPaperClaimed || 0).replace("$", "")}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export const PlayerStatsTable2 = ({ playerStats }: { playerStats?: PlayerStats }) => {
  return (
    <Card>
      <CardBody px={0}>
        <TableContainer position="relative">
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td w="30px">
                  <CopsIcon />
                </Td>
                <Td color="neon.500">COPS</Td>
                <Td>{playerStats?.totalCopsEncounter}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <GangIcon />
                </Td>
                <Td color="neon.500">GANG</Td>
                <Td>{playerStats?.totalGangEncounter}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <Uzi />
                </Td>
                <Td color="neon.500">FIGHT</Td>
                <Td>{playerStats?.totalFight}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Flipflop />
                </Td>
                <Td color="neon.500">RUN</Td>
                <Td>{playerStats?.totalRun}</Td>
              </Tr>
              <Tr>
                <Td w="30px" borderBottomColor="transparent">
                  <PaperCashIcon />
                </Td>
                <Td color="neon.500" borderBottomColor="transparent">
                  PAY
                </Td>
                <Td borderBottomColor="transparent">{playerStats?.totalPay}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export const TradedDrugsTable = ({ playerStats }: { playerStats?: PlayerStats }) => {
  return (
    <Card>
      <CardBody>
        <TableContainer position="relative">
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td w="30px">
                  <Ludes width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  LUDES
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Ludes] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Speed width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  SPEED
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Speed] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Weed width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  WEED
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Weed] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Shrooms width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  SHROOMS
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Shrooms] || 0)}</Td>
              </Tr>

              <Tr>
                <Td w="30px">
                  <Acid width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  ACID
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Acid] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Ketamine width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  KETAMINE
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Ketamine] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Heroin width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500">
                  HEROIN
                </Td>
                <Td>{formatCashHeader(playerStats?.tradedDrugs[Drugs.Heroin] || 0)}</Td>
              </Tr>
              <Tr>
                <Td w="30px" borderBottomColor="transparent">
                  <Cocaine width="24px" height="24px" />
                </Td>
                <Td w="80px" color="neon.500" borderBottomColor="transparent">
                  COCAINE
                </Td>
                <Td borderBottomColor="transparent">
                  {formatCashHeader(playerStats?.tradedDrugs[Drugs.Cocaine] || 0)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};
