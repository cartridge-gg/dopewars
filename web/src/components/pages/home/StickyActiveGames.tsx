import { useRouterContext } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { LeaderboardEntry } from "@/utils/leaderboard";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { HustlerAvatarIcon } from "../profile/HustlerAvatarIcon";
import { pulse } from "@/theme/animations";

const MAX_STICKY_GAMES = 5;

export type StickyActiveGamesProps = {
  activeGames: LeaderboardEntry[];
  visiblePositions: Set<number>;
  maxVisiblePosition: number;
  currentUserAddress: string;
};

export const StickyActiveGames = observer(
  ({ activeGames, visiblePositions, maxVisiblePosition, currentUserAddress }: StickyActiveGamesProps) => {
    const { router } = useRouterContext();

    // Only show current user's active games in the sticky section
    const belowFoldGames = activeGames
      .filter((game) => {
        const isCurrentUser = currentUserAddress &&
          BigInt(game.player_id) === BigInt(currentUserAddress);
        const isBelowFold = !visiblePositions.has(game.position) && game.position > maxVisiblePosition;
        return isCurrentUser && isBelowFold;
      })
      .slice(0, MAX_STICKY_GAMES);

    if (belowFoldGames.length === 0) {
      return null;
    }

    return (
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9) 30%)"
        pt={6}
        pb={2}
        px={2}
        pointerEvents="auto"
      >
        <VStack gap={1} align="stretch">
          {belowFoldGames.map((game) => (
            <Box
              key={game.game_id}
              borderStyle="dashed"
              borderColor="yellow.400"
              borderWidth="1px"
              borderRadius="md"
              bg="rgba(234, 179, 8, 0.15)"
              p={2}
              cursor="pointer"
              onClick={() => router.push(`/0x${game.game_id.toString(16)}`)}
              _hover={{ bg: "rgba(234, 179, 8, 0.25)" }}
            >
              <HStack justify="space-between">
                <HStack>
                  <Text
                    fontSize="12px"
                    color="yellow.400"
                    fontWeight="bold"
                    w="40px"
                  >
                    #{game.position}
                  </Text>
                  <Box flexShrink={0} style={{ marginTop: "-4px" }}>
                    <HustlerAvatarIcon
                      gameId={game.game_id}
                      tokenIdType={game.token_id_type}
                      tokenId={game.token_id}
                    />
                  </Box>
                  <Text
                    fontSize="12px"
                    color="yellow.400"
                    maxWidth="120px"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {game.player_name || "Anonymous"}
                  </Text>
                  <Text
                    fontSize="9px"
                    color="yellow.400"
                    fontWeight="bold"
                    animation={`${pulse} 2s ease-in-out infinite`}
                  >
                    LIVE
                  </Text>
                </HStack>
                <Text fontSize="12px" color="yellow.400" fontWeight="bold">
                  {formatCash(game.score)}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  },
);
