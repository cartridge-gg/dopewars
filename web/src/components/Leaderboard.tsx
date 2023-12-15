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
import { Arrow, Skull } from "./icons";
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
    if (Number.isNaN(days)) {
      days = 4
      hours = 20
      minutes = 4
      seconds = 20
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

const Leaderboard = ({ nameEntry, ...props }: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojoContext();
  const { ryoMetas } = useRyoMetas();

  const [currentVersion, setCurrentVersion] = useState(ryoMetas?.leaderboard_version);
  const [selectedVersion, setSelectedVersion] = useState(ryoMetas?.leaderboard_version);

  const { leaderboardMetas } = useLeaderboardMetas(selectedVersion);
  const { scores, resetQuery, refetch, hasNextPage, fetchNextPage } = useGlobalScoresIninite(selectedVersion, 10);

  const [targetGameId, setTargetGameId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const listRef = useRef(null);

  const onPrev = async () => {
    if (selectedVersion > 1) {
      setSelectedVersion(selectedVersion - 1);
      await resetQuery();
    }
  };

  const onNext = async () => {
    if (selectedVersion < currentVersion) {
      setSelectedVersion(selectedVersion + 1);
      await resetQuery();
    }
  };

  useEffect(() => {
    resetQuery();
    setCurrentVersion(ryoMetas?.leaderboard_version);
    setSelectedVersion(ryoMetas?.leaderboard_version);
  }, [ryoMetas]);

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
      <VStack my="15px">
        <HStack>
          <Arrow
            direction="left"
            cursor="pointer"
            opacity={selectedVersion > 1 ? "1" : "0.25"}
            onClick={onPrev}
          ></Arrow>
          <Text textStyle="subheading" fontSize="12px">
            LEADERBOARD <small>(v{leaderboardMetas?.version})</small>
          </Text>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedVersion < currentVersion ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
        {selectedVersion === currentVersion && (
          <Countdown date={new Date(leaderboardMetas?.next_version_timestamp * 1_000)} renderer={renderer}></Countdown>
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
        <UnorderedList boxSize="full" variant="dotted" h="auto" ref={listRef}>
          {scores && scores.length > 0 ? (
            scores.map((score, index) => {
              const isOwn = score.playerId === account?.address;
              const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
              const avatarColor = isOwn ? "yellow" : "green";
              const displayName = score.name ? `${score.name}${isOwn ? " (you)" : ""}` : "Anonymous";

              return (
                <ListItem color={color} key={score.gameId} cursor={isOwn && !score.name ? "pointer" : "auto"}>
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
