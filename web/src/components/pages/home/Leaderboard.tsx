import { Box, HStack, ListItem, ListProps, StyleProps, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Loader } from "@/components/layout/Loader";
import { GameOverData } from "@/dojo/events";
import { useDojoContext, useHallOfFame, useLeaderboardEntries, useRouterContext } from "@/dojo/hooks";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { Arrow, PaperIcon, Skull } from "../../icons";

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

export const Leaderboard = observer(({ nameEntry, ...props }: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const { router, gameId } = useRouterContext();

  const {
    chains: { selectedChain },
    configStore: { config },
  } = useDojoContext();
  const { account } = useAccount();

  //const { leaderboard, isFetchingLeaderboard } = useLeaderboardByVersion(selectedVersion);
  const { hallOfFame, isFetchingHallOfFame } = useHallOfFame();

  const [maxIndex, setMaxIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const maxIndex = hallOfFame.length > 0 ? hallOfFame.length - 1 : 0;
    setMaxIndex(maxIndex);
    setSelectedIndex(maxIndex);
  }, [hallOfFame]);

  const { leaderboardEntries, isFetchingLeaderboardEntries } = useLeaderboardEntries(
    hallOfFame[selectedIndex]?.version || 0,
  );

  const listRef = useRef(null);

  const onPrev = async () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const onNext = async () => {
    if (selectedIndex < maxIndex) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [leaderboardEntries]);

  if (!hallOfFame || hallOfFame.length === 0) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%">
      <VStack my="15px" w="full">
        <HStack w="full" justifyContent="space-between">
          <Arrow direction="left" cursor="pointer" opacity={selectedIndex > 0 ? "1" : "0.25"} onClick={onPrev}></Arrow>
          <HStack textStyle="subheading" fontSize="12px">
            <Text>SEASON {hallOfFame[selectedIndex]?.version} REWARDS</Text>
            <Text color="yellow.400">
              <PaperIcon width="16px" height="16px" color="yellow.400" mr={1}/>
              {formatCash(hallOfFame[selectedIndex]?.paper_balance || 0).replace("$", "")}
            </Text>
          </HStack>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedIndex < maxIndex ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
        {selectedIndex === maxIndex && (
          <Countdown
            date={new Date(hallOfFame[selectedIndex]?.next_version_timestamp * 1_000)}
            renderer={renderer}
          ></Countdown>
        )}
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
        {isFetchingLeaderboardEntries && <Loader />}
        {!isFetchingLeaderboardEntries && (
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
                        onClick={() => router.push(`/${entry.gameId}/logs`)}
                      >
                        {entry.health === 0 ? (
                          <Skull color={avatarColor} hasCrown={index === 0} />
                        ) : (
                          <HustlerIcon hustler={entry.avatarId as Hustlers} color={color} />
                          //<Avatar name={genAvatarFromId(entry.avatarId)} color={avatarColor} hasCrown={index === 0} />
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
        )}
      </VStack>
    </VStack>
  );
});
