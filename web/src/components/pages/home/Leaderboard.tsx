import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { Loader } from "@/components/layout/Loader";
import {
  useConfigStore,
  useDojoContext,
  useHallOfFame,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
} from "@/dojo/hooks";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { Box, HStack, ListItem, ListProps, StyleProps, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { Arrow, InfosIcon, PaperIcon, Skull } from "../../icons";
import { SeasonDetailsModal } from "./SeasonDetailsModal";
import { Game } from "@/generated/graphql";
import { shortString } from "starknet";

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

  const { uiStore } = useDojoContext();
  const { account } = useAccount();
  const { config } = useConfigStore();

  const [currentVersion, setCurrentVersion] = useState(config?.ryo.season_version || 0);
  const [selectedVersion, setSelectedVersion] = useState(config?.ryo.season_version  || 0);

  const  { season }= useSeasonByVersion(selectedVersion)

  const {
    registeredGames,
    isFetching: isFetchingRegisteredGames,
    refetch: refetchRegisteredGames,
  } = useRegisteredGamesBySeason(selectedVersion);

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

  const onDetails = (version: any) => {
    router.push(`/season/${version}`);
  };

  if (!registeredGames || !season ) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%">
      <VStack my="15px" w="full">
        <HStack w="full" justifyContent="space-between">
          <Arrow direction="left" cursor="pointer" opacity={selectedVersion > 1 ? "1" : "0.25"} onClick={onPrev}></Arrow>
          <HStack textStyle="subheading" fontSize="12px" w="full" justifyContent="center" position="relative">
            <Text cursor="pointer" onClick={() => onDetails(selectedVersion)}>
              SEASON {selectedVersion} REWARDS
            </Text>
            <Text color="yellow.400">
              <PaperIcon color="yellow.400" mr={1} />
              {formatCash(season.paper_balance || 0).replace("$", "")}
            </Text>
          </HStack>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedVersion < currentVersion ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
        {selectedVersion === currentVersion && (
          <HStack>
            <Countdown
              date={new Date(season.next_version_timestamp * 1_000)}
              renderer={renderer}
            ></Countdown>
            <Box cursor="pointer" onClick={() => uiStore.openSeasonDetails()}>
              <InfosIcon />
            </Box>
          </HStack>
        )}
      </VStack>
      <VStack
        boxSize="full"
        gap="20px"
        maxH={["calc(100vh - 430px)", "calc(100vh - 480px)"]}
        sx={{
          overflowY: "scroll",
        }}
        __css={{
          "scrollbar-width": "none",
        }}
      >
        {isFetchingRegisteredGames && <Loader />}
        {!isFetchingRegisteredGames && (
          <UnorderedList boxSize="full" variant="dotted" h="auto">
            {registeredGames && registeredGames.length > 0 ? (
              registeredGames.map((game: Game, index: number) => {
                const isOwn = game.player_id === account?.address;
                const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
                const avatarColor = isOwn ? "yellow" : "green";
                const displayName = game.player_name ? `${shortString.decodeShortString( game.player_name)}${isOwn ? " (you)" : ""}` : "Anonymous";

                return (
                  <ListItem color={color} key={game.game_id} cursor="pointer">
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
                        onClick={() => router.push(`/0x${game.game_id.toString(16)}/logs`)}
                      >
                        {/* {game.health === 0 ? (
                          <Skull color={avatarColor} hasCrown={index === 0} />
                        ) : ( */}
                          <HustlerIcon hustler={game.hustler_id as Hustlers} color={color} />
                        {/* )} */}
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

                        {
                        game.claimable > 0 && (
                          <Text flexShrink={0} fontSize={["12px", "16px"]}>
                         <PaperIcon /> {game.claimable} ...
                        </Text>
                        )
                      }

                      <Text flexShrink={0} fontSize={["12px", "16px"]}>
                        {formatCash(game.final_score)}
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

      <SeasonDetailsModal />
    </VStack>
  );
});
