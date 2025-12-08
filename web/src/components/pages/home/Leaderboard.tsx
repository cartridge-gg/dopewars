import { Loader } from "@/components/layout/Loader";
import {
  useActiveGamesBySeason,
  useConfigStore,
  useDojoContext,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
} from "@/dojo/hooks";
import colors from "@/theme/colors";
import { formatCash } from "@/utils/ui";
import { Box, HStack, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { Arrow, InfosIcon, PaperIcon, Trophy } from "../../icons";
import { Config } from "@/dojo/stores/config";
import { ComponentValueEvent, useDopeStore } from "@/dope/store";
import { hash, shortString, uint256 } from "starknet";
import { Layer } from "@/dope/components";
import { Tooltip } from "@/components/common";
import { useSwipeable } from "react-swipeable";
import { DW_NS } from "@/dojo/constants";
import { getSwapQuote, PAPER, USDC } from "@/hooks/useEkubo";
import { mergeLeaderboardEntries } from "@/utils/leaderboard";
import { LeaderboardItem } from "./LeaderboardItem";

// Cache for PAPER price (USD per PAPER)
let paperPriceCache: { price: number; timestamp: number } | null = null;
const PRICE_CACHE_DURATION = 30000; // 30 seconds in milliseconds

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
        <Text color="neon.500">ENDS:</Text>
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
  const [usdValue, setUsdValue] = useState<number | null>(null);

  const { season } = useSeasonByVersion(selectedVersion);

  const {
    registeredGames,
    isFetching: isFetchingRegisteredGames,
    refetch: refetchRegisteredGames,
  } = useRegisteredGamesBySeason(selectedVersion);

  const {
    activeGames,
    isFetching: isFetchingActiveGames,
    refetch: refetchActiveGames,
  } = useActiveGamesBySeason(selectedVersion);

  const mergedEntries = useMemo(() => {
    return mergeLeaderboardEntries(registeredGames, activeGames, account?.address || "");
  }, [registeredGames, activeGames, account?.address]);

  useEffect(() => {
    if (!config) return;

    setCurrentVersion(config?.ryo.season_version || 0);
    refetchRegisteredGames();
    refetchActiveGames();
  }, [config]);

  useEffect(() => {
    if (!season?.paper_balance) {
      setUsdValue(null);
      return;
    }

    const now = Date.now();

    // Check if we have a valid cached price
    if (paperPriceCache && now - paperPriceCache.timestamp < PRICE_CACHE_DURATION) {
      // Use cached price
      const totalUsd = (season.paper_balance || 0) * paperPriceCache.price;
      setUsdValue(totalUsd);
      return;
    }

    // Fetch PAPER to USDC conversion rate using 1000 PAPER for better slippage accuracy
    getSwapQuote(1000, PAPER, USDC, false)
      .then((quote) => {
        const usdPerPaper = quote.amountOut / 1000;
        // Update cache
        paperPriceCache = { price: usdPerPaper, timestamp: now };
        const totalUsd = (season.paper_balance || 0) * usdPerPaper;
        setUsdValue(totalUsd);
      })
      .catch((e) => {
        console.error("Failed to fetch USD value:", e);
        setUsdValue(null);
      });
  }, [season?.paper_balance]);

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
          <VStack textStyle="subheading" fontSize="12px" w="full" justifyContent="center" position="relative" gap={1}>
            <HStack gap={1} alignItems="center">
              <Text cursor="pointer" onClick={() => onDetails(selectedVersion)}>
                SEASON {selectedVersion}
              </Text>
              <Box cursor="pointer" onClick={() => uiStore.openSeasonDetails()}>
                <InfosIcon />
              </Box>
            </HStack>
            <HStack gap={1} alignItems="center" textStyle="subheading" fontSize="12px">
              <Text color="neon.500">REWARDS:</Text>
              <Text color="yellow.400">
                <PaperIcon color="yellow.400" mr={1} />
                {formatCash(season.paper_balance || 0).replace("$", "")}
              </Text>
              {usdValue !== null && (
                <Text color="neon.500" fontSize="10px">
                  (${Math.abs(usdValue).toFixed(2)})
                </Text>
              )}
            </HStack>
            {selectedVersion === currentVersion && (
              <Countdown date={new Date(season.next_version_timestamp * 1_000)} renderer={renderer}></Countdown>
            )}
          </VStack>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedVersion < currentVersion ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
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
        {(isFetchingRegisteredGames || isFetchingActiveGames) && <Loader />}
        {!isFetchingRegisteredGames && !isFetchingActiveGames && (
          <UnorderedList boxSize="full" variant="dotted" h="auto">
            {mergedEntries && mergedEntries.length > 0 ? (
              mergedEntries.map((entry, index) => {
                const isOwn = BigInt(entry.player_id) === BigInt(account?.address || 0);

                return (
                  <LeaderboardItem
                    key={`${entry.type}-${entry.game_id}`}
                    entry={entry}
                    index={index}
                    isOwn={isOwn}
                    config={config}
                    registeredGamesCount={registeredGames.length}
                  />
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
    const [usdValue, setUsdValue] = useState<number | null>(null);

    const suffixes = getComponentValuesBySlug("DopeGear", "Suffixes");
    const bodies = getComponentValuesBySlug("DopeHustlers", "Body");

    const seed = uint256.bnToUint256(
      hash.computePoseidonHashOnElements([shortString.encodeShortString(DW_NS), seasonVersion, position]),
    );

    useEffect(() => {
      if (!claimable) {
        setUsdValue(null);
        return;
      }

      const now = Date.now();

      // Check if we have a valid cached price
      if (paperPriceCache && now - paperPriceCache.timestamp < PRICE_CACHE_DURATION) {
        // Use cached price
        const totalUsd = claimable * paperPriceCache.price;
        setUsdValue(totalUsd);
        return;
      }

      // Fetch PAPER to USDC conversion rate using 1000 PAPER for better slippage accuracy
      getSwapQuote(1000, PAPER, USDC, false)
        .then((quote) => {
          const usdPerPaper = quote.amountOut / 1000;
          // Update cache
          paperPriceCache = { price: usdPerPaper, timestamp: now };
          const totalUsd = claimable * usdPerPaper;
          setUsdValue(totalUsd);
        })
        .catch((e) => {
          console.error("Failed to fetch USD value:", e);
          setUsdValue(null);
        });
    }, [claimable]);

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
        <HStack w="full" borderBottom="solid 1px" borderColor="neon.700" justifyContent="space-between">
          <HStack>
            <PaperIcon width="24px" height="24px" />
            <Text letterSpacing={0} ml={2} fontSize="xs">
              {claimable ? formatCash(claimable).replace("$", "") : "???"} Paper
            </Text>
          </HStack>
          {usdValue !== null && (
            <Text letterSpacing={0} fontSize="10px" color="neon.500">
              (${Math.abs(usdValue).toFixed(2)})
            </Text>
          )}
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
