import { HustlerIcon } from "@/components/hustlers";
import { Loader } from "@/components/layout/Loader";
import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGameById } from "@/dojo/hooks/useGameById";
import { useHallOfFame } from "@/dojo/hooks/useHallOfFame";
import { Leaderboard } from "@/generated/graphql";
import { formatCash } from "@/utils/ui";
import { Card, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { AccountInterface, shortString } from "starknet";

export const HallOfFame = observer(() => {
  const { config } = useConfigStore();
  const { account } = useAccount();
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const { hallOfFame, refetchHallOfFame, isFetchingHallOfFame } = useHallOfFame();

  return (
    <>
      {isFetchingHallOfFame && <Loader />}
      {!isFetchingHallOfFame && (
        <SimpleGrid columns={[1, 2]} w="full" gap={4}>
          {hallOfFame
            .filter((i) => i.version !== config?.ryo?.leaderboard_version)
            .map((i, index) => {
              return <HallOfFameEntry entry={i} key={index} account={account} />;
            })}
        </SimpleGrid>
      )}
    </>
  );
});

const HallOfFameEntry = ({ entry, account }: { entry: Leaderboard; account: AccountInterface | undefined }) => {
  const { router } = useRouterContext();
  const { game, isFetched } = useGameById(entry.game_id);

  const isSelf = useMemo(() => {
    return account?.address === game?.player_id;
  }, [account?.address, game?.player_id]);

  const claimable = useMemo(() => {
    return account?.address === game?.player_id && !entry.claimed;
  }, [account?.address, entry.claimed, game?.player_id]);

  const onClick = useCallback(() => {
    router.push(`/0x${entry.game_id.toString(16)}/logs`);
  }, [entry.game_id, game?.player_id, router]);

  if (!isFetched) return null;
  return (
    <Card position="relative" p={3}>
      <VStack alignItems="flex-start" gap={0}>
        <HStack w="full" justifyContent="space-between" borderBottom="solid 1px" borderColor="neon.700" pb={2} mb={2}>
          <Text>SEASON {entry.version}</Text>
          <Text color={claimable ? "yellow.400" : "neon.400"}>
            {formatCash(entry.paper_balance).replace("$", "")} <small>PAPER</small>
          </Text>
        </HStack>

        {game && (
          <HStack w="full" gap={3}>
            <HustlerIcon
              hustler={game?.hustler_id}
              color={isSelf ? "yellow.400" : "neon.400"}
              width="48px"
              height="48px"
              cursor="pointer"
              onClick={onClick}
            />

            <VStack w="full" alignItems="flex-start" gap={1}>
              <Text>{shortString.decodeShortString(game?.player_name)}</Text>
              <Text>{formatCash(entry.high_score)}</Text>
            </VStack>
          </HStack>
        )}

        {!game && <Text>No winner!</Text>}
      </VStack>
    </Card>
  );
};
