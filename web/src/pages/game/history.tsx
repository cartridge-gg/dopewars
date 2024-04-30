import { Button } from "@/components/common";
import { Alert, Clock, User } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { HallOfFame } from "@/components/pages/home/HallOfFame";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGamesByPlayer } from "@/dojo/hooks/useGamesByPlayer";
import { Game } from "@/generated/graphql";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
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

const GameList = ({ games }: { games?: Game[] }) => {
  const { router } = useRouterContext();

  const onClick = (game: Game) => {
    if (!game.game_over) {
      router.push(`/0x${game.game_id.toString(16)}`);
    } else {
      router.push(`/0x${game.game_id.toString(16)}/logs`);
    }
  };

  if (!games) return null;
  return (
    <UnorderedList boxSize="full" variant="dotted" h="auto" fontSize={"12px"}>
      <ListItem key={"OxO"}>
        <HStack mr={3} whiteSpace="nowrap">
          <Text w={"70px"} flexShrink={0}>
            Saison
          </Text>
          <Text w={"70px"} flexShrink={0}>
            Game id
          </Text>
          <Text w={"200px"} flexShrink={0}>
            Identity
          </Text>
        </HStack>
      </ListItem>

      {games.map((game: Game, index: number) => {
        const playerName = shortString.decodeShortString(game.player_name);

        return (
          <ListItem key={game.game_id} cursor="pointer" onClick={() => onClick(game)} h="30px">
            <HStack mr={3} whiteSpace="nowrap">
              <Text w={"70px"} flexShrink={0}>
                {game.leaderboard_version}
              </Text>
              <Text w={"70px"} flexShrink={0}>
                {game.game_id}
              </Text>
              <Text w={"200px"} flexShrink={0}>
                {playerName}
              </Text>
            </HStack>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};
