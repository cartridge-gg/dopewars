import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Alert, Clock, User } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { HallOfFame } from "@/components/pages/home/HallOfFame";
import { GameClass } from "@/dojo/class/Game";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGamesByPlayer } from "@/dojo/hooks/useGamesByPlayer";
import { Game } from "@/generated/graphql";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { formatCashHeader } from "@/utils/ui";
import {
  Card,
  Divider,
  HStack,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { shortString } from "starknet";

export default function History() {
  const { router } = useRouterContext();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();

  const { games, onGoingGames, endedGames } = useGamesByPlayer(account?.address || "0x0");

  const onHustle = async () => {
    if (!account) {
      uiStore.openConnectModal();
      return;
    }

    router.push(`/game/new`);
  };

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "",
        title: "History",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100vh - 230px)"
    >
      <VStack boxSize="full" gap="10px">
        {/* <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            <Button flex="1" onClick={onHustle}>
              Hustle
            </Button>
          </HStack>
        </Card> */}

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
    <UnorderedList boxSize="full" variant="dotted" h="auto" fontSize={"12px"}>
      <ListItem key={"OxO"}>
        <HStack mr={3} whiteSpace="nowrap">
          <Text w={"40px"} flexShrink={0}></Text>
          <Text w={"80px"} flexShrink={0}>
            Identity
          </Text>
          <Text w={"70px"} flexShrink={0} align="right">
            Turn
          </Text>
          <Text w={"120px"} flexShrink={0} align="right">
            Location
          </Text>
          <Text w={"70px"} flexShrink={0} align="right">
            Health
          </Text>
          <Text w={"100px"} flexShrink={0} align="right">
            Cash
          </Text>
          <Text w={"80px"} flexShrink={0} align="right">
            Season
          </Text>
          <Text w={"80px"} flexShrink={0} align="right">
            Register
          </Text>
        </HStack>
      </ListItem>

      {games.map((game: GameClass, index: number) => {
        const playerName = shortString.decodeShortString(game.gameInfos.player_name);

        return (
          <ListItem key={game.gameInfos.game_id} h="30px">
            <HStack mr={3} whiteSpace="nowrap">
              <Text w={"40px"} flexShrink={0} cursor="pointer" onClick={() => onClick(game)}>
                <HustlerIcon hustler={game.gameInfos.hustler_id as Hustlers} />
              </Text>

              <Text w={"80px"} flexShrink={0}>
                {playerName}
              </Text>
              <Text w={"70px"} flexShrink={0} align="right">
                {game.player.turn}
              </Text>
              <Text w={"120px"} flexShrink={0} align="right">
                {game.player.location?.name}
              </Text>
              <Text w={"70px"} flexShrink={0} align="right">
                {game.player.health}
              </Text>
              <Text w={"100px"} flexShrink={0} align="right">
                {formatCashHeader(game.player.cash)}
              </Text>

              <Text w={"80px"} align="right">
                {game.gameInfos.season_version}
              </Text>
              <Text
                w={"80px"}
                onClick={() => router.push(`/0x${game.gameInfos.game_id.toString(16)}/end`)}
                align="right"
              >
                {game.gameInfos.registered ? "" : "register"}
              </Text>
            </HStack>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};

// <Text w={"70px"} flexShrink={0}>
//               {game.gameInfos.leaderboard_version}
//             </Text>
//             <Text w={"70px"} flexShrink={0}>
//               {game.gameInfos.game_id}
//             </Text>
