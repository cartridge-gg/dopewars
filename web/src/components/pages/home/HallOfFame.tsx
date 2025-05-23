import { HustlerIcon } from "@/components/hustlers";
import { PaperIcon } from "@/components/icons";
import { Loader } from "@/components/layout/Loader";
import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useGameById } from "@/dojo/hooks/useGameById";
import { useHallOfFame } from "@/dojo/hooks/useHallOfFame";
import { Dopewars_Game as Game } from "@/generated/graphql";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { Card, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo } from "react";
import { AccountInterface, num, shortString } from "starknet";

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
        maxH={["calc(100dvh - 350px)", "calc(100dvh - 480px)"]}
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
            {hallOfFame.map((i, index) => {
              return <HallOfFameEntry game={i} key={index} account={account} />;
            })}
          </SimpleGrid>
        )}
      </VStack>
    </>
  );
});

const HallOfFameEntry = ({ game, account }: { game: Game; account: AccountInterface | undefined }) => {
  const { router } = useRouterContext();

  const isSelf = useMemo(() => {
    if (!account) return false;
    return account?.address === game?.player_id;
  }, [account, game?.player_id]);

  const onClick = useCallback(() => {
    router.push(`/0x${game.game_id.toString(16)}/logs`);
  }, [game.game_id, router]);

  const color = isSelf ? colors.yellow["400"].toString() : colors.neon["400"].toString();

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
                {shortString.decodeShortString(num.toHexString(BigInt(game?.player_name?.value)))} {isSelf && "(you)"}
              </Text>
              <Text>{formatCash(game.final_score)}</Text>
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
          <Text>SEASON {game.season_version}</Text>
          <Text color={color}>
            <PaperIcon color={color} mr={1} />
            {formatCash(game.claimable).replace("$", "")}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
};
