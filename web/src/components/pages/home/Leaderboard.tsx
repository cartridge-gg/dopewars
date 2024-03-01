import { Box, HStack, ListItem, ListProps, StyleProps, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { GameOverData } from "@/dojo/events";
import { useConfigStore, useDojoContext, useRouterContext, useRyoStore } from "@/dojo/hooks";
import { useLeaderboards } from "@/dojo/hooks/useLeaderboards";
import colors from "@/theme/colors";
import { formatCash, formatEther } from "@/utils/ui";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { Avatar } from "../../avatar/Avatar";
import { genAvatarFromId } from "../../avatar/avatars";
import { Arrow, Skull } from "../../icons";
import { PaperIcon } from "../../icons/Paper";

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return <Text>RESETS NEXT GAME</Text>;
  } else {
    if (Number.isNaN(days)) {
      days = 4;
      hours = 20;
      minutes = 4;
      seconds = 20;
    }
    return (
      <HStack textStyle="subheading" fontSize="12px">
        <Text color="neon.500">RESETS IN:</Text>
        <Text>
          {days > 0 ? `${days}D` : ""} {hours.toString().padStart(2, "0")}H {minutes.toString().padStart(2, "0")}m{" "}
          {seconds.toString().padStart(2, "0")}s
        </Text>
      </HStack>
    );
  }
};

export const Leaderboard = ({ nameEntry, ...props }: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const { config } = useConfigStore();

  const ryoStore = useRyoStore();
  const { leaderboardEntries } = ryoStore;

  const [currentVersion, setCurrentVersion] = useState(config?.ryo?.leaderboard_version);
  const [selectedVersion, setSelectedVersion] = useState(config?.ryo?.leaderboard_version);

  const { leaderboard } = useLeaderboards(selectedVersion);

  const [targetGameId, setTargetGameId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const listRef = useRef(null);

  const onPrev = async () => {
    if (selectedVersion > 1) {
      setSelectedVersion(selectedVersion - 1);
    }
  };

  const onNext = async () => {
    if (selectedVersion < currentVersion) {
      setSelectedVersion(selectedVersion + 1);
    }
  };

  useEffect(() => {
    if (!ryoStore || !selectedVersion) return;
    ryoStore.reset();
    ryoStore.init(selectedVersion);
  }, [/*ryoStore,*/ selectedVersion]);

  useEffect(() => {
    setCurrentVersion(config?.ryo?.leaderboard_version);
    setSelectedVersion(config?.ryo?.leaderboard_version);
  }, [config?.ryo?.leaderboard_version /*resetQuery inifinte load if included !*/]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [leaderboard]);

  if (!leaderboard || !selectedVersion) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%">
      <VStack my="15px">
        <HStack>
          <Arrow
            direction="left"
            cursor="pointer"
            opacity={selectedVersion > 1 ? "1" : "0.25"}
            onClick={onPrev}
          ></Arrow>
          <Text textStyle="subheading" fontSize="12px">
            LEADERBOARD <small>(v{leaderboard?.version})</small>
          </Text>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedVersion < currentVersion ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
        {selectedVersion === currentVersion && (
          <Countdown date={new Date(leaderboard?.next_version_timestamp * 1_000)} renderer={renderer}></Countdown>
        )}
        <HStack color="yellow.400">
          <Text>JACKPOT</Text>
          <PaperIcon />
          <Text>{formatEther(leaderboard.paper_balance)}</Text>
        </HStack>
      </VStack>
      <VStack
        boxSize="full"
        gap="20px"
        maxH={["calc(100vh - 460px)", "calc(100vh - 480px)"]}
        sx={{
          overflowY: "scroll",
        }}
        __css={{
          "scrollbar-width": "none",
        }}
      >
        <UnorderedList boxSize="full" variant="dotted" h="auto" ref={listRef}>
          {leaderboardEntries && leaderboardEntries.length > 0 ? (
            leaderboardEntries.map((entry: GameOverData, index: number) => {
              const isOwn = entry.playerId === account?.address;
              const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
              const avatarColor = isOwn ? "yellow" : "green";
              const displayName = entry.playerName ? `${entry.playerName}${isOwn ? " (you)" : ""}` : "Anonymous";

              return (
                <ListItem color={color} key={entry.gameId} cursor={isOwn && !entry.playerName ? "pointer" : "auto"}>
                  <HStack mr={3}>
                    <Text
                      w={["10px", "30px"]}
                      fontSize={["10px", "16px"]}
                      flexShrink={0}
                      // display={["none", "block"]}
                      whiteSpace="nowrap"
                    >
                      {index + 1}.
                    </Text>
                    <Box
                      flexShrink={0}
                      style={{ marginTop: "-8px" }}
                      cursor="pointer"
                      onClick={() => router.push(`/${entry.gameId}/logs?playerId=${entry.playerId}`)}
                    >
                      {entry.health === 0 ? (
                        <Skull color={avatarColor} hasCrown={index === 0} />
                      ) : (
                        <Avatar name={genAvatarFromId(entry.avatarId)} color={avatarColor} hasCrown={index === 0} />
                      )}
                    </Box>

                    <HStack>
                      <Text
                        flexShrink={0}
                        maxWidth={["150px", "350px"]}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        fontSize={["12px", "16px"]}
                      >
                        {displayName}
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
                      {formatCash(entry.cash)}
                    </Text>
                  </HStack>
                </ListItem>
              );
            })
          ) : (
            <Text textAlign="center" color="neon.500">
              No scores submitted yet
            </Text>
          )}
        </UnorderedList>
      </VStack>
    </VStack>
  );
};


