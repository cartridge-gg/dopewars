import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Alert, Cigarette, Clock, Gem, PaperIcon, User } from "@/components/icons";
import { Layout } from "@/components/layout";
import {
  useDojoContext,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
  useSystems,
} from "@/dojo/hooks";
import { Game } from "@/generated/graphql";

import { useToast } from "@/hooks/toast";
import { formatCashHeader } from "@/utils/ui";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  UnorderedList,
  VStack,
  HStack,
  Heading,
  Card,
  Divider,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { shortString } from "starknet";

interface Claimable {
  totalClaimable: number;
  totalClaimed: number;
  gameIds: Array<number>;
}

export default function SeasonIndex() {
  const { router, seasonId } = useRouterContext();
  const { account } = useAccount();

  const { registeredGames, isFetched, refetch: refetchRegisteredGames } = useRegisteredGamesBySeason(seasonId || 0);
  const { season, sortedList } = useSeasonByVersion(seasonId || 0);

  const [claimable, setClaimable] = useState<Claimable>({
    totalClaimable: 0,
    totalClaimed: 0,
    gameIds: [],
  });

  const { claim, isPending } = useSystems();

  useEffect(() => {
    refetchRegisteredGames();
  }, [refetchRegisteredGames]);

  useEffect(() => {
    const onlyClaimable = registeredGames.filter(
      (i) => i.player_id === account?.address && i.claimable > 0 && !i.claimed,
    );
    const gameIds = onlyClaimable.map((i) => i.game_id);
    const totalClaimable = onlyClaimable.map((i) => i.claimable).reduce((p, c) => p + c, 0);

    const onlyClaimed = registeredGames.filter((i) => i.player_id === account?.address && i.claimable > 0 && i.claimed);
    const totalClaimed = onlyClaimed.map((i) => i.claimable).reduce((p, c) => p + c, 0);

    setClaimable({
      totalClaimable,
      totalClaimed,
      gameIds,
    });
  }, [account?.address, registeredGames, refetchRegisteredGames]);

  const onClaim = async () => {
    if (!seasonId || !account) return;

    await claim(account?.address, claimable.gameIds);

    refetchRegisteredGames();
  };

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "",
        title: `Season ${seasonId}`,
        imageSrc: "/images/laundromat.png",
      }}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100vh - 230px)"
      footer={<Button onClick={() => router.push("/season")}>BACK</Button>}
    >
      <VStack boxSize="full" gap={6}>
        <VStack w="full">
          <Card w="full" p={3} alignItems="center">
            <Text>Total entrants {sortedList?.size}</Text>

            {sortedList?.locked && <Text>Total paid {sortedList?.process_size}</Text>}

            {claimable.totalClaimable > 0 && (
              <Text fontSize="16px">
                {claimable.totalClaimable} <PaperIcon /> Claimable
              </Text>
            )}
            {claimable.totalClaimed > 0 && (
              <Text fontSize="16px" my={3}>
                You claimed {claimable.totalClaimed} <PaperIcon /> PAPER!
              </Text>
            )}
          </Card>
          {/* <Text>Game ids : {claimable.gameIds.join(", ")}</Text> */}
          {claimable.totalClaimable > 0 && (
            <Button
              isLoading={isPending}
              h="48px"
              variant="pixelated"
              bg="yellow.600"
              color="yellow.400"
              onClick={() => onClaim()}
            >
              <Gem />
              CLAIM
            </Button>
          )}
        </VStack>

        <VStack w="full">
          <Text>Registered Games</Text>
          <GamesTable games={registeredGames} />
        </VStack>
      </VStack>
    </Layout>
  );
}

export const GamesTable = ({ games }: { games: Game[] }) => {
  const { account } = useAccount();

  return (
    <TableContainer position="relative" w="full" maxH="calc(100vh - 300px)" overflow="hidden" overflowY="auto">
      <Table size="sm">
        <Thead position="sticky" top="0" bg="neon.900">
          <Tr>
            {/* <Th isNumeric>gameId</Th> */}
            <Th isNumeric>Rank</Th>
            <Th>Hustler</Th>
            <Th isNumeric>Cash</Th>
            <Th isNumeric>Payout</Th>
            <Th>Claimed</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((game, idx) => {
            if (!game) return;

            const isPlayer = game.player_id === account?.address;
            const color = isPlayer ? "yellow.400" : "neon.400";
            return (
              <Tr color={color} key={idx}>
                {/* <Td isNumeric>{game.game_id}</Td> */}
                <Td isNumeric>{game.position > 0 ? game.position : idx + 1}</Td>
                <Td>
                  <HStack>
                    <HustlerIcon hustler={game.hustler_id as Hustlers} color={color} />
                    <Text>{shortString.decodeShortString(game.player_name)}</Text>
                  </HStack>
                </Td>
                <Td isNumeric>{formatCashHeader(game.final_score)}</Td>
                <Td isNumeric>{game.claimable > 0 ? game.claimable : "-"}</Td>
                <Td>{game.claimed && <Cigarette />}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
