import { Tooltip } from "@/components/common";
import { Trophy } from "@/components/icons";
import { Config } from "@/dojo/stores/config";
import { useRouterContext } from "@/dojo/hooks";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { Box, HStack, ListItem, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { HustlerAvatarIcon } from "../profile/HustlerAvatarIcon";
import { LeaderboardEntry } from "@/utils/leaderboard";
import { getPayedCount } from "@/dojo/helpers";
import { RewardDetails } from "./Leaderboard";
import { pulse } from "@/theme/animations";

export type LeaderboardItemProps = {
  entry: LeaderboardEntry;
  index: number;
  isOwn: boolean;
  config: Config;
  registeredGamesCount: number;
  itemRef?: (el: HTMLElement | null) => void;
};

export const LeaderboardItem = observer(
  ({ entry, index, isOwn, config, registeredGamesCount, itemRef }: LeaderboardItemProps) => {
    const { router } = useRouterContext();
    const isActive = entry.type === "active";
    const payedCount = getPayedCount(registeredGamesCount);

    const baseColor = isOwn
      ? colors.yellow["400"].toString()
      : colors.neon["200"].toString();
    const color = isActive ? colors.yellow["400"].toString() : baseColor;
    const displayName = entry.player_name
      ? `${entry.player_name}${isOwn ? " (you)" : ""}`
      : "Anonymous";

    const handleClick = () => {
      if (isActive) {
        router.push(`/0x${entry.game_id.toString(16)}`);
      } else {
        router.push(`/0x${entry.game_id.toString(16)}/logs`);
      }
    };

    return (
      <ListItem
        ref={itemRef}
        color={color}
        cursor="pointer"
        onClick={handleClick}
        _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
      >
        <HStack mr={3}>
          <Text
            w={["10px", "30px"]}
            fontSize={["10px", "16px"]}
            flexShrink={0}
            whiteSpace="nowrap"
          >
            {index + 1}.
          </Text>
          <Box
            flexShrink={0}
            style={{ marginTop: "-8px" }}
          >
            <HustlerAvatarIcon
              gameId={entry.game_id}
              tokenIdType={entry.token_id_type}
              tokenId={entry.token_id}
            />
          </Box>

          <HStack>
            <Text
              flexShrink={0}
              maxWidth={["150px", "350px"]}
              whiteSpace="nowrap"
              overflow="hidden"
              fontSize={["12px", "16px"]}
            >
              {displayName} <span style={{ fontSize: "9px" }}>(x{entry.multiplier})</span>
            </Text>
          </HStack>

          <Text
            backgroundImage={`radial-gradient(${color} 20%, transparent 20%)`}
            backgroundSize="10px 10px"
            backgroundPosition="left center"
            backgroundRepeat="repeat-x"
            flexGrow={1}
            color="transparent"
          >
            {"."}
          </Text>

          <Text flexShrink={0} fontSize={["12px", "16px"]}>
            {formatCash(entry.score)}
          </Text>

          {isActive && (
            <Text
              fontSize="9px"
              color="yellow.400"
              fontWeight="bold"
              animation={`${pulse} 2s ease-in-out infinite`}
              ml={1}
            >
              LIVE
            </Text>
          )}

          {!isActive && entry.claimable > 0 && (
            <Text flexShrink={0} fontSize={["12px", "16px"]}>
              <Tooltip
                placement="left"
                content={
                  <RewardDetails
                    claimable={entry.claimable}
                    position={entry.position}
                    seasonVersion={entry.season_version}
                  />
                }
                color="neon.400"
              >
                <span>
                  <Trophy />
                </span>
              </Tooltip>
            </Text>
          )}

          {!isActive &&
            entry.season_version === config.ryo.season_version &&
            entry.registeredPosition !== undefined &&
            entry.registeredPosition <= payedCount && (
              <Text flexShrink={0} fontSize={["12px", "16px"]}>
                <Tooltip
                  placement="left"
                  content={
                    <RewardDetails
                      position={entry.registeredPosition}
                      seasonVersion={entry.season_version}
                    />
                  }
                  color="neon.400"
                >
                  <span>
                    <Trophy opacity={0.5} />
                  </span>
                </Tooltip>
              </Text>
            )}
        </HStack>
      </ListItem>
    );
  },
);
