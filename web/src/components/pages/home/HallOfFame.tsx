import { HustlerIcon } from "@/components/hustlers";
import { PaperIcon } from "@/components/icons";
import { useConfigStore, useDojoContext, useRouterContext, useRyoStore, useSystems } from "@/dojo/hooks";
import { useGameById } from "@/dojo/hooks/useGameById";
import { Leaderboard } from "@/generated/graphql";
import { formatCash } from "@/utils/ui";
import { Card, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { shortString } from "starknet";

export const HallOfFame = observer(() => {
  const { config } = useConfigStore();
  const { account } = useDojoContext();

  const ryoStore = useRyoStore();
  const { hallOfFame } = ryoStore;

  const filtered = useMemo(() => {
    if (!hallOfFame) return [];
    return hallOfFame.filter((i) => i.version !== config?.ryo?.leaderboard_version);
  }, [hallOfFame, config?.ryo?.leaderboard_version]);

  return (
    <SimpleGrid columns={[1, 2]} w="full" gap={4}>
      {filtered.map((i, index) => {
        return <HallOfFameEntry entry={i} key={index} account={account} />;
      })}
    </SimpleGrid>
  );
});

const HallOfFameEntry = ({ entry, account }: { entry: Leaderboard; account?: Account }) => {
  const { router } = useRouterContext();
  const { game, isLoading } = useGameById(entry.game_id);
console.log(entry)
  const { claim, isPending } = useSystems();

  const claimable = useMemo(() => {
    return account?.address === game?.player_id && !entry.claimed;
  }, [account?.address, entry.claimed]);

  const onClick = useCallback(() => {
    router.push(`/0x${entry.game_id.toString(16)}/logs?playerId=${game?.player_id}`);
  }, [entry.game_id, game?.player_id]);

  const onClaim = useCallback(async () => {
    await claim(entry.version);
  }, []);

  return (
    <Card position="relative" p={3} cursor="pointer">
      <VStack alignItems="flex-start" gap={0}>
        <HStack w="full" justifyContent="space-between" borderBottom="solid 1px" borderColor="neon.700" pb={2} mb={2}>
          <Text>SEASON {entry.version}</Text>
          <Text color={claimable ? "yellow.400" : "neon.400"}>
            {formatCash(entry.paper_balance).replace("$", "")} <small>PAPER</small>
            {/*claimable*/ true && (<PaperIcon width="20px" height="20px" ml={1} onClick={onClaim} />)}
          </Text>
        </HStack>

        {game && (
          <HStack w="full" gap={3}>
            <HustlerIcon hustler={game?.hustler_id} width="48px" height="48px" onClick={onClick} />

            <VStack w="full" alignItems="flex-start" gap={1}>
              <Text>{shortString.decodeShortString(game?.player_name)}</Text>
              <Text>{formatCash(entry.high_score)}</Text>
            </VStack>
          </HStack>
        )}
      </VStack>
    </Card>
  );
};
