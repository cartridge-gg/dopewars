import { Loader } from "@/components/layout/Loader";
import {
  useConfigStore,
  useDojoContext,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
} from "@/dojo/hooks";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { Box, Heading, HStack, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import Countdown from "react-countdown";
import { Arrow, InfosIcon, PaperIcon, Skull, Trophy } from "../../icons";
import { Dopewars_Game as Game } from "@/generated/graphql";
import { Config } from "@/dojo/stores/config";
import { getPayedCount } from "@/dojo/helpers";
import { HustlerAvatarIcon } from "../profile/HustlerAvatarIcon";
import { ComponentValueEvent, useDopeStore } from "@/dope/store";
import { hash, shortString, uint256 } from "starknet";
import { Layer } from "@/dope/components";
import { Tooltip } from "@/components/common";
import { useSwipeable } from "react-swipeable";

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

export const Leaderboard = observer(({ config }: { config?: Config }) => {
  const { router, gameId } = useRouterContext();

  const { uiStore } = useDojoContext();
  const { account } = useAccount();

  const [currentVersion, setCurrentVersion] = useState(config?.ryo.season_version || 0);
  const [selectedVersion, setSelectedVersion] = useState(config?.ryo.season_version || 0);

  const { season } = useSeasonByVersion(selectedVersion);

  const {
    registeredGames,
    isFetching: isFetchingRegisteredGames,
    refetch: refetchRegisteredGames,
  } = useRegisteredGamesBySeason(selectedVersion);

  const payedCount = getPayedCount(registeredGames.length);

  useEffect(() => {
    if (!config) return;

    setCurrentVersion(config?.ryo.season_version || 0);
    refetchRegisteredGames();
  }, [config]);

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

  const { ref: swipeableRef } = useSwipeable({ delta: 50, onSwipedLeft: onNext, onSwipedRight: onPrev });

  if (!config || !registeredGames || !season) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%" ref={swipeableRef}>
      <VStack my="15px" w="full">
        <HStack w="full" justifyContent="space-between">
          <Arrow
            direction="left"
            cursor="pointer"
            opacity={selectedVersion > 1 ? "1" : "0.25"}
            onClick={onPrev}
          ></Arrow>
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
            <Countdown date={new Date(season.next_version_timestamp * 1_000)} renderer={renderer}></Countdown>
            <Box cursor="pointer" onClick={() => uiStore.openSeasonDetails()}>
              <InfosIcon />
            </Box>
          </HStack>
        )}
      </VStack>
      <VStack
        boxSize="full"
        gap="20px"
        maxH={["calc(100dvh - 350px)", "calc(100dvh - 380px)"]}
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
                const isOwn = BigInt(game.player_id) === BigInt(account?.address || 0);
                const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
                const avatarColor = isOwn ? "yellow" : "green";
                const displayName = game.player_name ? `${game.player_name}${isOwn ? " (you)" : ""}` : "Anonymous";

                return (
                  <ListItem color={color} key={game.game_id}>
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
                        <HustlerAvatarIcon
                          gameId={game.game_id}
                          // @ts-ignore
                          tokenIdType={game.token_id_type}
                          // @ts-ignore
                          tokenId={game.token_id}
                        />
                      </Box>

                      <HStack>
                        <Text
                          flexShrink={0}
                          maxWidth={["150px", "350px"]}
                          whiteSpace="nowrap"
                          overflow="hidden"
                          fontSize={["12px", "16px"]}
                          cursor="pointer"
                          onClick={() => router.push(`/0x${game.game_id.toString(16)}/logs`)}
                        >
                          {displayName} <span style={{ fontSize: "9px" }}>(x{game.multiplier})</span>
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
                        {formatCash(game.final_score)}
                      </Text>

                      {game.claimable > 0 && (
                        <Text flexShrink={0} fontSize={["12px", "16px"]}>
                          <Tooltip
                            placement="left"
                            // maxW="300px"
                            content={
                              <RewardDetails
                                claimable={game.claimable}
                                position={game.position}
                                seasonVersion={game.season_version}
                              />
                            }
                            color="neon.400"
                          >
                            <span>
                              <Trophy />
                              {/* {game.claimable} .. */}
                            </span>
                          </Tooltip>
                        </Text>
                      )}

                      {game.season_version === config.ryo.season_version && index + 1 <= payedCount && (
                        <Text flexShrink={0} fontSize={["12px", "16px"]}>
                          <Tooltip
                            // maxW="300px"
                            placement="left"
                            content={<RewardDetails position={index + 1} seasonVersion={game.season_version} />}
                            color="neon.400"
                          >
                            {/* getGearItemRewards(index + 1) */}
                            <span>
                              <Trophy opacity={0.5} />
                            </span>
                          </Tooltip>
                        </Text>
                      )}
                      {/* <RewardDetails position={index + 1} seasonVersion={game.season_version} /> */}
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

export const RewardDetails = observer(
  ({ seasonVersion, position, claimable }: { seasonVersion: number; position: number; claimable?: number }) => {
    const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);
    const configStore = useConfigStore();

    const suffixes = getComponentValuesBySlug("DopeGear", "Suffixes");
    const bodies = getComponentValuesBySlug("DopeHustlers", "Body");

    const seed = uint256.bnToUint256(hash.computePoseidonHashOnElements([seasonVersion, position]));

    const rewards = useMemo(() => {
      const items: ComponentValueEvent[] = [];

      if (position == 1) {
        // MUST match component list order
        const slots = ["Clothe", "Vehicle", "Drug", "Waist", "Foot", "Weapon", "Hand", "Neck", "Ring", "Accessory"];
        let suffix = undefined;

        for (let slot of slots) {
          const componentValues = getComponentValuesBySlug("DopeGear", slot);
          const slot_slug = shortString.encodeShortString(slot);
          const random = BigInt(hash.computePoseidonHashOnElements([slot_slug, seed.low, seed.high]));
          let itemId = random % BigInt(componentValues.length);
          if (slot === "Accessory") {
            itemId = 0n; // crown
          }
          const item = Object.assign({}, componentValues.find((i) => BigInt(i.id) === itemId)!);

          if (!suffix) {
            const suffixId = (random % BigInt(suffixes.length - 1)) + 1n;
            suffix = suffixes.find((i) => BigInt(i.id) === suffixId);
          }
          item.value = item.value + " " + suffix!.value + " +1";

          items.push(item);
        }
      } else if (position == 2) {
        const slots = ["Weapon", "Clothe", "Vehicle", "Foot", "Accessory"];
        let suffix = undefined;

        for (let slot of slots) {
          const componentValues = getComponentValuesBySlug("DopeGear", slot);
          const slot_slug = shortString.encodeShortString(slot);
          const random = BigInt(hash.computePoseidonHashOnElements([slot_slug, seed.low, seed.high]));
          let itemId = random % BigInt(componentValues.length);
          if (slot === "Accessory" && itemId < 3) {
            itemId = 27n; // paper id
          }
          const item = Object.assign({}, componentValues.find((i) => BigInt(i.id) === itemId)!);

          if (!suffix) {
            const suffixId = (random % BigInt(suffixes.length - 1)) + 1n;
            suffix = suffixes.find((i) => BigInt(i.id) === suffixId);
          }
          item.value = item.value + " " + suffix!.value;
          items.push(item);
        }
      } else if (position == 3) {
        const slots = ["Weapon", "Clothe", "Vehicle", "Foot", "Accessory"];
        for (let slot of slots) {
          const componentValues = getComponentValuesBySlug("DopeGear", slot);
          const slot_slug = shortString.encodeShortString(slot);
          const random = BigInt(hash.computePoseidonHashOnElements([slot_slug, seed.low, seed.high]));
          let itemId = random % BigInt(componentValues.length);
          if (slot === "Accessory" && itemId < 3) {
            itemId = 27n; // paper id
          }
          const item = Object.assign({}, componentValues.find((i) => BigInt(i.id) === itemId)!);
          const dopeness = random % 21n;
          if (dopeness > 14) {
            const suffixId = (random % BigInt(suffixes.length - 1)) + 1n;
            const suffix = suffixes.find((i) => BigInt(i.id) === suffixId);
            item.value = item.value + " " + suffix!.value;
          }

          items.push(item);
        }
      } else {
        const accessories = getComponentValuesBySlug("DopeGear", "Accessory");
        const slot_slug = shortString.encodeShortString("Accessory");
        const random = BigInt(hash.computePoseidonHashOnElements([slot_slug, seed.low, seed.high]));
        let accessoryId = random % BigInt(accessories.length);
        if (accessoryId < 3) {
          accessoryId = 27n; // paper id
        }
        const accessory = accessories.find((i) => BigInt(i.id) === accessoryId)!;
        items.push(accessory);
      }

      return items;
    }, [position, seasonVersion]);

    return (
      <VStack alignItems="flex-start" p={1} gap={1}>
        <Text textStyle="subheading" fontSize="12px" w="full" textAlign="center" my={2}>
          RANK {position} REWARDS
        </Text>
        <HStack w="full" borderBottom="solid 1px" borderColor="neon.700">
          <PaperIcon width="24px" height="24px" />
          <Text letterSpacing={0} ml={2} fontSize="xs">
            {claimable ? formatCash(claimable).replace("$", "") : "???"} Paper
          </Text>
        </HStack>
        {position <= 3 && (
          <HStack w="full" borderBottom="solid 1px" borderColor="neon.700">
            <Layer rects={bodies[1].resources[0]} width="24px" height="24px" crop={true} />
            <Text letterSpacing={0} ml={2} fontSize="xs">
              Naked Hustler
            </Text>
          </HStack>
        )}

        {rewards.map((item) => {
          return (
            <HStack w="full" key={`${item.id}-${item.component_id}`} borderBottom="solid 1px" borderColor="neon.700">
              <Layer rects={item.resources[0]} width="24px" height="24px" crop={true} />
              <Text
                letterSpacing={0}
                ml={2}
                fontSize="xs"
                textOverflow="clip"
                whiteSpace="nowrap"
                overflow="hidden"
                w="100%"
              >
                {item.value}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    );
  },
);
