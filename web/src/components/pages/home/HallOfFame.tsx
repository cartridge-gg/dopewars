import { HustlerIcon } from "@/components/hustlers";
import { PaperIcon } from "@/components/icons";
import { Loader } from "@/components/layout/Loader";
import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGameById } from "@/dojo/hooks/useGameById";
import { useHallOfFame } from "@/dojo/hooks/useHallOfFame";
import { Leaderboard } from "@/generated/graphql";
import colors from "@/theme/colors";
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
      <VStack
        boxSize="full"
        maxH={["calc(100vh - 350px)", "calc(100vh - 480px)"]}
        sx={{
          overflowY: "scroll",
        }}
        __css={{
          "scrollbar-width": "none",
        }}
      >
        {isFetchingHallOfFame && <Loader />}
        {!isFetchingHallOfFame && (
          <SimpleGrid columns={[1, 2]} w="full" gap={4}>
            {hallOfFame
              .filter((i) => i.version !== config?.ryo?.season_version)
              .sort((a, b) => b.version - a.version)
              .map((i, index) => {
                return <HallOfFameEntry entry={i} key={index} account={account} />;
              })}
          </SimpleGrid>
        )}
      </VStack>
    </>
  );
});

const HallOfFameEntry = ({ entry, account }: { entry: Leaderboard; account: AccountInterface | undefined }) => {
  const { router } = useRouterContext();
  const { game, isFetched } = useGameById(entry.game_id);

  const isSelf = useMemo(() => {
    if (!account) return false;
    return account?.address === game?.player_id;
  }, [account?.address, game?.player_id]);

  const claimable = useMemo(() => {
    return account?.address === game?.player_id && !entry.claimed;
  }, [account?.address, entry.claimed, game?.player_id]);

  const onClick = useCallback(() => {
    router.push(`/0x${entry.game_id.toString(16)}/logs`);
  }, [entry.game_id, game?.player_id, router]);

  const color = isSelf ? colors.yellow["400"].toString() : colors.neon["400"].toString();

  if (!isFetched) return null;
  return (
    <Card position="relative" h="100px" p={2} color={color}>
      <VStack h="100%" justifyContent="space-between" gap={0}>
        {game && (
          <HStack w="full" gap={3}>
            <HustlerIcon
              hustler={game?.hustler_id}
              color={color}
              width="48px"
              height="48px"
              cursor="pointer"
              onClick={onClick}
            />

            <VStack w="full" alignItems="flex-start" gap={1}>
              <Text>
                {shortString.decodeShortString(game?.player_name)} {isSelf && "(you)"}
              </Text>
              <Text>{formatCash(entry.high_score)}</Text>
            </VStack>
          </HStack>
        )}

        {!game && <Text>No winner!</Text>}

        <HStack
          w="full"
          justifyContent="space-between"
          borderTop="solid 1px"
          borderColor="neon.700"
          pt={1}
          mt={1}
          opacity={0.7}
        >
          <Text>SEASON {entry.version}</Text>
          <Text color={color}>
            <PaperIcon width="16px" height="16px" color={color} mr={1} />
            {formatCash(entry.paper_balance).replace("$", "")}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
};
