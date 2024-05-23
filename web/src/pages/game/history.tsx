import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Layout } from "@/components/layout";
import { GameClass } from "@/dojo/class/Game";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGamesByPlayer } from "@/dojo/hooks/useGamesByPlayer";

import { formatCashHeader } from "@/utils/ui";
import {
  HStack,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  UnorderedList,
  VStack,
  Table,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";

import { shortString } from "starknet";

export default function History() {
  const { router } = useRouterContext();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();

  const { games, onGoingGames, endedGames } = useGamesByPlayer(account?.address || "0x0");

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "",
        title: "History",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
      rigthPanelScrollable={false}
    >
      <VStack boxSize="full" gap="10px">
        <Tabs variant="unstyled" w="full">
          <TabList pb={6}>
            <Tab>ON GOING</Tab>
            <Tab>ENDED</Tab>
          </TabList>

          <TabPanels mt={0} maxH={["100%", "calc(100vh - 380px)"]} overflowY="scroll">
            <TabPanel p={0}>
              <GameList games={onGoingGames} />
            </TabPanel>
            <TabPanel p={0}>
              <GameList games={endedGames} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Layout>
  );
}

const GameList = ({ games }: { games?: GameClass[] }) => {
  const { router } = useRouterContext();

  const onClick = (game: GameClass) => {
    if (!game.gameInfos.game_over) {
      router.push(`/0x${game.gameInfos.game_id.toString(16)}`);
    } else {
      router.push(`/0x${game.gameInfos.game_id.toString(16)}/logs`);
    }
  };

  if (!games) return null;
  return (
    <TableContainer position="relative">
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td w="40px"></Td>
            <Td w="80px">Identity</Td>
            <Td w="50px">Turn</Td>
            <Td w="120px">Location</Td>
            <Td w="60px">Health</Td>
            <Td w="100px">Cash</Td>
            <Td w="80px">Season</Td>
            <Td w="120px">Registered</Td>
          </Tr>

          {games.map((game: GameClass, index: number) => {
            const playerName = shortString.decodeShortString(game.gameInfos.player_name);

            return (
              <Tr key={game.gameInfos.game_id}>
                <Td cursor="pointer" onClick={() => onClick(game)}>
                  <HustlerIcon hustler={game.gameInfos.hustler_id as Hustlers} />
                </Td>

                <Td>{playerName}</Td>
                <Td align="right">{game.player.turn}</Td>
                <Td align="right">{game.player.location?.name}</Td>
                <Td align="right">{game.player.health}</Td>
                <Td align="right">{formatCashHeader(game.player.cash)}</Td>

                <Td align="right">{game.gameInfos.season_version}</Td>
                <Td
                  onClick={() => router.push(`/0x${game.gameInfos.game_id.toString(16)}/end`)}
                  align="right"
                  color={game.gameInfos.registered ? "neon.400" : "yellow.400"}
                >
                  {game.gameInfos.registered ? "Yes" : "No"}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
