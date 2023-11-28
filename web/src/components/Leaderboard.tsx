import {
  StyleProps,
  Text,
  HStack,
  UnorderedList,
  Box,
  Button,
  ListItem,
  ListProps,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import Input from "@/components/Input";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { Avatar } from "./avatar/Avatar";
import { genAvatarFromId } from "./avatar/avatars";
import colors from "@/theme/colors";
import { Score, useGlobalScoresIninite } from "@/dojo/queries/useGlobalScores";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useRouter } from "next/router";
import { formatCash } from "@/utils/ui";
import { Skull } from "./icons";
import { useRyoMetas } from "@/dojo/queries/useRyoMetas";
import { useLeaderboardMetas } from "@/dojo/queries/useLeaderboardMetas";
import Countdown from "react-countdown";

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
    return (
      <HStack textStyle="subheading" fontSize="12px">
        <Text color="neon.500">RESETS IN:</Text> {days > 0 ? `${days}D` : ""} {hours.toString().padStart(2, "0")}H{" "}
        <Text>
          {minutes.toString().padStart(2, "0")}m {seconds.toString().padStart(2, "0")}s
        </Text>
      </HStack>
    );
  }
};

const Leaderboard = ({ nameEntry, ...props }: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojoContext();
  const { ryoMetas } = useRyoMetas();
  const { leaderboardMetas } = useLeaderboardMetas(ryoMetas?.leaderboard_version);
  const { scores, refetch, hasNextPage, fetchNextPage } = useGlobalScoresIninite(ryoMetas?.leaderboard_version, 10);

  const [targetGameId, setTargetGameId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const listRef = useRef(null);

  useEffect(() => {
    console.log(ryoMetas);
    console.log(leaderboardMetas);
  }, [ryoMetas, leaderboardMetas]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [scores]);

  if (!scores) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%">
      <Text textStyle="subheading" fontSize="12px">
        HALL OF FAME <small>(v{leaderboardMetas?.version})</small>
      </Text>
      <Countdown date={new Date(leaderboardMetas?.next_version_timestamp * 1_000)} renderer={renderer}></Countdown>
      <VStack
        boxSize="full"
        gap="20px"
        sx={{
          overflowY: "scroll",
        }}
        __css={{
          "scrollbar-width": "none",
        }}
      >
        <UnorderedList boxSize="full" variant="dotted" h="auto" ref={listRef}>
          {scores && scores.length > 0 ? (
            scores.map((score, index) => {
              const isOwn = score.playerId === account?.address;
              const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
              const avatarColor = isOwn ? "yellow" : "green";
              const displayName = score.name ? `${score.name}${isOwn ? " (you)" : ""}` : "Anonymous";

              return (
                <ListItem color={color} key={index} cursor={isOwn && !score.name ? "pointer" : "auto"}>
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
                      onClick={() => router.push(`/${score.gameId}/logs?playerId=${score.playerId}`)}
                    >
                      {score.dead ? (
                        <Skull color={avatarColor} hasCrown={index === 0} />
                      ) : (
                        <Avatar name={genAvatarFromId(score.avatarId)} color={avatarColor} hasCrown={index === 0} />
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
                      {formatCash(score.cash)}
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

      {hasNextPage && (
        <Button minH="40px" variant="pixelated" onClick={() => fetchNextPage()}>
          Load More
        </Button>
      )}
    </VStack>
  );
};

export default Leaderboard;
